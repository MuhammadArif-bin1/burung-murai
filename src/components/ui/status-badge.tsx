import { birdStatusLabel, paymentStatusLabel, transactionStatusLabel } from "@/lib/format";
import type { BirdStatus, PaymentStatus, TransactionStatus } from "@/lib/types";

type StatusBadgeProps =
  | { kind: "bird"; status: BirdStatus }
  | { kind: "payment"; status: PaymentStatus }
  | { kind: "transaction"; status: TransactionStatus };

const tones: Record<string, string> = {
  AVAILABLE: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  BOOKED: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  SOLD: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  PENDING: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20",
  WAITING_PAYMENT: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-500/20",
  WAITING_VERIFICATION: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20",
  PAID: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  PROCESS: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-600/20",
  COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20",
  CANCELLED: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
  REJECTED: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-600/20",
};

const dots: Record<string, string> = {
  AVAILABLE: "bg-emerald-500",
  BOOKED: "bg-amber-500",
  SOLD: "bg-rose-500",
  PENDING: "bg-slate-400",
  WAITING_PAYMENT: "bg-slate-400",
  WAITING_VERIFICATION: "bg-amber-500",
  PAID: "bg-emerald-500",
  PROCESS: "bg-sky-500",
  COMPLETED: "bg-emerald-500",
  CANCELLED: "bg-rose-500",
  REJECTED: "bg-rose-500",
};

export function StatusBadge({ kind, status }: StatusBadgeProps) {
  let label = "";
  if (kind === "bird") {
    label = birdStatusLabel(status as BirdStatus);
  } else if (kind === "payment") {
    label = paymentStatusLabel(status as PaymentStatus);
  } else if (kind === "transaction") {
    label = transactionStatusLabel(status as TransactionStatus);
  }

  const toneClass = tones[status] || tones.PENDING;
  const dotClass = dots[status] || dots.PENDING;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${toneClass}`}
    >
      <span className={`size-1.5 rounded-full ${dotClass}`} aria-hidden="true" />
      {label}
    </span>
  );
}
