import crypto from 'crypto';

export interface EsimProvisionResult {
  iccid: string;
  qrCode: string;
  activationCode: string;
}

/**
 * Simulates external API calls to Telecom Providers (e.g. Airalo/eSIMGo)
 */
export const provisionESim = async (
  providerId: string,
  quantity: number = 1
): Promise<EsimProvisionResult> => {
  // Mock external API call:
  // await fetch('https://partners.airalo.com/api/v2/orders', { method: 'POST', body: JSON.stringify({ package_id: providerId, quantity }) })

  // Generate a valid-looking 19-digit ICCID
  const randomBytes = crypto.randomBytes(8).toString('hex').replace(/\D/g, '');
  const iccid = ('8904' + randomBytes).padEnd(19, '0').substring(0, 19);

  // LPA string format representing the digital Sim Profile payload
  const activationCode = `LPA:1$test-smdp.plus$${iccid}`;

  // Convert standard QR string to a functional image url
  const qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(activationCode)}`;

  return {
    iccid,
    qrCode,
    activationCode,
  };
};

export const deactivateESim = async (iccid: string): Promise<boolean> => {
  console.log(`[Telecom Mock] Deactivated ICCID: ${iccid}`);
  return true;
};
