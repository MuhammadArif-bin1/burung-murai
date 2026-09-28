# Arsitektur Proyek MuraiMarket

Dokumen ini menjelaskan struktur folder, alur kerja (workflow), hierarki routing, autentikasi, dan pembagian tanggung jawab (separation of concerns) pada proyek **MuraiMarket**.

---

## 1. Alur Utama Saat Dijalankan

- **Entry Point (`/`)**: 
  Saat aplikasi dijalankan (`npm run dev`) dan dibuka di `http://localhost:3000/`, file `src/app/page.tsx` akan **langsung mengarahkan (redirect 307)** pengguna ke `/login`.
- **Halaman Login (`/login`)**:
  - Menyediakan form autentikasi modern dan aman.
  - Dilengkapi tombol cepat **Akun Demo**:
    - 🛡️ **Admin Murai** (`admin@muraimarket.test` / `admin123`) $\rightarrow$ diarahkan ke `/admin`
    - 👤 **Budi Santoso (Pembeli)** (`user@muraimarket.test` / `user123`) $\rightarrow$ diarahkan ke `/dashboard`
  - Jika pengguna sudah memiliki sesi login aktif:
    - Role `ADMIN` / `SUPER_ADMIN` otomatis dialihkan ke `/admin`.
    - Role `USER` otomatis dialihkan ke `/dashboard`.
- **Marketplace Showcase (`/beranda`) & Katalog (`/burung`)**:
  - Halaman showcase beranda dipindahkan secara rapi ke `/beranda`.
  - Halaman eksplorasi dan filter burung tersedia di `/burung`.

---

## 2. Struktur Folder & Tanggung Jawab Modul

Proyek menggunakan arsitektur modular berbasis **Next.js App Router** dengan pemisahan lapisan (layered architecture) yang jelas:

```text
src/
├── app/                      # [Routing Layer] Next.js App Router
│   ├── admin/                # Portal Administrator (dilindungi AuthGuard)
│   │   ├── burung/           # Manajemen data & stok burung
│   │   ├── kategori/         # Manajemen kategori burung
│   │   ├── laporan/          # Analitik dan laporan transaksi
│   │   ├── transaksi/        # Konfirmasi pembayaran & pesanan
│   │   ├── users/            # Kelola akun pengguna
│   │   ├── layout.tsx        # Shell layout khusus panel admin
│   │   └── page.tsx          # Dashboard ringkasan admin
│   ├── api/                  # RESTful API Endpoints (Backend)
│   │   ├── admin/            # Endpoints khusus admin
│   │   ├── auth/             # Login, register, session endpoints
│   │   ├── birds/            # CRUD data burung
│   │   ├── categories/       # CRUD kategori
│   │   ├── favorites/        # Endpoint data favorit
│   │   ├── payments/         # Endpoint bukti transfer & konfirmasi
│   │   └── transactions/     # Endpoint transaksi pesanan
│   ├── beranda/              # Landing page publik (showcase marketplace)
│   ├── burung/               # Katalog publik & detail burung ([id])
│   ├── dashboard/            # Portal Pengguna/Pembeli (transaksi, favorit, profil)
│   ├── login/                # Halaman login utama (Entry target)
│   ├── register/             # Halaman pendaftaran pembeli baru
│   ├── layout.tsx            # Root layout aplikasi (Geist font, providers, shell)
│   ├── page.tsx              # Root URL handler -> redirect("/login")
│   └── providers.tsx         # Root provider wrapper
│
├── components/               # [Presentation Layer] Komponen UI Terarah
│   ├── admin/                # Komponen khusus panel admin (form, chart)
│   ├── birds/                # Komponen domain burung (BirdCard, list)
│   ├── layout/               # Komponen kerangka (AppShell, AuthGuard, Header, Footer)
│   ├── ui/                   # Komponen atomik/primitif (Badge, EmptyState)
│   └── index.ts              # Barrel export komponen
│
├── hooks/                    # [Hooks Layer] Custom React Hooks
│   ├── use-store.ts          # Hook akses store & state manajemen
│   └── index.ts              # Barrel export hooks
│
├── providers/                # [Context & State Layer] State Manajemen Global
│   ├── store-provider.tsx    # Context Provider (User, Birds, Trx, Payments, Favs)
│   └── index.ts              # Barrel export providers
│
├── types/                    # [Type Definition Layer] TypeScript Interface & Types
│   └── index.ts              # Central type definitions (Bird, User, Transaction, dll.)
│
└── lib/                      # [Core Utilities & Services Layer]
    ├── auth.ts               # JWT generator, hashing, token verification
    ├── format.ts             # Format mata uang (IDR) & tanggal
    ├── http.ts               # Response JSON builder (success & error)
    ├── mock-data.ts          # Seed data awal (burung, akun demo, transaksi)
    ├── prisma.ts             # Prisma Client instance (Database ORM)
    ├── serializers.ts        # Data transformer
    ├── types.ts              # Data types asli
    ├── utils.ts              # Classnames merger & general helpers
    ├── validations.ts        # Zod schema validation (input request validator)
    └── index.ts              # Barrel export lib
```

---

## 3. Pembagian Peran (Role-Based Access Control)

Aplikasi memiliki proteksi rute melalui `AuthGuard`:
1. **Tamu (Guest)**:
   - Dapat mengakses `/login`, `/register`, `/burung`, `/beranda`.
2. **Pembeli (`USER`)**:
   - Dapat mengakses `/dashboard`, `/dashboard/transaksi`, `/dashboard/favorit`, `/dashboard/profile`, dan katalog.
   - Tidak dapat mengakses `/admin` (akan dialihkan oleh `AuthGuard`).
3. **Pengelola (`ADMIN` / `SUPER_ADMIN`)**:
   - Dapat mengakses `/admin/*` untuk memverifikasi pembayaran, input burung baru, mengelola status pesanan, dan melihat analitik laporan keuangan.

---

## 4. Keuntungan Arsitektur Ini

- **Jelas & Terarah**: Setiap folder memiliki fungsi spesifik (Routing di `app/`, Komponen di `components/`, State di `providers/`, Utilitas di `lib/`, Types di `types/`).
- **Skalabel**: Penambahan modul baru (misal: notifikasi, logistik, pengiriman) cukup menambahkan folder di domain terkait tanpa mengotori folder lain.
- **Backward Compatible**: File lama seperti `components/bird-card.tsx` dan `components/providers/store-provider.tsx` tetap memiliki jembatan re-export sehingga kode lama tidak rusak.
