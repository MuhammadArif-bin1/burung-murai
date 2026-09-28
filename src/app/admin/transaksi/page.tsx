"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { useStore } from "@/components/providers/store-provider";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatCurrency, formatDate } from "@/lib/format";
import { Check, X, Eye, FileText, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import type { TransactionStatus } from "@/lib/types";

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
  const [selectedProof, setSelectedProof] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      transactions.filter((transaction) =>
        status ? transaction.status === status : true
      ),
    [status, transactions]
  );

  const pendingCount = payments.filter(
    (p) => p.status === "WAITING_VERIFICATION" || p.status === "PENDING"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl bg-slate-900 text-white p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Panel Verifikasi Pembayaran</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Konfirmasi Pembelian Burung
          </h1>
          <p className="mt-1.5 text-slate-400 text-sm max-w-xl">
            Periksa bukti transfer pelanggan dan ubah status transaksi untuk konfirmasi pengiriman burung.
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80">
          <Clock className="w-5 h-5 text-amber-400 shrink-0" />
          <div>
            <p className="text-[11px] text-slate-400 font-medium">Menunggu Verifikasi</p>
            <p className="text-lg font-bold text-amber-300">{pendingCount} Pesanan</p>
          </div>
        </div>
      </div>

      {/* Filter & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <span className="text-sm font-semibold text-slate-800">
            Total Transaksi: {filtered.length}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-slate-500">Filter:</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as TransactionStatus | "")}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs font-medium text-slate-700 focus:border-emerald-600 focus:outline-none"
          >
            <option value="">Semua Status</option>
            <option value="WAITING_PAYMENT">Menunggu Pembayaran</option>
            <option value="WAITING_VERIFICATION">Menunggu Verifikasi</option>
            <option value="PAID">Dibayar (Lunas)</option>
            <option value="PROCESS">Sedang Diproses</option>
            <option value="COMPLETED">Selesai</option>
            <option value="CANCELLED">Dibatalkan</option>
          </select>
        </div>
      </div>

      {/* List of Transactions */}
      <div className="grid gap-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">Belum ada transaksi pada filter ini.</p>
          </div>
        ) : (
          filtered.map((transaction) => {
            const payment = payments.find((item) => item.transactionId === transaction.id);
            const buyer = users.find((user) => user.id === transaction.buyerId);
            const bird = getBirdById(transaction.birdId);
            const isWaiting =
              payment?.status === "WAITING_VERIFICATION" ||
              transaction.status === "WAITING_VERIFICATION";

            return (
              <article
                key={transaction.id}
                className={`rounded-2xl border bg-white p-5 sm:p-6 transition-all shadow-xs ${
                  isWaiting
                    ? "border-amber-300 ring-2 ring-amber-100/60"
                    : "border-slate-200/80"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-md text-slate-700 font-semibold">
                        {transaction.invoiceNo}
                      </span>
                      <span>·</span>
                      <span>{formatDate(transaction.createdAt)}</span>
                    </div>
                    <h2 className="mt-1.5 text-lg font-bold text-slate-900">
                      {bird?.name || "Burung Murai"}
                    </h2>
                    <p className="text-xs text-slate-600 mt-1">
                      Pembeli: <span className="font-semibold text-slate-800">{buyer?.name || "Pelanggan"}</span> ({buyer?.phone || "No HP -"}) · Lokasi: {bird?.city || "Indonesia"}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-400 block font-medium">Total Tagihan</span>
                      <span className="text-lg font-bold text-emerald-700">
                        {formatCurrency(transaction.totalPrice)}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      <StatusBadge kind="transaction" status={transaction.status} />
                      {payment && <StatusBadge kind="payment" status={payment.status} />}
                    </div>
                  </div>
                </div>

                {/* Bagian Bukti & Aksi Konfirmasi */}
                <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4 pt-1">
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Metode & Bukti Transfer:</p>
                      <p className="text-xs font-semibold text-slate-800">
                        {payment?.paymentLabel || payment?.bankName || "Transfer Manual"} ·{" "}
                        <span className="text-slate-500 font-normal">
                          {payment?.proofImage || "Belum ada bukti"}
                        </span>
                      </p>
                    </div>

                    {payment?.proofImageUrl && (
                      <button
                        type="button"
                        onClick={() => setSelectedProof(payment.proofImageUrl || null)}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200 cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Lihat Bukti</span>
                      </button>
                    )}
                  </div>

                  {/* Tombol Aksi Cepat Konfirmasi untuk Admin */}
                  <div className="flex flex-wrap items-center gap-2">
                    {payment && payment.status !== "PAID" && (
                      <button
                        type="button"
                        onClick={() => {
                          updatePaymentStatus(payment.id, "PAID");
                          updateTransactionStatus(transaction.id, "PAID");
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>Konfirmasi / Terima Pembayaran</span>
                      </button>
                    )}

                    {payment && payment.status === "WAITING_VERIFICATION" && (
                      <button
                        type="button"
                        onClick={() => {
                          updatePaymentStatus(
                            payment.id,
                            "REJECTED",
                            "Bukti transfer tidak valid atau belum masuk ke mutasi bank."
                          );
                        }}
                        className="inline-flex items-center gap-1 px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold border border-rose-200 transition-colors cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Tolak</span>
                      </button>
                    )}

                    {/* Status Transaksi Dropdown */}
                    <select
                      value={transaction.status}
                      onChange={(e) =>
                        updateTransactionStatus(
                          transaction.id,
                          e.target.value as TransactionStatus
                        )
                      }
                      className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
                    >
                      <option value="WAITING_PAYMENT">Status: Menunggu Pembayaran</option>
                      <option value="WAITING_VERIFICATION">Status: Menunggu Verifikasi</option>
                      <option value="PAID">Status: Dibayar</option>
                      <option value="PROCESS">Status: Diproses (Packing/Kirim)</option>
                      <option value="COMPLETED">Status: Selesai</option>
                      <option value="CANCELLED">Status: Dibatalkan</option>
                    </select>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

      {/* Modal Preview Bukti Transfer */}
      {selectedProof && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs"
          onClick={() => setSelectedProof(null)}
        >
          <div
            className="relative max-w-xl w-full bg-white rounded-2xl overflow-hidden p-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
              <h3 className="text-sm font-bold text-slate-900">Lampiran Bukti Transfer</h3>
              <button
                onClick={() => setSelectedProof(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative aspect-square w-full max-h-[70vh] rounded-xl overflow-hidden bg-slate-100">
              <Image src={selectedProof} alt="Bukti transfer" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
