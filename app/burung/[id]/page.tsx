"use client";

import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Heart, MapPin } from "lucide-react";
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
    if (!currentUser) {
      router.push("/login");
      return;
    }

    const transaction = createTransaction(selectedBird.id);
    if (transaction) {
      router.push(`/dashboard/transaksi/${transaction.id}`);
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
      <div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-slate-200">
          <Image
            src={bird.images[activeImage]}
            alt={bird.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div className="mt-4 flex gap-3">
          {bird.images.map((image, index) => (
            <button
              type="button"
              key={image}
              onClick={() => setActiveImage(index)}
              className={`relative aspect-square w-20 overflow-hidden rounded-md border ${
                activeImage === index ? "border-emerald-700" : "border-slate-200"
              }`}
            >
              <Image src={image} alt="" fill className="object-cover" sizes="80px" />
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
              {category?.name}
            </p>
            <h1 className="mt-2 text-3xl font-bold">{bird.name}</h1>
          </div>
          <StatusBadge kind="bird" status={bird.status} />
        </div>

        <p className="mt-5 text-3xl font-bold text-emerald-950">
          {formatCurrency(bird.price)}
        </p>
        <div className="mt-4 flex items-center gap-2 text-slate-500">
          <MapPin className="size-4" />
          {bird.location}, {bird.city}
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-slate-500">Umur</dt>
            <dd className="mt-1 font-semibold">{bird.age}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Jenis kelamin</dt>
            <dd className="mt-1 font-semibold">{genderLabel(bird.gender)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Kondisi</dt>
            <dd className="mt-1 font-semibold">{bird.condition}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Status</dt>
            <dd className="mt-1 font-semibold">{bird.status}</dd>
          </div>
        </dl>

        <div className="mt-6 border-t border-slate-200 pt-6">
          <h2 className="font-semibold">Deskripsi</h2>
          <p className="mt-2 leading-7 text-slate-600">{bird.description}</p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          {currentUser?.role === "USER" && (
            <button
              type="button"
              onClick={() => toggleFavorite(bird.id)}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-3 font-semibold text-slate-700 hover:bg-slate-50"
            >
              <Heart className={`size-4 ${favorite ? "fill-rose-500 text-rose-500" : ""}`} />
              {favorite ? "Hapus favorit" : "Simpan favorit"}
            </button>
          )}
          <button
            type="button"
            onClick={handleBuy}
            disabled={bird.status !== "AVAILABLE"}
            className="rounded-md bg-emerald-900 px-5 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {bird.status === "AVAILABLE" ? "Beli sekarang" : "Tidak tersedia"}
          </button>
        </div>
      </div>
    </section>
  );
}
