export const providersConfig = {
  airalo: {
    baseUrl: process.env.AIRALO_API_URL || 'https://partners.airalo.com/v2',
    clientId: process.env.AIRALO_CLIENT_ID || '',
    clientSecret: process.env.AIRALO_CLIENT_SECRET || '',
    useMock:
      process.env.NODE_ENV === 'development' &&
      process.env.MOCK_PROVIDERS === 'true',
  },
  // Future extensibility
  esimGo: {
    baseUrl: process.env.ESIM_GO_API_URL || '',
    apiKey: process.env.ESIM_GO_API_KEY || '',
  },
};
