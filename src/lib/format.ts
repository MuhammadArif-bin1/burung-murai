import type {
  BirdGender,
  BirdStatus,
  PaymentStatus,
  TransactionStatus,
} from "@/lib/types";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function birdStatusLabel(status: BirdStatus) {
  return {
    AVAILABLE: "Tersedia",
    BOOKED: "Dipesan",
    SOLD: "Terjual",
  }[status];
}

export function genderLabel(gender: BirdGender) {
  return {
    MALE: "Jantan",
    FEMALE: "Betina",
    UNKNOWN: "Belum diketahui",
  }[gender];
}

export function transactionStatusLabel(status: TransactionStatus) {
  return {
    WAITING_PAYMENT: "Menunggu pembayaran",
    WAITING_VERIFICATION: "Menunggu verifikasi",
    PAID: "Dibayar",
    PROCESS: "Diproses",
    COMPLETED: "Selesai",
    CANCELLED: "Dibatalkan",
  }[status];
}

export function paymentStatusLabel(status: PaymentStatus) {
  return {
    PENDING: "Belum dibayar",
    WAITING_VERIFICATION: "Menunggu verifikasi",
    PAID: "Diterima",
    REJECTED: "Ditolak",
  }[status];
}
