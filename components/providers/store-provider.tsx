"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  birds as initialBirds,
  categories as initialCategories,
  favorites as initialFavorites,
  payments as initialPayments,
  transactions as initialTransactions,
  users as initialUsers,
} from "@/lib/mock-data";
import type {
  Bird,
  BirdStatus,
  Category,
  Favorite,
  Payment,
  PaymentType,
  PaymentStatus,
  Transaction,
  TransactionStatus,
  User,
  UserStatus,
} from "@/lib/types";

type BirdDraft = Omit<Bird, "id" | "slug" | "createdAt">;
type CategoryDraft = Omit<Category, "id" | "slug">;
type ProfileDraft = Pick<User, "name" | "phone" | "address" | "city">;

type StoreContextValue = {
  users: User[];
  birds: Bird[];
  categories: Category[];
  favorites: Favorite[];
  transactions: Transaction[];
  payments: Payment[];
  currentUser: User | null;
  authReady: boolean;
  login: (email: string, password: string) => { ok: boolean; message?: string };
  logout: () => void;
  register: (draft: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) => { ok: boolean; message?: string };
  updateProfile: (draft: ProfileDraft) => void;
  toggleFavorite: (birdId: string) => void;
  createTransaction: (birdId: string) => Transaction | null;
  uploadPaymentProof: (
    transactionId: string,
    proof: {
      name: string;
      url?: string;
    },
    method?: {
      paymentType: PaymentType;
      paymentLabel: string;
      bankName: string;
      accountName: string;
      accountNumber: string;
    },
  ) => void;
  createBird: (draft: BirdDraft) => Bird;
  updateBird: (id: string, draft: BirdDraft) => void;
  deleteBird: (id: string) => void;
  updateBirdStatus: (id: string, status: BirdStatus) => void;
  createCategory: (draft: CategoryDraft) => Category;
  updateCategory: (id: string, draft: CategoryDraft) => void;
  deleteCategory: (id: string) => void;
  updateUserStatus: (id: string, status: UserStatus) => void;
  deleteUser: (id: string) => void;
  updatePaymentStatus: (
    id: string,
    status: PaymentStatus,
    adminNote?: string,
  ) => void;
  updateTransactionStatus: (id: string, status: TransactionStatus) => void;
  getBirdById: (id: string) => Bird | undefined;
  getCategoryById: (id: string) => Category | undefined;
  getTransactionById: (id: string) => Transaction | undefined;
  getPaymentByTransactionId: (transactionId: string) => Payment | undefined;
};

const StoreContext = createContext<StoreContextValue | null>(null);
const SESSION_KEY = "murai-market-current-user";
const MARKET_STATE_KEY = "murai-market-state";

