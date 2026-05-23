"use client";

import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, CreditCard, Search, ShieldCheck } from "lucide-react";
import { BirdCard } from "@/components/bird-card";
import { useStore } from "@/components/providers/store-provider";

const features = [
  {
    title: "Katalog terbuka",
    description: "Pembeli bisa melihat stok, harga, lokasi, dan kondisi murai sebelum checkout.",
    icon: Search,
  },
  {
    title: "Pembayaran rapi",
    description: "Bank dan e-wallet dipisahkan, lalu bukti pembayaran masuk ke riwayat transaksi.",
    icon: CreditCard,
  },
  {
    title: "Verifikasi admin",
    description: "Admin bisa memeriksa pembayaran dan memperbarui status transaksi.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  const { birds, categories, currentUser } = useStore();
  const featuredBirds = birds
    .filter((bird) => bird.isFeatured || bird.status === "AVAILABLE")
    .slice(0, 3);
  const dashboardHref = currentUser?.role === "USER" ? "/dashboard" : "/admin";

  return (
    <>
      <section className="relative overflow-hidden bg-emerald-950 text-white">
        <Image
          src="/images/hero-murai.png"
          alt="Murai batu premium"
          fill
          priority
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/85 to-emerald-950/35" />
        <div className="relative mx-auto grid min-h-[520px] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_380px] lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-sm font-semibold text-emerald-50">
              <BadgeCheck className="size-4" />
              Marketplace burung murai siap transaksi
            </div>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl">
              MuraiMarket
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-emerald-50 sm:text-lg">
              Platform jual beli burung murai dengan katalog publik, checkout pembeli,
              upload bukti pembayaran, struk, dan panel admin untuk verifikasi.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/burung"
                className="rounded-md bg-amber-300 px-5 py-3 text-center font-semibold text-emerald-950 hover:bg-amber-200"
              >
                Lihat katalog
              </Link>
              <Link
                href={currentUser ? dashboardHref : "/login"}
                className="rounded-md border border-white/40 px-5 py-3 text-center font-semibold text-white hover:bg-white/10"
              >
                {currentUser ? "Buka dashboard" : "Masuk untuk transaksi"}
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm font-semibold text-emerald-100">Ringkasan marketplace</p>
            <div className="mt-4 grid gap-3">
              {[
                { label: "Burung tersedia", value: birds.filter((bird) => bird.status === "AVAILABLE").length },
                { label: "Kategori", value: categories.length },
                { label: "Metode bayar", value: "Bank + E-wallet" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-md bg-white/10 px-4 py-3"
                >
                  <span className="text-sm text-emerald-50">{item.label}</span>
                  <span className="font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-10 sm:px-6 md:grid-cols-3 lg:px-8">
        {features.map(({ title, description, icon: Icon }) => (
          <article key={title} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <Icon className="size-6 text-emerald-800" />
            <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              Pilihan unggulan
            </p>
            <h2 className="mt-1 text-2xl font-bold text-slate-950">Murai siap dipinang</h2>
          </div>
          <Link href="/burung" className="text-sm font-semibold text-emerald-800">
            Semua katalog
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredBirds.map((bird) => (
            <BirdCard key={bird.id} bird={bird} />
          ))}
        </div>
      </section>
    </>
  );
}
