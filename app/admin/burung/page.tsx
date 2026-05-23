"use client";

import Link from "next/link";
import { useStore } from "@/components/providers/store-provider";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency } from "@/lib/format";
import type { BirdStatus } from "@/lib/types";

export default function AdminBirdsPage() {
  const { birds, getCategoryById, deleteBird, updateBirdStatus } = useStore();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Manajemen stok</p>
          <h1 className="text-3xl font-bold">Data burung</h1>
        </div>
        <Link
          href="/admin/burung/tambah"
          className="rounded-md bg-emerald-900 px-4 py-3 text-center font-semibold text-white hover:bg-emerald-800"
        >
          Tambah burung
        </Link>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="hidden grid-cols-[1.3fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600 lg:grid">
          <span>Burung</span>
          <span>Kategori</span>
          <span>Harga</span>
          <span>Status</span>
          <span />
        </div>
        {birds.map((bird) => (
          <div
            key={bird.id}
            className="grid gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 lg:grid-cols-[1.3fr_1fr_1fr_1fr_auto] lg:items-center"
          >
            <div>
              <p className="font-semibold">{bird.name}</p>
              <p className="text-sm text-slate-500">
                {bird.city} · {bird.condition}
              </p>
            </div>
            <span className="text-sm">{getCategoryById(bird.categoryId)?.name}</span>
            <span className="font-semibold">{formatCurrency(bird.price)}</span>
            <div className="flex items-center gap-2">
              <StatusBadge kind="bird" status={bird.status} />
              <select
                value={bird.status}
                onChange={(event) =>
                  updateBirdStatus(bird.id, event.target.value as BirdStatus)
                }
                className="rounded-md border border-slate-300 px-2 py-1 text-sm"
              >
                <option value="AVAILABLE">Tersedia</option>
                <option value="BOOKED">Dipesan</option>
                <option value="SOLD">Terjual</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Link
                href={`/admin/burung/edit/${bird.id}`}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Edit
              </Link>
              <button
                type="button"
                onClick={() => deleteBird(bird.id)}
                className="rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