type MarketSnapshot = {
  users: User[];
  birds: Bird[];
  categories: Category[];
  favorites: Favorite[];
  transactions: Transaction[];
  payments: Payment[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function makeInvoiceNo() {
  return `INV-${new Date().toISOString().slice(0, 10).replaceAll("-", "")}-${Math.floor(
    Math.random() * 900 + 100,
  )}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [users, setUsers] = useState(initialUsers);
  const [birds, setBirds] = useState(initialBirds);
  const [categories, setCategories] = useState(initialCategories);
  const [favorites, setFavorites] = useState(initialFavorites);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [payments, setPayments] = useState(initialPayments);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [marketReady, setMarketReady] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      const storedUser = window.localStorage.getItem(SESSION_KEY);

      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser) as User);
        } catch {
          window.localStorage.removeItem(SESSION_KEY);
        }
      }

      setAuthReady(true);
    });
  }, []);

  useEffect(() => {
    if (!authReady) return;

    if (currentUser) {
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(currentUser));
      return;
    }

    window.localStorage.removeItem(SESSION_KEY);
  }, [authReady, currentUser]);

  useEffect(() => {
    queueMicrotask(() => {
      const storedMarket = window.localStorage.getItem(MARKET_STATE_KEY);

      if (storedMarket) {
        try {
          const snapshot = JSON.parse(storedMarket) as Partial<MarketSnapshot>;

          if (snapshot.users) setUsers(snapshot.users);
          if (snapshot.birds) setBirds(snapshot.birds);
          if (snapshot.categories) setCategories(snapshot.categories);
          if (snapshot.favorites) setFavorites(snapshot.favorites);
          if (snapshot.transactions) setTransactions(snapshot.transactions);
          if (snapshot.payments) setPayments(snapshot.payments);
        } catch {
          window.localStorage.removeItem(MARKET_STATE_KEY);
        }
      }

      setMarketReady(true);
    });
  }, []);

  useEffect(() => {
    if (!marketReady) return;

    const snapshot: MarketSnapshot = {
      users,
      birds,
      categories,
      favorites,
      transactions,
      payments,
    };

    window.localStorage.setItem(MARKET_STATE_KEY, JSON.stringify(snapshot));
  }, [birds, categories, favorites, marketReady, payments, transactions, users]);

  const value = useMemo<StoreContextValue>(
    () => ({
      users,
      birds,
      categories,
      favorites,
      transactions,
      payments,
      currentUser,
      authReady,
      login(email, password) {
        const user = users.find(
          (item) => item.email === email && item.password === password,
        );

        if (!user) {
          return { ok: false, message: "Email atau password tidak cocok." };
        }

        if (user.status === "SUSPENDED") {
          return { ok: false, message: "Akun sedang dinonaktifkan." };
        }

        setCurrentUser(user);
        return { ok: true };
      },
      logout() {
        setCurrentUser(null);
      },
      register(draft) {
        if (users.some((user) => user.email === draft.email)) {
          return { ok: false, message: "Email sudah digunakan." };
        }

        const nextUser: User = {
          id: makeId("user"),
          ...draft,
          role: "USER",
          status: "ACTIVE",
          createdAt: new Date().toISOString(),
        };

        setUsers((items) => [...items, nextUser]);
        setCurrentUser(nextUser);
        return { ok: true };
      },
      updateProfile(draft) {
        if (!currentUser) return;
        const nextUser = { ...currentUser, ...draft };
        setUsers((items) =>
          items.map((user) => (user.id === currentUser.id ? nextUser : user)),
        );
        setCurrentUser(nextUser);
      },
      toggleFavorite(birdId) {
        if (!currentUser) return;
        const existing = favorites.find(
          (favorite) =>
            favorite.userId === currentUser.id && favorite.birdId === birdId,
        );

        if (existing) {
          setFavorites((items) =>
            items.filter((favorite) => favorite.id !== existing.id),
          );
          return;
        }

        setFavorites((items) => [
          ...items,
          {
            id: makeId("fav"),
            birdId,
            userId: currentUser.id,
            createdAt: new Date().toISOString(),
          },
        ]);
      },
      createTransaction(birdId) {
        if (!currentUser) return null;
        const bird = birds.find((item) => item.id === birdId);
        if (!bird || bird.status !== "AVAILABLE") return null;

        const transaction: Transaction = {
          id: makeId("trx"),
          invoiceNo: makeInvoiceNo(),
          buyerId: currentUser.id,
          birdId,
          totalPrice: bird.price,
          status: "WAITING_PAYMENT",
          createdAt: new Date().toISOString(),
        };
        const payment: Payment = {
          id: makeId("pay"),
          transactionId: transaction.id,
          userId: currentUser.id,
          amount: bird.price,
          paymentType: "BANK",
          paymentLabel: "BCA Virtual Account",
          bankName: "BCA",
          accountName: "PT Murai Market Indonesia",
          accountNumber: "1234567890",
          status: "PENDING",
          createdAt: new Date().toISOString(),
        };

        setTransactions((items) => [transaction, ...items]);
        setPayments((items) => [payment, ...items]);
        setBirds((items) =>
          items.map((item) =>
            item.id === birdId ? { ...item, status: "BOOKED" } : item,
          ),
        );
        return transaction;
      },
      uploadPaymentProof(transactionId, proof, method) {
        setPayments((items) =>
          items.map((payment) =>
            payment.transactionId === transactionId
              ? {
                  ...payment,
                  ...method,
                  proofImage: proof.name,
                  proofImageUrl: proof.url,
                  status: "WAITING_VERIFICATION",
                }
              : payment,
          ),
        );
        setTransactions((items) =>
          items.map((transaction) =>
            transaction.id === transactionId
              ? { ...transaction, status: "WAITING_VERIFICATION" }
              : transaction,
          ),
        );
      },
      createBird(draft) {
        const bird: Bird = {
          ...draft,
          id: makeId("bird"),
          slug: slugify(draft.name),
          createdAt: new Date().toISOString(),
        };
        setBirds((items) => [bird, ...items]);
        return bird;
      },
      updateBird(id, draft) {
        setBirds((items) =>
          items.map((bird) =>
            bird.id === id
              ? {
                  ...bird,
                  ...draft,
                  slug: slugify(draft.name),
                }
              : bird,
          ),
        );
      },
      deleteBird(id) {
        setBirds((items) => items.filter((bird) => bird.id !== id));
        setFavorites((items) => items.filter((favorite) => favorite.birdId !== id));
      },
      updateBirdStatus(id, status) {
        setBirds((items) =>
          items.map((bird) => (bird.id === id ? { ...bird, status } : bird)),
        );
      },
      createCategory(draft) {
        const category: Category = {
          ...draft,
          id: makeId("cat"),
          slug: slugify(draft.name),
        };
        setCategories((items) => [...items, category]);
        return category;
      },
      updateCategory(id, draft) {
        setCategories((items) =>
          items.map((category) =>
            category.id === id
              ? { ...category, ...draft, slug: slugify(draft.name) }
              : category,
          ),
        );
      },
      deleteCategory(id) {
        setCategories((items) => items.filter((category) => category.id !== id));
      },
      updateUserStatus(id, status) {
        setUsers((items) =>
          items.map((user) => (user.id === id ? { ...user, status } : user)),
        );
      },
      deleteUser(id) {
        setUsers((items) => items.filter((user) => user.id !== id));
      },
      updatePaymentStatus(id, status, adminNote) {
        const payment = payments.find((item) => item.id === id);
        if (!payment) return;

        setPayments((items) =>
          items.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                  adminNote,
                  paidAt: status === "PAID" ? new Date().toISOString() : item.paidAt,
                }
              : item,
          ),
        );
        setTransactions((items) =>
          items.map((transaction) => {
            if (transaction.id !== payment.transactionId) return transaction;
            if (status === "PAID") return { ...transaction, status: "PAID" };
            if (status === "REJECTED") {
              return { ...transaction, status: "WAITING_PAYMENT" };
            }
            return transaction;
          }),
        );
      },
      updateTransactionStatus(id, status) {
        setTransactions((items) =>
          items.map((transaction) =>
            transaction.id === id ? { ...transaction, status } : transaction,
          ),
        );
      },
      getBirdById(id) {
        return birds.find((bird) => bird.id === id);
      },
      getCategoryById(id) {
        return categories.find((category) => category.id === id);
      },
      getTransactionById(id) {
        return transactions.find((transaction) => transaction.id === id);
      },
      getPaymentByTransactionId(transactionId) {
        return payments.find((payment) => payment.transactionId === transactionId);
      },
    }),
    [
      birds,
      categories,
      currentUser,
      authReady,
      favorites,
      payments,
      transactions,
      users,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used inside StoreProvider");
  }
  return context;
}
