import type { SellerEconomics, SellerProfile } from "@/types/seller-intelligence";

export const sellerIntelligenceProfiles: Record<SellerProfile, SellerEconomics> = {
  dorota: {
    profile: "dorota",
    displayName: "Dorota",
    gmv: 28000,
    returnRatePct: 18,
    returnCostPln: 860,
    netMarginPct: 14,
    categoryMedianPct: 11,
    vsMedianPp: 3,
    commissionPln: 4200,
    netEarningsPln: 3900,
    category: "Odzież damska",
  },
  bartek: {
    profile: "bartek",
    displayName: "Bartek",
    gmv: 45000,
    returnRatePct: 44,
    returnCostPln: 3400,
    netMarginPct: 12,
    categoryMedianPct: 18,
    vsMedianPp: -6,
    commissionPln: 6750,
    netEarningsPln: 5600,
    category: "Odzież męska",
  },
  kamil: {
    profile: "kamil",
    displayName: "Kamil",
    gmv: 15000,
    returnRatePct: 12,
    returnCostPln: 310,
    netMarginPct: 11,
    categoryMedianPct: 9,
    vsMedianPp: 2,
    commissionPln: 2250,
    netEarningsPln: 1640,
    category: "Akcesoria",
  },
};

export const PRICE_POINTS = [299, 399, 499] as const;

export function getSellerIntelligence(profile: string): SellerEconomics | undefined {
  return sellerIntelligenceProfiles[profile as SellerProfile];
}
