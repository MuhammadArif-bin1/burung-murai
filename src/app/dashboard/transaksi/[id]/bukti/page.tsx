"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, BadgeCheck, CalendarDays, CreditCard, FileText, Printer, UserRound } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useStore } from "@/components/providers/store-provider";
import { formatCurrency, formatDate } from "@/lib/format";

export default function PaymentReceiptPage() {
  const params = useParams<{ id: string }>();
  const { currentUser, getTransactionById, getBirdById, getPaymentByTransactionId } =
    useStore();
  const transaction = getTransactionById(params.id);
  const bird = transaction ? getBirdById(transaction.birdId) : undefined;
  const payment = transaction
    ? getPaymentByTransactionId(transaction.id)
    : undefined;

  if (!transaction || transaction.buyerId !== currentUser?.id || !payment) {
    return (
      <EmptyState
        title="Struk tidak ditemukan"
        description="Bukti pembayaran ini tidak tersedia untuk akun Anda."
      />
    );
  }

  return (
    <div className="grid gap-6">
      <div className="print:hidden">
        <Link
          href={`/dashboard/transaksi/${transaction.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-800"
        >
          <ArrowLeft className="size-4" />
          Kembali ke detail transaksi
        </Link>
      </div>

      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm print:border-0 print:shadow-none">
        <div className="border-b border-slate-200 bg-emerald-950 px-6 py-5 text-white">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-100">
                Bukti pembayaran
              </p>
              <h1 className="mt-2 text-2xl font-bold">Struk MuraiMarket</h1>
              <p className="mt-2 text-sm text-emerald-50">{transaction.invoiceNo}</p>
            </div>
            <div className="rounded-md bg-white/10 px-4 py-3 text-sm">
              <p className="text-emerald-100">Total pembayaran</p>
              <p className="mt-1 text-xl font-bold">{formatCurrency(payment.amount)}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 border-b border-slate-200 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Status transaksi</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <StatusBadge kind="transaction" status={transaction.status} />
              <StatusBadge kind="payment" status={payment.status} />
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-md bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
            <BadgeCheck className="size-4" />
            {payment.proofImage ? "Bukti sudah diunggah" : "Bukti belum diunggah"}
          </div>
        </div>

        <div className="grid gap-6 p-6 lg:grid-cols-[1fr_320px]">
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Tanggal transaksi",
                value: formatDate(transaction.createdAt),
                icon: CalendarDays,
              },
              {
                label: "Tanggal dibayar",
                value: payment.paidAt
                  ? formatDate(payment.paidAt)
                  : "Menunggu verifikasi",
                icon: CalendarDays,
              },
              { label: "Nama burung", value: bird?.name ?? "-", icon: FileText },
              { label: "Pembeli", value: currentUser?.name ?? "-", icon: UserRound },
              {
                label: "Metode pembayaran",
                value: payment.paymentLabel ?? payment.bankName ?? "Belum dipilih",
                icon: CreditCard,
              },
              {
                label: "Nomor tujuan",
                value: payment.accountNumber ?? "-",
                icon: CreditCard,
              },
              {
                label: "Atas nama",
                value: payment.accountName ?? "-",
                icon: UserRound,
              },
              {
                label: "File bukti",
                value: payment.proofImage ?? "Belum diunggah",
                icon: FileText,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-md border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon className="size-4 text-emerald-800" />
                  {label}
                </div>
                <p className="mt-2 font-semibold text-slate-950">{value}</p>
              </div>
            ))}
          </div>

          <aside className="rounded-md border border-slate-200 bg-slate-50 p-4">
            <h2 className="font-semibold text-slate-950">Preview bukti</h2>
            {payment.proofImageUrl ? (
              <div
                aria-label="Preview bukti pembayaran"
                className="mt-3 h-72 rounded-md border border-slate-200 bg-white bg-contain bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${payment.proofImageUrl})` }}
              />
            ) : (
              <div className="mt-3 flex h-72 items-center justify-center rounded-md border border-dashed border-slate-300 bg-white px-4 text-center text-sm text-slate-500">
                File bukti bukan gambar atau belum tersedia untuk preview.
              </div>
            )}
            <p className="mt-3 break-words text-sm font-medium text-slate-700">
              {payment.proofImage ?? "Belum ada file"}
            </p>
          </aside>
        </div>

        <div className="border-t border-slate-200 px-6 py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-6 text-slate-500">
              Simpan struk ini sebagai bukti transaksi. Pembayaran dianggap selesai
              setelah admin menyetujui bukti pembayaran.
            </p>
            <div className="text-right">
              <p className="text-sm text-slate-500">Total</p>
              <p className="text-2xl font-bold text-slate-950">
                {formatCurrency(payment.amount)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-end print:hidden">
        <button
          type="button"
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-md bg-emerald-900 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          <Printer className="size-4" />
          Cetak struk
        </button>
      </div>
    </div>
  );
}
