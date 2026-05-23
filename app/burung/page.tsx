"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BirdCard } from "@/components/bird-card";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/components/providers/store-provider";
import type { BirdGender, BirdStatus } from "@/lib/types";

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
    <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Katalog
        </p>
        <div className="mt-2 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-950">Cari burung murai</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
              Temukan murai berdasarkan kategori, harga, lokasi, kondisi, dan status
              ketersediaan dengan tampilan yang lebih mudah dipindai.
            </p>
          </div>
          <div className="rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            {filteredBirds.length} dari {birds.length} burung tampil
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 border-b border-slate-200 pb-4">
            <h2 className="font-semibold text-slate-950">Filter katalog</h2>
            <p className="mt-1 text-sm text-slate-500">Persempit hasil pencarian.</p>
          </div>
          <div className="grid gap-4">
            <label className="grid gap-2 text-sm font-semibold text-slate-800">
              Nama burung
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                placeholder="Cari nama"
              />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-800">
              Kategori
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Semua kategori</option>
                {categories.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name}
                  </option>
                ))}
              </select>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="grid gap-2 text-sm font-semibold text-slate-800">
                Harga min
                <input
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  inputMode="numeric"
                />
              </label>
              <label className="grid gap-2 text-sm font-semibold text-slate-800">
                Harga max
                <input
                  value={maxPrice}
                  onChange={(event) => setMaxPrice(event.target.value)}
                  className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
                  inputMode="numeric"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm font-semibold text-slate-800">
              Kota
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Semua kota</option>
                {cities.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-800">
              Kondisi
              <select
                value={condition}
                onChange={(event) => setCondition(event.target.value)}
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Semua kondisi</option>
                {conditions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-800">
              Jenis kelamin
              <select
                value={gender}
                onChange={(event) => setGender(event.target.value as BirdGender | "")}
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Semua</option>
                <option value="MALE">Jantan</option>
                <option value="FEMALE">Betina</option>
                <option value="UNKNOWN">Belum diketahui</option>
              </select>
            </label>
            <label className="grid gap-2 text-sm font-semibold text-slate-800">
              Status
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value as BirdStatus | "")}
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="">Semua status</option>
                <option value="AVAILABLE">Tersedia</option>
                <option value="BOOKED">Dipesan</option>
                <option value="SOLD">Terjual</option>
              </select>
            </label>
          </div>
        </aside>

        <div>
          <div className="mb-4 flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm font-medium text-slate-700">
              {filteredBirds.length} burung ditemukan
            </p>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              Urutkan
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortMode)}
                className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
              >
                <option value="latest">Terbaru</option>
                <option value="lowest">Harga termurah</option>
                <option value="highest">Harga termahal</option>
              </select>
            </label>
          </div>

          {filteredBirds.length === 0 ? (
            <EmptyState
              title="Belum ada hasil yang cocok"
              description="Coba longgarkan filter atau gunakan kata kunci lain."
            />
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredBirds.map((bird) => (
                <BirdCard key={bird.id} bird={bird} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function BirdCatalogPage() {
  return (
    <Suspense
      fallback={
        <section className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="rounded-lg border border-slate-200 bg-white p-6 text-slate-500">
            Memuat katalog...
          </div>
        </section>
      }
    >
      <BirdCatalogContent />
    </Suspense>
  );
}
