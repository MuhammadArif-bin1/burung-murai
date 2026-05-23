"use client";

import Link from "next/link";
import { useStore } from "@/components/providers/store-provider";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";

export default function DashboardPage() {
  const { currentUser, favorites, transactions, getBirdById } = useStore();
  const ownTransactions = transactions.filter(
    (transaction) => transaction.buyerId === currentUser?.id,
  );
  const ownFavorites = favorites.filter((favorite) => favorite.userId === currentUser?.id);

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Ringkasan
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">
          Selamat datang, {currentUser?.name}
        </h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Pantau transaksi, favorit, dan aktivitas pembelian Anda dalam satu tempat.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Transaksi", value: ownTransactions.length },
          { label: "Favorit", value: ownFavorites.length },
          {
            label: "Total belanja",
            value: formatCurrency(
              ownTransactions.reduce((total, item) => total + item.totalPrice, 0),
            ),
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-slate-600">{item.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-950">{item.value}</p>
          </article>
        ))}
      </div>
      <section className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="font-semibold text-slate-950">Transaksi terbaru</h2>
          <Link href="/dashboard/transaksi" className="text-sm font-semibold text-emerald-800">
            Lihat semua
          </Link>
        </div>
        <div className="divide-y divide-slate-200">
          {ownTransactions.slice(0, 3).map((transaction) => {
            const bird = getBirdById(transaction.birdId);
            return (
              <Link
                href={`/dashboard/transaksi/${transaction.id}`}
                key={transaction.id}
                className="flex flex-col gap-3 px-5 py-4 hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-semibold text-slate-950">{bird?.name}</p>
                  <p className="text-sm text-slate-500">
                    {transaction.invoiceNo} · {formatDate(transaction.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-950">
                    {formatCurrency(transaction.totalPrice)}
                  </span>
                  <StatusBadge kind="transaction" status={transaction.status} />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
