import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Seller Intelligence Bundle — FashionHero",
  description: "Poznaj ekonomikę swojego sklepu. Marża netto, koszt zwrotów, pozycja vs. mediana kategorii.",
};

const profiles = [
  {
    slug: "dorota",
    name: "Dorota",
    shop: "Butik Doroty",
    category: "Odzież damska",
    gmv: "28 000 PLN/mies.",
    tag: "Powyżej mediany",
    tagColor: "text-emerald-700 bg-emerald-50",
  },
  {
    slug: "bartek",
    name: "Bartek",
    shop: "Bartek Sport & Casual",
    category: "Odzież męska",
    gmv: "45 000 PLN/mies.",
    tag: "Wysokie zwroty",
    tagColor: "text-amber-700 bg-amber-50",
  },
  {
    slug: "kamil",
    name: "Kamil",
    shop: "Kamil Accessories",
    category: "Akcesoria",
    gmv: "15 000 PLN/mies.",
    tag: "Rosnący seller",
    tagColor: "text-blue-700 bg-blue-50",
  },
];

export default function SellerHubPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 pt-12 pb-20">
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-widest uppercase text-slate-400">
            FashionHero · Prototype
          </span>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 leading-tight">
            Seller Intelligence Bundle
          </h1>
          <p className="mt-3 text-base text-slate-500">
            Wybierz profil demo, żeby zobaczyć jak wyglądałby Twój panel ekonomiki sklepu.
          </p>
        </div>

        <div className="space-y-4">
          {profiles.map((p) => (
            <Link
              key={p.slug}
              href={`/seller-hub/${p.slug}`}
              className="block bg-white rounded-2xl border border-slate-200 p-5 hover:border-slate-400 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg font-semibold text-slate-900">{p.name}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${p.tagColor}`}>
                      {p.tag}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{p.shop}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{p.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold text-slate-700">{p.gmv}</p>
                  <p className="text-xs text-slate-400 mt-0.5">GMV</p>
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs font-medium text-slate-400 gap-1">
                Otwórz panel ekonomiki
                <svg className="size-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-8 text-xs text-center text-slate-400">
          To jest prototype testowy — dane są fikcyjne. Nie podpina prawdziwych płatności.
        </p>
      </div>
    </main>
  );
}
