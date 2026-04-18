import axios, { AxiosInstance } from 'axios';
import { providersConfig } from '../../config/providers.config';
import redisClient from '../../utils/redis';

class AiraloClient {
  private client: AxiosInstance;
  private readonly CACHE_KEY = 'AIRALO_BEARER_TOKEN';

  constructor() {
    this.client = axios.create({
      baseURL: providersConfig.airalo.baseUrl,
      headers: {
        Accept: 'application/json',
      },
    });

    // Request interceptor to inject Bearer token automatically
    this.client.interceptors.request.use(async (config) => {
      // Avoid infinite loop during auth
      if (config.url === '/token') return config;

      const token = await this.authenticate();
      config.headers.Authorization = `Bearer ${token}`;
      return config;
    });
  }

  /**
   * Retrieves OAuth2 client_credentials token, caching it in Redis globally.
   */
  async authenticate(): Promise<string> {
    const cachedToken = await redisClient.get(this.CACHE_KEY);
    if (cachedToken) return cachedToken;

    if (!providersConfig.airalo.clientId) {
      console.warn(
        'AIRALO_CLIENT_ID missing, falling back to mock token (or failing).'
      );
      if (providersConfig.airalo.useMock) return 'MOCK_TOKEN_123';
      throw new Error('Airalo credentials missing in production');
    }

    try {
      const form = new URLSearchParams();
      form.append('client_id', providersConfig.airalo.clientId);
      form.append('client_secret', providersConfig.airalo.clientSecret);
      form.append('grant_type', 'client_credentials');

      const response = await this.client.post('/token', form.toString(), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });

      const { access_token, expires_in } = response.data.data;

      // Store in redis slightly less than expiry to avoid edge cases (expires_in usually 3600s)
      await redisClient.set(this.CACHE_KEY, access_token, {
        EX: expires_in - 60,
      });

      return access_token;
    } catch (error: any) {
      throw new Error(
        `Airalo Auth Failed: ${error?.response?.data?.message || error.message}`
      );
    }
  }

  // --- CATALOG ENDPOINTS ---

  async getPackages(countryCode: string = '') {
    if (providersConfig.airalo.useMock) return this.mockPackages(countryCode);

    // E.g. GET /packages?filter[country]=US
    const params = countryCode ? { 'filter[country]': countryCode } : {};
    const response = await this.client.get('/packages', { params });
    return response.data.data;
  }

  async getPackage(packageId: string) {
    if (providersConfig.airalo.useMock)
      return this.mockSinglePackage(packageId);

    const response = await this.client.get(`/packages/${packageId}`);
    return response.data.data;
  }

  // --- ORDER ENDPOINTS ---

  async createOrder(packageId: string, quantity: number = 1) {
    if (providersConfig.airalo.useMock)
      return this.mockCreateOrder(packageId, quantity);

    const response = await this.client.post('/orders', {
      package_id: packageId,
      quantity,
    });
    return response.data.data;
  }

  async getOrder(orderId: string | number) {
    if (providersConfig.airalo.useMock) return this.mockGetOrder(orderId);

    // GET /orders/:id includes eSIM details (iccid, lpa) once completed
    const response = await this.client.get(`/orders/${orderId}?include=sims`);
    return response.data.data;
  }

  async getEsim(iccid: string) {
    if (providersConfig.airalo.useMock) return this.mockGetEsim(iccid);

    const response = await this.client.get(`/sims/${iccid}`);
    return response.data.data;
  }

  // --- MOCK RESPONSES FOR DEVELOPMENT ---

  private mockPackages(countryCode: string) {
    return [
      {
        id: `mock_${countryCode}_10gb`,
        slug: `mock-${countryCode}-10gb`,
        title: `SOUFSIM Core ${countryCode}`,
        data: '10 GB',
        validity: '30 days',
        price: 15.0,
      },
    ];
  }

  private mockSinglePackage(id: string) {
    return {
      id,
      title: 'Mocked Package',
      price: 15.0,
      data: '10 GB',
      validity: '30 days',
    };
  }

  private mockCreateOrder(packageId: string, quantity: number) {
    return {
      id: Math.floor(Math.random() * 1000000),
      code: `ORD-AIRALO-${Math.random().toString(36).substring(7).toUpperCase()}`,
      package_id: packageId,
      quantity,
      status: 'completed', // Airalo mock instafills
    };
  }

  private mockGetOrder(orderId: string | number) {
    return {
      id: orderId,
      status: 'completed',
      sims: [
        {
          id: Math.floor(Math.random() * 1000000),
          iccid: `89324320${Math.floor(Math.random() * 100000000000)}`,
          lpa: 'LPA:1$sm-v4-004-a-gtm.pr.go-esim.com$MOCK-CODE',
          qrcode_url: null,
        },
      ],
    };
  }

  private mockGetEsim(iccid: string) {
    return {
      iccid,
      status: 'active',
      usage: {
        data: 1024,
        remaining: 9216,
      },
    };
  }
}

export const airaloClient = new AiraloClient();
