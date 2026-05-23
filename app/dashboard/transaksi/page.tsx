"use client";

import Link from "next/link";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useStore } from "@/components/providers/store-provider";
import { formatCurrency, formatDate } from "@/lib/format";

export default function TransactionsPage() {
  const { currentUser, transactions, getBirdById, getPaymentByTransactionId } =
    useStore();
  const ownTransactions = transactions.filter(
    (transaction) => transaction.buyerId === currentUser?.id,
  );

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Transaksi
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Riwayat transaksi</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Lihat invoice, status pembayaran, dan total pembelian murai Anda.
        </p>
      </div>
      <div>
        {ownTransactions.length === 0 ? (
          <EmptyState
            title="Belum ada transaksi"
            description="Checkout dari katalog akan muncul di halaman ini."
          />
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="hidden grid-cols-[1.4fr_1fr_1fr_1fr_auto] gap-4 border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-800 md:grid">
              <span>Burung</span>
              <span>Tanggal</span>
              <span>Pembayaran</span>
              <span>Total</span>
              <span />
            </div>
            {ownTransactions.map((transaction) => {
              const bird = getBirdById(transaction.birdId);
              const payment = getPaymentByTransactionId(transaction.id);
              return (
                <div
                  key={transaction.id}
                  className="grid gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-center"
                >
                  <div>
                    <p className="font-semibold text-slate-950">{bird?.name}</p>
                    <p className="text-sm text-slate-500">{transaction.invoiceNo}</p>
                  </div>
                  <span className="text-sm text-slate-600">
                    {formatDate(transaction.createdAt)}
                  </span>
                  {payment && <StatusBadge kind="payment" status={payment.status} />}
                  <span className="font-semibold text-slate-950">
                    {formatCurrency(transaction.totalPrice)}
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/dashboard/transaksi/${transaction.id}`}
                      className="rounded-md border border-slate-300 px-3 py-2 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50"
                    >
                      Detail
                    </Link>
                    {payment?.proofImage && (
                      <Link
                        href={`/dashboard/transaksi/${transaction.id}/bukti`}
                        className="rounded-md bg-emerald-900 px-3 py-2 text-center text-sm font-semibold text-white hover:bg-emerald-800"
                      >
                        Struk
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
