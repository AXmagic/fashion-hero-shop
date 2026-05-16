"use client";

import { useEffect, useState } from "react";
import type { SellerEconomics, PricePoint, CtaEvent } from "@/types/seller-intelligence";
import { PRICE_POINTS } from "@/data/seller-intelligence";

interface Props {
  seller: SellerEconomics;
}

function formatPln(n: number) {
  return n.toLocaleString("pl-PL") + " PLN";
}

function MetricCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub?: string;
  accent?: "positive" | "negative" | "neutral";
}) {
  const accentClass =
    accent === "positive"
      ? "text-emerald-600"
      : accent === "negative"
      ? "text-red-500"
      : "text-slate-900";
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-4">
      <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accentClass}`}>{value}</p>
      {sub && <p className="text-xs text-slate-400 mt-1">{sub}</p>}
    </div>
  );
}

function BlurredCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="select-none pointer-events-none blur-sm opacity-60 p-4">{children}</div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/60 backdrop-blur-[2px]">
        <svg className="size-5 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-xs font-semibold text-slate-500">{title}</p>
      </div>
    </div>
  );
}

function logEvent(event: CtaEvent) {
  try {
    const key = "fashionhero_at_d1_events";
    const existing: CtaEvent[] = JSON.parse(localStorage.getItem(key) ?? "[]");
    existing.push(event);
    localStorage.setItem(key, JSON.stringify(existing));
  } catch {
    // localStorage unavailable
  }
}

export default function SellerHubClient({ seller }: Props) {
  const [pricePoint, setPricePoint] = useState<PricePoint | null>(null);
  const [ctaClicked, setCtaClicked] = useState(false);
  const [layer2Clicked, setLayer2Clicked] = useState(false);

  useEffect(() => {
    const sessionKey = `fashionhero_price_${seller.profile}`;
    const stored = sessionStorage.getItem(sessionKey);
    if (stored && PRICE_POINTS.includes(Number(stored) as PricePoint)) {
      setPricePoint(Number(stored) as PricePoint);
    } else {
      const picked = PRICE_POINTS[Math.floor(Math.random() * PRICE_POINTS.length)];
      sessionStorage.setItem(sessionKey, String(picked));
      setPricePoint(picked);
    }
  }, [seller.profile]);

  function handleCtaClick(label: "trial" | "contact") {
    if (!pricePoint) return;
    const ev: CtaEvent = {
      event: "cta_click",
      price: pricePoint,
      profile: seller.profile,
      feature: label,
      timestamp: new Date().toISOString(),
    };
    logEvent(ev);
    setCtaClicked(true);
  }

  function handleUnlockClick(feature: string) {
    const ev: CtaEvent = {
      event: "unlock_click",
      profile: seller.profile,
      feature,
      timestamp: new Date().toISOString(),
    };
    logEvent(ev);
    setLayer2Clicked(true);
  }

  const vsMedianSign = seller.vsMedianPp >= 0 ? "+" : "";
  const vsMedianAccent: "positive" | "negative" = seller.vsMedianPp >= 0 ? "positive" : "negative";

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-md mx-auto px-4 pt-8 pb-24">

        {/* Header */}
        <div className="mb-8">
          <a href="/seller-hub" className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-slate-600 mb-4">
            <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Zmień profil
          </a>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                FashionHero · Seller Intelligence
              </p>
              <h1 className="text-2xl font-bold text-slate-900 mt-1">
                Cześć, {seller.displayName} 👋
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-500 mt-1">{seller.category}</p>
        </div>

        {/* ── WARSTWA 1: MOJA EKONOMIKA ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="size-2 rounded-full bg-emerald-400 inline-block" />
            <h2 className="text-sm font-semibold text-slate-700 uppercase tracking-wide">
              Warstwa 1 · Moja Ekonomika
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <MetricCard
              label="GMV / mies."
              value={formatPln(seller.gmv)}
              sub="Sprzedaż brutto"
              accent="neutral"
            />
            <MetricCard
              label="Marża netto"
              value={`${seller.netMarginPct}%`}
              sub={`Mediana: ${seller.categoryMedianPct}%`}
              accent={vsMedianAccent}
            />
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <MetricCard
              label="Koszt zwrotów"
              value={`−${formatPln(seller.returnCostPln)}`}
              sub={`${seller.returnRatePct}% zwrotów`}
              accent="negative"
            />
            <MetricCard
              label="Zarobek netto"
              value={formatPln(seller.netEarningsPln)}
              sub="Po prowizji i zwrotach"
              accent="positive"
            />
          </div>

          {/* vs. mediana alert */}
          <div
            className={`rounded-2xl p-4 border ${
              seller.vsMedianPp >= 0
                ? "bg-emerald-50 border-emerald-200"
                : "bg-amber-50 border-amber-200"
            }`}
          >
            <p className="text-sm font-semibold text-slate-800">
              {seller.vsMedianPp >= 0 ? "✅" : "⚠️"} Twoja marża jest{" "}
              <span className={seller.vsMedianPp >= 0 ? "text-emerald-600" : "text-amber-600"}>
                {vsMedianSign}{seller.vsMedianPp} pp
              </span>{" "}
              {seller.vsMedianPp >= 0 ? "powyżej" : "poniżej"} mediany w{" "}
              {seller.category}.
            </p>
            {seller.vsMedianPp < 0 && (
              <p className="text-xs text-amber-700 mt-1">
                Zwroty kosztują Cię ~{formatPln(seller.returnCostPln)}/mies. — to główny czynnik obniżający marżę.
              </p>
            )}
          </div>
        </section>

        {/* ── WARSTWA 2: PREMIUM PREVIEW ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <span className="size-2 rounded-full bg-slate-300 inline-block" />
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Warstwa 2 · Narzędzia Premium
            </h2>
          </div>

          <div className="space-y-3">
            {/* Price Monitor blurred */}
            <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="select-none pointer-events-none blur-sm opacity-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Price Monitor</p>
                <div className="space-y-2">
                  {["Sukienka letnia", "Bluzka casual", "Spodnie slim"].map((item) => (
                    <div key={item} className="flex justify-between text-sm">
                      <span className="text-slate-700">{item}</span>
                      <span className="text-red-500 font-semibold">−8%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] p-4">
                <svg className="size-5 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-sm font-semibold text-slate-700 mb-1">Price Monitor</p>
                <p className="text-xs text-slate-400 text-center mb-3">
                  Ceny Twoich produktów vs. konkurencja w czasie rzeczywistym
                </p>
                <button
                  onClick={() => handleUnlockClick("price_monitor")}
                  className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Odblokuj
                </button>
              </div>
            </div>

            {/* Trend Feed blurred */}
            <div className="relative bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="select-none pointer-events-none blur-sm opacity-50 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase mb-3">Trend Feed</p>
                <div className="space-y-2">
                  {["Minimalizm rośnie +24%", "Pastelowe kolory →", "Oversized −12%"].map((t) => (
                    <div key={t} className="flex items-center gap-2 text-sm text-slate-700">
                      <span className="size-1.5 rounded-full bg-slate-400 shrink-0" />
                      {t}
                    </div>
                  ))}
                </div>
              </div>
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/70 backdrop-blur-[2px] p-4">
                <svg className="size-5 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <p className="text-sm font-semibold text-slate-700 mb-1">Trend Feed</p>
                <p className="text-xs text-slate-400 text-center mb-3">
                  Trendy w Twojej kategorii — co kupują klienci w tym tygodniu
                </p>
                <button
                  onClick={() => handleUnlockClick("trend_feed")}
                  className="text-xs font-semibold bg-slate-900 text-white px-4 py-2 rounded-xl hover:bg-slate-700 transition-colors"
                >
                  Odblokuj
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ── WARSTWA 3: PRICING + CTA ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="size-2 rounded-full bg-slate-300 inline-block" />
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wide">
              Warstwa 3 · Bundle
            </h2>
          </div>

          {ctaClicked ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
              <div className="text-3xl mb-3">✅</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Dziękujemy!</h3>
              <p className="text-sm text-slate-600">
                Zapisaliśmy Twoje zainteresowanie — odezwiemy się w ciągu 48h.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-6">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Seller Intelligence Bundle</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Dashboard · Price Monitor · Trend Feed</p>
                </div>
                <div className="text-right">
                  {pricePoint ? (
                    <>
                      <p className="text-2xl font-bold text-slate-900">{pricePoint} PLN</p>
                      <p className="text-xs text-slate-400">/miesięcznie</p>
                    </>
                  ) : (
                    <div className="w-16 h-8 bg-slate-100 animate-pulse rounded" />
                  )}
                </div>
              </div>

              <ul className="space-y-2 mb-6">
                {[
                  "Moja Ekonomika — marża netto, koszt zwrotów",
                  "Price Monitor — ceny vs. konkurencja",
                  "Trend Feed — co kupują klienci",
                  "Alerty marżowe i sezonowe",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                    <svg className="size-4 text-emerald-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="space-y-2">
                <button
                  onClick={() => handleCtaClick("trial")}
                  className="w-full bg-slate-900 text-white text-sm font-semibold py-3 rounded-xl hover:bg-slate-700 active:scale-[0.98] transition-all"
                >
                  Start free trial — 14 dni za darmo
                </button>
                <button
                  onClick={() => handleCtaClick("contact")}
                  className="w-full border border-slate-200 text-slate-700 text-sm font-semibold py-3 rounded-xl hover:bg-slate-50 active:scale-[0.98] transition-all"
                >
                  Zostaw kontakt — odezwiemy się
                </button>
              </div>

              <p className="text-xs text-center text-slate-400 mt-4">
                Bez karty kredytowej. Możesz zrezygnować w każdej chwili.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
