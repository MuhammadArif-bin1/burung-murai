import { formatCurrency } from "@/lib/format";

export function MonthlyChart({
  values,
}: {
  values: { month: string; amount: number }[];
}) {
  const max = Math.max(...values.map((item) => item.amount), 1);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="font-semibold">Transaksi bulanan</h2>
      <div className="mt-6 grid h-56 grid-cols-6 items-end gap-3">
        {values.map((item) => (
          <div key={item.month} className="flex h-full flex-col justify-end gap-2">
            <div
              className="rounded-t-md bg-emerald-800"
              style={{ height: `${Math.max((item.amount / max) * 100, 8)}%` }}
              title={formatCurrency(item.amount)}
            />
            <span className="text-center text-xs text-slate-500">{item.month}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
