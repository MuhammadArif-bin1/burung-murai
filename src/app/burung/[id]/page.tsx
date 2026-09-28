"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Heart, MapPin, ChevronRight } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/providers/store-provider";
import { StatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { formatCurrency, genderLabel } from "@/lib/format";

export default function BirdDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const {
    currentUser,
    favorites,
    toggleFavorite,
    createTransaction,
    getBirdById,
    getCategoryById,
  } = useStore();
  const bird = getBirdById(params.id);
  const [activeImage, setActiveImage] = useState(0);

  if (!bird) {
    return (
      <section className="mx-auto w-full max-w-4xl px-4 py-8">
        <EmptyState
          title="Burung tidak ditemukan"
          description="Data burung yang Anda cari tidak tersedia."
        />
      </section>
    );
  }

  const selectedBird = bird;
  const category = getCategoryById(bird.categoryId);
  const favorite = favorites.some(
    (item) => item.userId === currentUser?.id && item.birdId === bird.id,
  );

  function handleBuy() {
    const transaction = createTransaction(selectedBird.id);
    if (transaction) {
      router.push(`/dashboard/transaksi/${transaction.id}`);
    }
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs text-stone-500 font-body">
        <Link href="/beranda" className="hover:text-stone-900 transition-colors">Beranda</Link>
        <ChevronRight className="size-3" />
        <Link href="/burung" className="hover:text-stone-900 transition-colors">Katalog</Link>
        <ChevronRight className="size-3" />
        <span className="text-stone-900">{bird.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        {/* Images */}
        <div>
          <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
            <Image
              src={bird.images[activeImage]}
              alt={bird.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 55vw"
            />
          </div>
          <div className="mt-3 flex gap-2">
            {bird.images.map((image, index) => (
              <button
                type="button"
                key={image}
                onClick={() => setActiveImage(index)}
                className={`relative aspect-square w-20 overflow-hidden border-2 transition-all ${
                  activeImage === index
                    ? "border-stone-900"
                    : "border-transparent hover:border-stone-300"
                }`}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              {category && (
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-stone-500 font-body">
                  {category.name}
                </p>
              )}
              <h1 className="mt-2 text-3xl font-bold text-stone-900 font-heading">{bird.name}</h1>
            </div>
            <StatusBadge kind="bird" status={bird.status} />
          </div>

          <p className="mt-6 text-3xl font-bold text-stone-900 font-body">
            {formatCurrency(bird.price)}
          </p>

          <div className="mt-4 flex items-center gap-2 text-sm text-stone-500 font-body">
            <MapPin className="size-4" />
            {bird.location}, {bird.city}
          </div>

          {/* Specs */}
          <div className="mt-8 border-t border-stone-200 pt-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 mb-4 font-body">
              Spesifikasi
            </h2>
            <dl className="grid grid-cols-2 gap-y-4 gap-x-6 text-sm font-body">
              <div>
                <dt className="text-xs text-stone-500">Umur</dt>
                <dd className="mt-0.5 font-semibold text-stone-900">{bird.age}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500">Jenis Kelamin</dt>
                <dd className="mt-0.5 font-semibold text-stone-900">{genderLabel(bird.gender)}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500">Kondisi</dt>
                <dd className="mt-0.5 font-semibold text-stone-900">{bird.condition}</dd>
              </div>
              <div>
                <dt className="text-xs text-stone-500">Status</dt>
                <dd className="mt-0.5 font-semibold text-stone-900">{bird.status}</dd>
              </div>
            </dl>
          </div>

          {/* Description */}
          <div className="mt-8 border-t border-stone-200 pt-6">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 mb-3 font-body">
              Deskripsi
            </h2>
            <p className="text-sm leading-7 text-stone-600 font-body">{bird.description}</p>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => toggleFavorite(bird.id)}
              className="inline-flex items-center justify-center gap-2 border-2 border-stone-300 px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] text-stone-700 hover:border-stone-900 hover:text-stone-900 transition-all font-body"
            >
              <Heart
                className={`size-4 ${favorite ? "fill-rose-500 text-rose-500" : ""}`}
              />
              {favorite ? "Hapus Favorit" : "Simpan Favorit"}
            </button>
            <button
              type="button"
              onClick={handleBuy}
              disabled={bird.status !== "AVAILABLE"}
              className="px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.15em] bg-stone-900 text-white hover:bg-stone-800 disabled:bg-stone-300 disabled:cursor-not-allowed transition-all font-body"
            >
              {bird.status === "AVAILABLE" ? "Beli Sekarang" : "Tidak Tersedia"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
