"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BirdCard } from "@/components/bird-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/components/providers/store-provider";
import type { BirdGender, BirdStatus } from "@/lib/types";
import { SlidersHorizontal, X } from "lucide-react";

type SortMode = "latest" | "lowest" | "highest";

function BirdCatalogContent() {
  const { birds, categories } = useStore();
  const searchParams = useSearchParams();
  const categoryFromSlug = categories.find(
    (item) => item.slug === searchParams.get("category"),
  )?.id;
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(categoryFromSlug ?? "");
  const [city, setCity] = useState(searchParams.get("city") ?? "");
  const [condition, setCondition] = useState(searchParams.get("condition") ?? "");
  const [gender, setGender] = useState<BirdGender | "">(
    (searchParams.get("gender") as BirdGender | null) ?? "",
  );
  const [status, setStatus] = useState<BirdStatus | "">(
    (searchParams.get("status") as BirdStatus | null) ?? "",
  );
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [sort, setSort] = useState<SortMode>(
    (searchParams.get("sort") as SortMode | null) ?? "latest",
  );
  const [showFilters, setShowFilters] = useState(false);

  const cities = [...new Set(birds.map((bird) => bird.city))];
  const conditions = [...new Set(birds.map((bird) => bird.condition).filter(Boolean))];

  const filteredBirds = useMemo(() => {
    return [...birds]
      .filter((bird) => bird.name.toLowerCase().includes(search.toLowerCase()))
      .filter((bird) => (!category ? true : bird.categoryId === category))
      .filter((bird) => (!city ? true : bird.city === city))
      .filter((bird) => (!condition ? true : bird.condition === condition))
      .filter((bird) => (!gender ? true : bird.gender === gender))
      .filter((bird) => (!status ? true : bird.status === status))
      .filter((bird) => (!minPrice ? true : bird.price >= Number(minPrice)))
      .filter((bird) => (!maxPrice ? true : bird.price <= Number(maxPrice)))
      .sort((a, b) => {
        if (sort === "lowest") return a.price - b.price;
        if (sort === "highest") return b.price - a.price;
        return b.createdAt.localeCompare(a.createdAt);
      });
  }, [birds, category, city, condition, gender, maxPrice, minPrice, search, sort, status]);

  useEffect(() => {
    const params = new URLSearchParams();
    const selectedCategory = categories.find((item) => item.id === category);

    if (search) params.set("search", search);
    if (selectedCategory) params.set("category", selectedCategory.slug);
    if (city) params.set("city", city);
    if (condition) params.set("condition", condition);
    if (gender) params.set("gender", gender);
    if (status) params.set("status", status);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sort !== "latest") params.set("sort", sort);

    const query = params.toString();
    window.history.replaceState(null, "", query ? `/burung?${query}` : "/burung");
  }, [categories, category, city, condition, gender, maxPrice, minPrice, search, sort, status]);

  return (
    <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-8">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-stone-500 font-body">
          Koleksi Lengkap
        </p>
        <h1 className="mt-2 text-3xl font-bold text-stone-900 sm:text-4xl font-heading">
          KATALOG MURAI BATU
        </h1>
        <div className="mt-3 h-0.5 w-16 bg-stone-900" />
      </div>

      {/* Toolbar */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="inline-flex items-center gap-2 border border-stone-300 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-stone-700 hover:bg-stone-50 transition-colors font-body"
          >
            <SlidersHorizontal className="size-3.5" />
            {showFilters ? "Tutup Filter" : "Filter"}
          </button>
          <span className="text-xs text-stone-500 font-body">
            {filteredBirds.length} dari {birds.length} burung
          </span>
        </div>

        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 border border-stone-300 px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-stone-800 font-body"
            placeholder="Cari nama burung..."
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortMode)}
            className="border border-stone-300 px-3 py-2 text-xs text-stone-900 focus:border-stone-800 font-body"
          >
            <option value="latest">Terbaru</option>
            <option value="lowest">Harga Termurah</option>
            <option value="highest">Harga Termahal</option>
          </select>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mb-6 border border-stone-200 bg-stone-50 p-6 animate-fade-in-up">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 font-body">Filter Katalog</h2>
            <button
              onClick={() => setShowFilters(false)}
              className="p-1 text-stone-500 hover:text-stone-900 cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600 font-body">
              Kategori
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="text-xs text-stone-900 font-body"
              >
                <option value="">Semua kategori</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>{item.name}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600 font-body">
              Kota
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="text-xs text-stone-900 font-body"
              >
                <option value="">Semua kota</option>
                {cities.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600 font-body">
              Kondisi
              <select
                value={condition}
                onChange={(e) => setCondition(e.target.value)}
                className="text-xs text-stone-900 font-body"
              >
                <option value="">Semua kondisi</option>
                {conditions.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600 font-body">
              Jenis Kelamin
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as BirdGender | "")}
                className="text-xs text-stone-900 font-body"
              >
                <option value="">Semua</option>
                <option value="MALE">Jantan</option>
                <option value="FEMALE">Betina</option>
                <option value="UNKNOWN">Belum diketahui</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600 font-body">
              Status
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as BirdStatus | "")}
                className="text-xs text-stone-900 font-body"
              >
                <option value="">Semua status</option>
                <option value="AVAILABLE">Tersedia</option>
                <option value="BOOKED">Dipesan</option>
                <option value="SOLD">Terjual</option>
              </select>
            </label>
            <label className="grid gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600 font-body">
              Harga Min
              <input
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="text-xs text-stone-900 font-body"
                inputMode="numeric"
                placeholder="0"
              />
            </label>
            <label className="grid gap-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-stone-600 font-body">
              Harga Max
              <input
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="text-xs text-stone-900 font-body"
                inputMode="numeric"
                placeholder="50000000"
              />
            </label>
          </div>
        </div>
      )}

      {/* Product Grid */}
      {filteredBirds.length === 0 ? (
        <EmptyState
          title="Belum ada hasil yang cocok"
          description="Coba longgarkan filter atau gunakan kata kunci lain."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger-children">
          {filteredBirds.map((bird) => (
            <BirdCard key={bird.id} bird={bird} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function BirdCatalogPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="text-stone-500 text-sm font-body">Memuat katalog...</div>
        </section>
      }
    >
      <BirdCatalogContent />
    </Suspense>
  );
}
