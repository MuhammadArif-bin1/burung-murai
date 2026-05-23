import {
  birdStatusLabel,
  paymentStatusLabel,
  transactionStatusLabel,
} from "@/lib/format";
import type {
  BirdStatus,
  PaymentStatus,
  TransactionStatus,
} from "@/lib/types";

type StatusBadgeProps =
  | { kind: "bird"; status: BirdStatus }
  | { kind: "payment"; status: PaymentStatus }
  | { kind: "transaction"; status: TransactionStatus };

const tones = {
  AVAILABLE: "bg-emerald-100 text-emerald-800",
  BOOKED: "bg-amber-100 text-amber-800",
  SOLD: "bg-rose-100 text-rose-800",
  PENDING: "bg-slate-100 text-slate-700",
  WAITING_PAYMENT: "bg-slate-100 text-slate-700",
  WAITING_VERIFICATION: "bg-amber-100 text-amber-800",
  PAID: "bg-emerald-100 text-emerald-800",
  PROCESS: "bg-sky-100 text-sky-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-rose-100 text-rose-800",
  REJECTED: "bg-rose-100 text-rose-800",
};

export function StatusBadge(props: StatusBadgeProps) {
  const label =
    props.kind === "bird"
      ? birdStatusLabel(props.status)
      : props.kind === "payment"
        ? paymentStatusLabel(props.status)
        : transactionStatusLabel(props.status);

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${tones[props.status]}`}
    >
      {label}
    </span>
  );
}
