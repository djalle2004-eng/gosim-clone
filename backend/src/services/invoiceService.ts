import { PrismaClient } from '@prisma/client';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

export class InvoiceService {
  /**
   * Generate PDF Invoice for a specific order
   */
  static async generateInvoice(orderId: string): Promise<Uint8Array> {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        orderItems: { include: { plan: true } },
      },
    });

    if (!order) throw new Error('Order not found');

    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const { width, height } = page.getSize();
    let y = height - 50;

    // --- Header ---
    page.drawText('SoufSim', {
      x: 50,
      y,
      size: 24,
      font: boldFont,
      color: rgb(0.03, 0.45, 0.82),
    });
    page.drawText('INVOICE', {
      x: width - 150,
      y,
      size: 24,
      font: boldFont,
      color: rgb(0.2, 0.2, 0.2),
    });

    y -= 40;
    page.drawText(`Invoice Number: INV-${order.id.slice(0, 8).toUpperCase()}`, {
      x: width - 250,
      y,
      size: 10,
      font,
    });
    y -= 15;
    page.drawText(`Date: ${order.createdAt.toISOString().split('T')[0]}`, {
      x: width - 250,
      y,
      size: 10,
      font,
    });
    y -= 15;
    page.drawText(`Status: ${order.status}`, {
      x: width - 250,
      y,
      size: 10,
      font,
    });

    // --- Billed To ---
    y -= 40;
    page.drawText('Billed To:', { x: 50, y, size: 12, font: boldFont });
    y -= 15;
    page.drawText(
      `${order.user.firstName || ''} ${order.user.lastName || ''}`,
      { x: 50, y, size: 10, font }
    );
    y -= 15;
    page.drawText(order.user.email, { x: 50, y, size: 10, font });

    if (order.user.taxId) {
      y -= 15;
      page.drawText(`Tax ID / VAT: ${order.user.taxId}`, {
        x: 50,
        y,
        size: 10,
        font,
      });
    }

    // --- Table Header ---
    y -= 50;
    page.drawRectangle({
      x: 50,
      y: y - 5,
      width: width - 100,
      height: 20,
      color: rgb(0.95, 0.95, 0.95),
    });
    page.drawText('Item Description', { x: 60, y, size: 10, font: boldFont });
    page.drawText('Qty', { x: 300, y, size: 10, font: boldFont });
    page.drawText('Unit Price', { x: 380, y, size: 10, font: boldFont });
    page.drawText('Total', { x: 480, y, size: 10, font: boldFont });

    // --- Table Rows ---
    y -= 25;
    order.orderItems.forEach((item) => {
      page.drawText(item.plan.name, { x: 60, y, size: 10, font });
      page.drawText(item.quantity.toString(), { x: 300, y, size: 10, font });
      page.drawText(`$${item.unitPrice.toFixed(2)}`, {
        x: 380,
        y,
        size: 10,
        font,
      });
      page.drawText(`$${item.totalPrice.toFixed(2)}`, {
        x: 480,
        y,
        size: 10,
        font,
      });
      y -= 20;
    });

    // --- Totals ---
    y -= 20;
    page.drawLine({
      start: { x: 350, y: y + 10 },
      end: { x: width - 50, y: y + 10 },
      thickness: 1,
      color: rgb(0.8, 0.8, 0.8),
    });

    const subtotal = order.totalAmount - order.taxAmount;
    page.drawText('Subtotal:', { x: 380, y, size: 10, font: boldFont });
    page.drawText(`$${subtotal.toFixed(2)}`, { x: 480, y, size: 10, font });

    y -= 15;
    page.drawText(`Tax (${order.taxRate}%):`, {
      x: 380,
      y,
      size: 10,
      font: boldFont,
    });
    page.drawText(`$${order.taxAmount.toFixed(2)}`, {
      x: 480,
      y,
      size: 10,
      font,
    });

    y -= 20;
    page.drawText('Total Amount:', { x: 380, y, size: 12, font: boldFont });
    page.drawText(`$${order.totalAmount.toFixed(2)}`, {
      x: 480,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0.03, 0.45, 0.82),
    });

    // --- QR Code ---
    // Generate verification QR code
    const verifyUrl = `https://soufsim-web.onrender.com/verify-invoice?id=${order.id}`;
    const qrDataUrl = await QRCode.toDataURL(verifyUrl, { margin: 1 });
    // Strip header
    const base64Data = qrDataUrl.replace(/^data:image\/png;base64,/, '');
    const qrImage = await pdfDoc.embedPng(base64Data);

    page.drawImage(qrImage, {
      x: 50,
      y: 50,
      width: 70,
      height: 70,
    });
    page.drawText('Scan to verify this invoice', {
      x: 50,
      y: 35,
      size: 8,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });

    // --- Footer ---
    page.drawText('Thank you for choosing SoufSim!', {
      x: width / 2 - 80,
      y: 30,
      size: 10,
      font: boldFont,
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  }
}
