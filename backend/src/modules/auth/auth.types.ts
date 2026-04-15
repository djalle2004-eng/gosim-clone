export interface JwtPayload {
  id: string;
  role: string;
  email: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
