"use client";

import { MonthlyChart } from "@/components/admin/monthly-chart";
import { useStore } from "@/components/providers/store-provider";
import { formatCurrency } from "@/lib/format";

export default function AdminReportsPage() {
  const { birds, transactions } = useStore();
  const soldBirds = birds.filter((bird) => bird.status === "SOLD").length;
  const paidTransactions = transactions.filter((transaction) =>
    ["PAID", "PROCESS", "COMPLETED"].includes(transaction.status),
  );
  const revenue = paidTransactions.reduce(
    (total, transaction) => total + transaction.totalPrice,
    0,
  );
  const monthly = [
    { month: "Jan", amount: 1200000 },
    { month: "Feb", amount: 1800000 },
    { month: "Mar", amount: 2400000 },
    { month: "Apr", amount: 3100000 },
    { month: "Mei", amount: revenue },
    { month: "Jun", amount: 0 },
  ];

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm text-slate-500">Analitik</p>
        <h1 className="text-3xl font-bold">Laporan</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Pendapatan</p>
          <p className="mt-2 text-2xl font-bold">{formatCurrency(revenue)}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Transaksi terbayar</p>
          <p className="mt-2 text-2xl font-bold">{paidTransactions.length}</p>
        </article>
        <article className="rounded-lg border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">Burung terjual</p>
          <p className="mt-2 text-2xl font-bold">{soldBirds}</p>
        </article>
      </div>
      <MonthlyChart values={monthly} />
    </div>
  );
}
