"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";
import { Building2, FileCheck2, UploadCloud, WalletCards } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/components/ui/status-badge";
import { useStore } from "@/components/providers/store-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import type { PaymentType } from "@/lib/types";

const paymentMethods: {
  id: string;
  paymentType: PaymentType;
  paymentLabel: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
}[] = [
  {
    id: "bca",
    paymentType: "BANK",
    paymentLabel: "BCA Virtual Account",
    bankName: "BCA",
    accountName: "PT Murai Market Indonesia",
    accountNumber: "1234567890",
  },
  {
    id: "mandiri",
    paymentType: "BANK",
    paymentLabel: "Mandiri Virtual Account",
    bankName: "Mandiri",
    accountName: "PT Murai Market Indonesia",
    accountNumber: "8899001122",
  },
  {
    id: "bni",
    paymentType: "BANK",
    paymentLabel: "BNI Virtual Account",
    bankName: "BNI",
    accountName: "PT Murai Market Indonesia",
    accountNumber: "7766554433",
  },
  {
    id: "bri",
    paymentType: "BANK",
    paymentLabel: "BRI Virtual Account",
    bankName: "BRI",
    accountName: "PT Murai Market Indonesia",
    accountNumber: "3300221199",
  },
  {
    id: "gopay",
    paymentType: "EWALLET",
    paymentLabel: "GoPay",
    bankName: "GoPay",
    accountName: "MuraiMarket",
    accountNumber: "081234567890",
  },
  {
    id: "ovo",
    paymentType: "EWALLET",
    paymentLabel: "OVO",
    bankName: "OVO",
    accountName: "MuraiMarket",
    accountNumber: "081234567890",
  },
  {
    id: "dana",
    paymentType: "EWALLET",
    paymentLabel: "DANA",
    bankName: "DANA",
    accountName: "MuraiMarket",
    accountNumber: "081234567890",
  },
  {
    id: "shopeepay",
    paymentType: "EWALLET",
    paymentLabel: "ShopeePay",
    bankName: "ShopeePay",
    accountName: "MuraiMarket",
    accountNumber: "081234567890",
  },
];

