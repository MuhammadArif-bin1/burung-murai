"use client";

import { useMemo, useState } from "react";
import { useStore } from "@/components/providers/store-provider";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import type { PaymentStatus, TransactionStatus } from "@/lib/types";

export default function AdminTransactionsPage() {
  const {
    transactions,
    payments,
    users,
    getBirdById,
    updatePaymentStatus,
    updateTransactionStatus,
  } = useStore();
  const [status, setStatus] = useState<TransactionStatus | "">("");

  const filtered = useMemo(
    () =>
      transactions.filter((transaction) =>
        status ? transaction.status === status : true,
      ),
    [status, transactions],
  );

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-slate-500">Pembayaran manual</p>
          <h1 className="text-3xl font-bold">Transaksi</h1>
        </div>
        <label className="flex items-center gap-2 text-sm font-medium">
          Filter status
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value as TransactionStatus | "")}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="">Semua</option>
            <option value="WAITING_PAYMENT">Menunggu pembayaran</option>
            <option value="WAITING_VERIFICATION">Menunggu verifikasi</option>
            <option value="PAID">Dibayar</option>
            <option value="PROCESS">Diproses</option>
            <option value="COMPLETED">Selesai</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </label>
      </div>
      <div className="mt-6 grid gap-4">
        {filtered.map((transaction) => {
          const payment = payments.find((item) => item.transactionId === transaction.id);
          const buyer = users.find((user) => user.id === transaction.buyerId);
          const bird = getBirdById(transaction.birdId);
          return (
            <article key={transaction.id} className="rounded-lg border border-slate-200 bg-white p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-sm text-slate-500">
                    {transaction.invoiceNo} · {formatDate(transaction.createdAt)}
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{bird?.name}</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Pembeli: {buyer?.name} · {formatCurrency(transaction.totalPrice)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <StatusBadge kind="transaction" status={transaction.status} />
                  {payment && <StatusBadge kind="payment" status={payment.status} />}
                </div>
              </div>
              <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-end">
                <div>
                  <p className="text-sm text-slate-500">Bukti transfer</p>
                  <p className="mt-1 font-medium">{payment?.proofImage ?? "Belum diunggah"}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {payment?.paymentLabel ?? payment?.bankName ?? "Metode belum dipilih"}
                  </p>
                </div>
                {payment && (
                  <select
                    value={payment.status}
                    onChange={(event) =>
                      updatePaymentStatus(
                        payment.id,
                        event.target.value as PaymentStatus,
                        event.target.value === "REJECTED"
                          ? "Bukti kurang jelas, mohon unggah ulang."
                          : undefined,
                      )
                    }
                    className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                  >
                    <option value="PENDING">Belum dibayar</option>
                    <option value="WAITING_VERIFICATION">Menunggu verifikasi</option>
                    <option value="PAID">Terima</option>
                    <option value="REJECTED">Tolak</option>
                  </select>
                )}
                <select
                  value={transaction.status}
                  onChange={(event) =>
                    updateTransactionStatus(transaction.id, event.target.value as TransactionStatus)
                  }
                  className="rounded-md border border-slate-300 px-3 py-2 text-sm"
                >
                  <option value="WAITING_PAYMENT">Menunggu pembayaran</option>
                  <option value="WAITING_VERIFICATION">Menunggu verifikasi</option>
                  <option value="PAID">Dibayar</option>
                  <option value="PROCESS">Diproses</option>
                  <option value="COMPLETED">Selesai</option>
                  <option value="CANCELLED">Dibatalkan</option>
                </select>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
