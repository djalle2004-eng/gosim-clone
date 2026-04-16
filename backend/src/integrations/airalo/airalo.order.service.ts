import QRCode from 'qrcode';
import { airaloClient } from './airalo.client';
import prisma from '../../lib/db';
import { OrderStatus, EsimStatus } from '@prisma/client';

export class AiraloOrderService {
  /**
   * Entrypoint called by the Payment Webhook when an Order hits PAID status.
   * Initiates the Airalo provisioning loop for all Line Items handling Airalo Plans.
   */
  async provisionOrder(orderId: string) {
    console.log(`🔄 [Provisioning] Starting fulfillment for Order ${orderId}`);

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { orderItems: { include: { plan: true } } },
    });

    if (!order || order.status !== OrderStatus.PAID) {
      console.error(`❌ Order ${orderId} is not in PAID status or missing.`);
      return;
    }

    // Move to PROCESSING
    await prisma.order.update({
      where: { id: orderId },
      data: { status: OrderStatus.PROCESSING },
    });

    let allSuccessful = true;

    for (const item of order.orderItems) {
      if (item.plan.provider !== 'AIRALO' || !item.plan.providerId) continue;

      for (let i = 0; i < item.quantity; i++) {
        try {
          await this.provisionSingleItem(
            order.userId,
            item.id,
            item.plan.providerId,
            item.plan.dataAmount
          );
        } catch (error) {
          allSuccessful = false;
          console.error(
            `❌ Failed to provision Airalo item (Plan ${item.plan.name}):`,
            error
          );
        }
      }
    }

    if (allSuccessful) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: OrderStatus.COMPLETED },
      });
      console.log(`✅ [Provisioning] Order ${orderId} fulfilled successfully!`);
    } else {
      console.warn(
        `⚠️ [Provisioning] Order ${orderId} fulfilled partially or failed.`
      );
      // In a real app, send alert to Support manually here.
    }
  }

  private async provisionSingleItem(
    userId: string,
    orderItemId: string,
    airaloPackageId: string,
    dataTotalMB: number
  ) {
    // 1. Send Create Order Request to Airalo
    const airaloDraftParams = await airaloClient.createOrder(
      airaloPackageId,
      1
    );
    const airaloOrderId = airaloDraftParams.id;

    // 2. Poll for Completion (Airalo async processing timeout usually ~3-5 seconds)
    const completedAiraloOrder = await this.pollOrderCompletion(airaloOrderId);

    // 3. Extract payload
    const sim = completedAiraloOrder.sims[0];
    if (!sim || !sim.lpa)
      throw new Error(
        'Airalo returned completed order without generic LPA string.'
      );

    // 4. Fallback generate QRCode visually if Airalo's string URL misses
    const qrCodeBase64 = sim.qrcode_url
      ? sim.qrcode_url
      : await QRCode.toDataURL(sim.lpa);

    // 5. Store in Local Database
    await prisma.eSim.create({
      data: {
        userId,
        orderItemId,
        iccid: sim.iccid,
        qrCode: qrCodeBase64,
        activationCode: sim.lpa,
        status: EsimStatus.INACTIVE,
        dataTotal: dataTotalMB,
        dataUsed: 0,
      },
    });
  }

  /**
   * Polls the Airalo GET order endpoint every 5s until it is no longer pending. Timeout after 120s.
   */
  private async pollOrderCompletion(
    airaloOrderId: string | number,
    maxAttempts = 24
  ): Promise<any> {
    let attempts = 0;

    while (attempts < maxAttempts) {
      const orderRes = await airaloClient.getOrder(airaloOrderId);
      if (orderRes.status === 'completed') {
        return orderRes;
      }
      if (orderRes.status === 'failed' || orderRes.status === 'canceled') {
        throw new Error(
          `Airalo processing strictly failed with status: ${orderRes.status}`
        );
      }

      // Sleep 5 seconds
      await new Promise((resolve) => setTimeout(resolve, 5000));
      attempts++;
    }

    throw new Error('Airalo async processing timed out safely after polling.');
  }
}

export const airaloOrderService = new AiraloOrderService();
