import type {
  Bird,
  BirdImage,
  Category,
  Payment,
  Transaction,
  User,
} from "@prisma/client";

export function publicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatar: user.avatar,
    address: user.address,
    city: user.city,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function serializeBird<
  T extends Bird & { category?: Category; images?: BirdImage[] },
>(bird: T) {
  return {
    ...bird,
    price: Number(bird.price),
  };
}

export function serializeTransaction<
  T extends Transaction & {
    payment?: Payment | null;
    bird?: (Bird & { category?: Category; images?: BirdImage[] }) | null;
  },
>(transaction: T) {
  return {
    ...transaction,
    totalPrice: Number(transaction.totalPrice),
    payment: transaction.payment
      ? {
          ...transaction.payment,
          amount: Number(transaction.payment.amount),
        }
      : transaction.payment,
    bird: transaction.bird ? serializeBird(transaction.bird) : transaction.bird,
  };
}

export function serializePayment<T extends Payment>(payment: T) {
  return {
    ...payment,
    amount: Number(payment.amount),
  };
}
