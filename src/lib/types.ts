export type Role = "USER" | "ADMIN" | "SUPER_ADMIN";
export type UserStatus = "ACTIVE" | "SUSPENDED";
export type BirdGender = "MALE" | "FEMALE" | "UNKNOWN";
export type BirdStatus = "AVAILABLE" | "BOOKED" | "SOLD";
export type TransactionStatus =
  | "WAITING_PAYMENT"
  | "WAITING_VERIFICATION"
  | "PAID"
  | "PROCESS"
  | "COMPLETED"
  | "CANCELLED";
export type PaymentStatus =
  | "PENDING"
  | "WAITING_VERIFICATION"
  | "PAID"
  | "REJECTED";
export type PaymentType = "BANK" | "EWALLET";

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  avatar?: string;
  address?: string;
  city?: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description?: string;
};

export type Bird = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  location: string;
  city: string;
  age?: string;
  gender: BirdGender;
  condition?: string;
  status: BirdStatus;
  isFeatured: boolean;
  images: string[];
  createdAt: string;
};

export type Favorite = {
  id: string;
  userId: string;
  birdId: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  invoiceNo: string;
  buyerId: string;
  birdId: string;
  totalPrice: number;
  status: TransactionStatus;
  note?: string;
  createdAt: string;
};

export type Payment = {
  id: string;
  transactionId: string;
  userId: string;
  amount: number;
  paymentType?: PaymentType;
  paymentLabel?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  proofImage?: string;
  proofImageUrl?: string;
  status: PaymentStatus;
  adminNote?: string;
  paidAt?: string;
  createdAt: string;
};
