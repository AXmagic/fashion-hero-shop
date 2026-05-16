import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getSellerIntelligence } from "@/data/seller-intelligence";
import SellerHubClient from "./seller-hub-client";

interface Props {
  params: Promise<{ profile: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { profile } = await params;
  const seller = getSellerIntelligence(profile);
  if (!seller) return { title: "Seller Hub — FashionHero" };
  return {
    title: `${seller.displayName} · Seller Intelligence — FashionHero`,
    description: `Panel ekonomiki sklepu dla ${seller.displayName}. Marża netto, koszt zwrotów, pozycja vs. mediana.`,
  };
}

export function generateStaticParams() {
  return [{ profile: "dorota" }, { profile: "bartek" }, { profile: "kamil" }];
}

export default async function SellerHubProfilePage({ params }: Props) {
  const { profile } = await params;
  const seller = getSellerIntelligence(profile);
  if (!seller) notFound();
  return <SellerHubClient seller={seller} />;
}
