export type SellerProfile = "dorota" | "bartek" | "kamil";
export type PricePoint = 299 | 399 | 499;

export interface SellerEconomics {
  profile: SellerProfile;
  displayName: string;
  gmv: number;
  returnRatePct: number;
  returnCostPln: number;
  netMarginPct: number;
  categoryMedianPct: number;
  vsMedianPp: number;
  commissionPln: number;
  netEarningsPln: number;
  category: string;
}

export interface CtaEvent {
  event: "cta_click" | "unlock_click";
  price?: PricePoint;
  profile: SellerProfile;
  feature?: string;
  timestamp: string;
}