export default function TransactionDetailPage() {
  const params = useParams<{ id: string }>();
  const {
    currentUser,
    getTransactionById,
    getBirdById,
    getPaymentByTransactionId,
    uploadPaymentProof,
  } = useStore();
  const transaction = getTransactionById(params.id);
  const bird = transaction ? getBirdById(transaction.birdId) : undefined;
  const payment = transaction
    ? getPaymentByTransactionId(transaction.id)
    : undefined;
  const [proofFile, setProofFile] = useState<{
    name: string;
    url?: string;
  } | null>(null);
  const initialMethodId =
    paymentMethods.find(
      (method) =>
        method.paymentLabel === payment?.paymentLabel ||
        method.bankName === payment?.bankName,
    )?.id ?? paymentMethods[0].id;
  const [methodId, setMethodId] = useState(initialMethodId);
  const selectedMethod =
    paymentMethods.find((method) => method.id === methodId) ?? paymentMethods[0];
  const bankMethods = paymentMethods.filter((method) => method.paymentType === "BANK");
  const ewalletMethods = paymentMethods.filter(
    (method) => method.paymentType === "EWALLET",
  );

  if (!transaction || transaction.buyerId !== currentUser?.id) {
    return (
      <EmptyState
        title="Transaksi tidak ditemukan"
        description="Transaksi ini tidak tersedia untuk akun Anda."
      />
    );
  }

  const selectedTransaction = transaction;

  function handleProofChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) {
      setProofFile(null);
      return;
    }

    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => {
        setProofFile({
          name: file.name,
          url: typeof reader.result === "string" ? reader.result : undefined,
        });
      };
      reader.readAsDataURL(file);
      return;
    }

    setProofFile({ name: file.name });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!proofFile) return;
    uploadPaymentProof(selectedTransaction.id, proofFile, selectedMethod);
    setProofFile(null);
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-slate-200 bg-white p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">{selectedTransaction.invoiceNo}</p>
            <h1 className="mt-1 text-2xl font-bold">{bird?.name}</h1>
            <p className="mt-2 text-sm text-slate-500">
              Dibuat {formatDate(selectedTransaction.createdAt)}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <StatusBadge kind="transaction" status={selectedTransaction.status} />
            {payment && <StatusBadge kind="payment" status={payment.status} />}
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500">Total</p>
            <p className="mt-1 text-xl font-bold">
              {formatCurrency(selectedTransaction.totalPrice)}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Metode dipilih</p>
            <p className="mt-1 font-semibold">
              {payment?.paymentLabel ?? selectedMethod.paymentLabel}
            </p>
          </div>
          <div>
            <p className="text-sm text-slate-500">Nomor tujuan</p>
            <p className="mt-1 font-semibold">
              {payment?.accountNumber ?? selectedMethod.accountNumber}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <WalletCards className="size-5 text-emerald-800" />
            <h2 className="font-semibold">Pilih metode pembayaran</h2>
          </div>
          <div className="mt-4 grid gap-5">
            {[
              { title: "Bank transfer", icon: Building2, methods: bankMethods },
              { title: "E-wallet", icon: WalletCards, methods: ewalletMethods },
            ].map(({ title, icon: Icon, methods }) => (
              <div key={title} className="rounded-md border border-slate-200 p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-800">
                  <Icon className="size-4 text-emerald-800" />
                  {title}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {methods.map((method) => (
                    <label
                      key={method.id}
                      className={`cursor-pointer rounded-md border p-4 text-sm transition ${
                        methodId === method.id
                          ? "border-emerald-700 bg-emerald-50 ring-1 ring-emerald-700"
                          : "border-slate-200 hover:border-emerald-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={method.id}
                        checked={methodId === method.id}
                        onChange={(event) => setMethodId(event.target.value)}
                        className="sr-only"
                      />
                      <span className="block font-semibold text-slate-950">
                        {method.paymentLabel}
                      </span>
                      <span className="mt-1 block text-slate-500">
                        {method.accountNumber}
                      </span>
                      <span className="mt-1 block text-slate-500">
                        a.n. {method.accountName}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex items-center gap-2">
            <UploadCloud className="size-5 text-emerald-800" />
            <h2 className="font-semibold">Upload bukti pembayaran</h2>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Unggah gambar bukti transfer atau file PDF dari bank/e-wallet Anda.
          </p>
          <form className="mt-4 grid gap-4" onSubmit={handleSubmit}>
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-center hover:border-emerald-400 hover:bg-emerald-50">
              <UploadCloud className="size-8 text-emerald-800" />
              <span className="mt-3 font-semibold text-slate-950">
                Pilih file bukti pembayaran
              </span>
              <span className="mt-1 text-sm text-slate-500">
                JPG, PNG, WEBP, atau PDF
              </span>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={handleProofChange}
                className="sr-only"
              />
            </label>

            {proofFile && (
              <div className="rounded-md border border-slate-200 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-950">
                  <FileCheck2 className="size-4 text-emerald-800" />
                  {proofFile.name}
                </div>
                {proofFile.url && (
                  <div
                    aria-label="Preview bukti pembayaran"
                    className="mt-3 h-64 w-full rounded-md border border-slate-200 bg-white bg-contain bg-center bg-no-repeat"
                    style={{ backgroundImage: `url(${proofFile.url})` }}
                  />
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={!proofFile}
              className="rounded-md bg-emerald-900 px-4 py-3 font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              Upload bukti
            </button>
          </form>
          {payment?.proofImage && (
            <div className="mt-4 rounded-md bg-slate-50 p-4 text-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Bukti terbaru:{" "}
                  <span className="font-semibold">{payment.proofImage}</span>
                </p>
                <Link
                  href={`/dashboard/transaksi/${selectedTransaction.id}/bukti`}
                  className="rounded-md border border-slate-300 px-3 py-2 text-center font-semibold text-slate-800 hover:bg-white"
                >
                  Cetak struk
                </Link>
              </div>
              {payment.proofImageUrl && (
                <div
                  aria-label="Bukti pembayaran terbaru"
                  className="mt-3 h-64 w-full rounded-md border border-slate-200 bg-white bg-contain bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${payment.proofImageUrl})` }}
                />
              )}
            </div>
          )}
        </section>

        <aside className="rounded-lg border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Status admin</h2>
          <p className="mt-3 text-sm leading-6 text-slate-500">
            {payment?.adminNote ??
              "Belum ada catatan admin. Setelah bukti diunggah, admin akan memverifikasi pembayaran secara manual."}
          </p>
        </aside>
      </div>
    </div>
  );
}
