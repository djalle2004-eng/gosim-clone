export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface ESIMPlan {
  id: string;
  country: string;
  dataAllowanceInGB: number;
  validityInDays: number;
  priceInCents: number;
}
