"use client";

import { MonthlyChart } from "@/components/admin/monthly-chart";
import { useStore } from "@/components/providers/store-provider";
import { formatCurrency } from "@/lib/format";

export default function AdminDashboardPage() {
  const { users, birds, transactions } = useStore();
  const revenue = transactions
    .filter((transaction) => ["PAID", "PROCESS", "COMPLETED"].includes(transaction.status))
    .reduce((total, transaction) => total + transaction.totalPrice, 0);
  const stats = [
    { label: "Total user", value: users.length },
    { label: "Total burung", value: birds.length },
    {
      label: "Burung tersedia",
      value: birds.filter((bird) => bird.status === "AVAILABLE").length,
    },
    { label: "Total pendapatan", value: formatCurrency(revenue) },
  ];
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
        <p className="text-sm text-slate-500">Ringkasan operasional</p>
        <h1 className="text-3xl font-bold">Dashboard admin</h1>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <article key={stat.label} className="rounded-lg border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-500">{stat.label}</p>
            <p className="mt-2 text-2xl font-bold">{stat.value}</p>
          </article>
        ))}
      </div>
      <MonthlyChart values={monthly} />
    </div>
  );
}
