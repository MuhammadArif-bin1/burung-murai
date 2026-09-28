"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck, Award, Quote } from "lucide-react";
import { BirdCard } from "@/components/birds/bird-card";
import { useStore } from "@/providers";

const categoryImages: Record<string, string> = {
  "cat-medan": "/images/category-medan.jpg",
  "cat-borneo": "/images/bird-1.png",
  "cat-trotol": "/images/bird-3.png",
  "cat-gacor": "/images/bird-2.png",
};

const highlights = [
  { icon: ShieldCheck, label: "TERVERIFIKASI", desc: "Semua seller & burung terverifikasi" },
  { icon: Award, label: "KUALITAS PREMIUM", desc: "Pilihan murai terkurasi terbaik" },
  { icon: Truck, label: "PENGIRIMAN AMAN", desc: "Garansi pengiriman aman sampai tujuan" },
];

const testimonials = [
  {
    name: "Ahmad Wijaya",
    city: "Jakarta",
    text: "Burung yang saya beli dari MuraiMarket luar biasa kualitasnya. Sudah 3 kali menang lomba di tingkat kota. Pelayanan sangat profesional.",
    rating: 5,
  },
  {
    name: "Bambang Sutrisno",
    city: "Bandung",
    text: "Transaksi sangat mudah dan transparan. Burung sesuai dengan deskripsi dan foto. Sangat recommended untuk pecinta murai batu.",
    rating: 5,
  },
  {
    name: "Dedi Kurniawan",
    city: "Surabaya",
    text: "Marketplace terpercaya dengan koleksi murai berkualitas. Proses verifikasi pembayaran cepat dan admin sangat responsif.",
    rating: 5,
  },
];

const blogPosts = [
  {
    title: "Panduan Memilih Murai Batu Berkualitas untuk Lomba",
    excerpt: "Tips dan trik mengenali murai batu dengan potensi juara berdasarkan postur, ekor, dan mental.",
    image: "/images/bird-1.png",
  },
  {
    title: "Cara Merawat Murai Batu Agar Rajin Berkicau",
    excerpt: "Perawatan harian, pola makan, dan teknik pemasteran yang tepat untuk murai batu Anda.",
    image: "/images/bird-2.png",
  },
  {
    title: "Mengenal Jenis-Jenis Murai Batu Nusantara",
    excerpt: "Perbedaan karakter Murai Medan, Borneo, Lampung, dan Nias yang perlu Anda ketahui.",
    image: "/images/bird-3.png",
  },
];

export default function BerandaPage() {
  const { authReady, birds, categories } = useStore();

  if (!authReady) {
    return (
      <div className="flex min-h-[60vh] flex-1 items-center justify-center">
        <div className="size-8 animate-spin rounded-full border-4 border-stone-200 border-t-stone-800" />
      </div>
    );
  }

  const featuredBirds = birds
    .filter((bird) => bird.isFeatured || bird.status === "AVAILABLE")
    .slice(0, 4);

  return (
    <>
      {/* ── HERO SECTION ── */}
      <section className="relative h-[85vh] min-h-[600px] overflow-hidden">
        <Image
          src="/images/hero-banner.jpg"
          alt="Murai Batu Premium"
          fill
          priority
          loading="eager"
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-white/80 font-body">
            Premium Bird Marketplace
          </p>
          <h1 className="max-w-4xl text-4xl font-bold leading-[1.1] tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl font-heading">
            TEMUKAN MURAI BATU
            <br />
            IMPIAN ANDA
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base font-body">
            Marketplace terpercaya untuk pecinta burung murai batu berkualitas premium.
            Katalog terkurasi dengan transaksi aman & terverifikasi.
          </p>
          <Link
            href="/burung"
            className="mt-8 inline-flex items-center gap-2 border-2 border-white bg-transparent px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-white hover:bg-white hover:text-stone-900 transition-all duration-300 font-body"
          >
            Jelajahi Katalog
          </Link>
        </div>
      </section>

      {/* ── HIGHLIGHT BAR ── */}
      <section className="border-b border-stone-200 bg-stone-900">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 divide-y divide-stone-700 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {highlights.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="flex items-center gap-4 px-6 py-5">
                <Icon className="size-6 shrink-0 text-amber-400" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white font-body">{label}</p>
                  <p className="mt-0.5 text-xs text-stone-400 font-body">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORY GRID ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 stagger-children">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/burung?category=${cat.slug}`}
                className="group relative aspect-square overflow-hidden bg-stone-200"
              >
                <Image
                  src={categoryImages[cat.id] || "/images/bird-1.png"}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-white sm:text-base font-body">
                    {cat.name.replace("Murai ", "").replace("Batu ", "")}
                  </h3>
                  <p className="mt-1 text-xs text-white/70 line-clamp-1 font-body">{cat.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="border-t border-stone-200 bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500 font-body">
              Pilihan Terbaik
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-900 sm:text-4xl font-heading">
              BURUNG UNGGULAN
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-stone-900" />
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
            {featuredBirds.map((bird) => (
              <BirdCard key={bird.id} bird={bird} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/burung"
              className="inline-flex items-center gap-2 border-2 border-stone-900 px-8 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-stone-900 hover:bg-stone-900 hover:text-white transition-all duration-300 font-body"
            >
              Lihat Semua Koleksi
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── TWO-COLUMN FEATURE (like NatureHike) ── */}
      <section className="bg-white">
        <div className="grid md:grid-cols-2">
          {/* Left: Murai Lomba */}
          <Link href="/burung?condition=Siap+lomba" className="group relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/feature-lomba.jpg"
              alt="Murai Lomba"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <h3 className="text-2xl font-bold text-white sm:text-3xl font-heading">MURAI KONTES</h3>
              <p className="mt-2 max-w-sm text-sm text-white/80 font-body">
                Koleksi murai batu siap lomba dengan mental panggung terbaik dan isian rapat.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 border-b-2 border-white pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white font-body">
                Lihat Koleksi
              </span>
            </div>
          </Link>

          {/* Right: Murai Peliharaan */}
          <Link href="/burung?condition=Sehat" className="group relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/feature-peliharaan.jpg"
              alt="Murai Peliharaan"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 sm:p-12">
              <h3 className="text-2xl font-bold text-white sm:text-3xl font-heading">MURAI PELIHARAAN</h3>
              <p className="mt-2 max-w-sm text-sm text-white/80 font-body">
                Pilihan murai batu sehat dan jinak untuk dinikmati kicauannya di rumah setiap hari.
              </p>
              <span className="mt-4 inline-flex items-center gap-2 border-b-2 border-white pb-1 text-xs font-semibold uppercase tracking-[0.2em] text-white font-body">
                Lihat Koleksi
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ── SHOP THE LOOK / GALERI ── */}
      <section className="bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500 font-body">
              Galeri Premium
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-900 sm:text-4xl font-heading">
              LIHAT KOLEKSI KAMI
            </h2>
            <div className="mt-4 h-0.5 w-16 bg-stone-900" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="group relative aspect-[3/4] overflow-hidden sm:row-span-2">
              <Image
                src="/images/hero-murai.png"
                alt="Murai Batu Premium"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
            </div>
            <div className="group relative aspect-square overflow-hidden">
              <Image
                src="/images/bird-1.png"
                alt="Murai Batu Medan"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
            </div>
            <div className="group relative aspect-square overflow-hidden">
              <Image
                src="/images/bird-2.png"
                alt="Murai Batu Borneo"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
            </div>
            <div className="group relative aspect-square overflow-hidden sm:col-span-2">
              <Image
                src="/images/bird-3.png"
                alt="Murai Batu Trotol"
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 66vw"
              />
              <div className="absolute inset-0 bg-black/20 transition-opacity group-hover:bg-black/10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR JOURNEY / ABOUT ── */}
      <section className="relative overflow-hidden bg-stone-900 py-16 sm:py-24">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="/images/hero-banner.jpg"
            alt=""
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <p className="inline-block border border-amber-400/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-amber-400 font-body">
                Cerita Kami
              </p>
              <h2 className="mt-6 text-3xl font-bold text-white sm:text-4xl font-heading">
                PERJALANAN MURAIMARKET
              </h2>
              <div className="mt-4 h-0.5 w-16 bg-amber-400" />
              <p className="mt-6 text-sm leading-7 text-stone-300 font-body">
                Berawal dari kecintaan terhadap burung murai batu, MuraiMarket hadir sebagai
                platform yang menghubungkan pecinta dan peternak murai batu di seluruh Indonesia.
                Kami berkomitmen menyediakan pengalaman transaksi yang aman, transparan, dan
                terpercaya dengan koleksi murai berkualitas premium.
              </p>
              <p className="mt-4 text-sm leading-7 text-stone-300 font-body">
                Setiap burung yang dijual di platform kami telah melalui kurasi ketat untuk
                memastikan kualitas dan kesehatan terjamin. Bergabunglah bersama ribuan
                pecinta murai batu lainnya.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-6 text-center">
              {[
                { value: birds.filter(b => b.status === "AVAILABLE").length + "+", label: "Burung\nTersedia" },
                { value: categories.length, label: "Kategori\nPremium" },
                { value: "100%", label: "Transaksi\nAman" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-3xl font-bold text-white sm:text-4xl font-heading">{stat.value}</p>
                  <p className="mt-2 whitespace-pre-line text-xs text-stone-400 font-body">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-stone-50 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500 font-body">
              Testimoni Pelanggan
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-900 sm:text-4xl font-heading">
              KATA MEREKA TENTANG KAMI
            </h2>
            <div className="mx-auto mt-4 h-0.5 w-16 bg-stone-900" />
          </div>

          <div className="grid gap-6 sm:grid-cols-3 stagger-children">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="flex flex-col bg-white p-8 border border-stone-200 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <Quote className="size-6 text-stone-300 mb-3" />
                <p className="flex-1 text-sm leading-7 text-stone-600 font-body">{t.text}</p>
                <div className="mt-6 border-t border-stone-100 pt-4">
                  <p className="text-sm font-bold text-stone-900 font-body">{t.name}</p>
                  <p className="text-xs text-stone-500 font-body">{t.city}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BLOG SECTION ── */}
      <section className="bg-white py-16 sm:py-20 border-t border-stone-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-stone-500 font-body">
              Tips & Artikel
            </p>
            <h2 className="mt-3 text-3xl font-bold text-stone-900 sm:text-4xl font-heading">
              MURAIMARKET BLOG
            </h2>
            <div className="mt-4 h-0.5 w-16 bg-stone-900" />
          </div>

          <div className="grid gap-6 sm:grid-cols-3 stagger-children">
            {blogPosts.map((post) => (
              <article key={post.title} className="group cursor-pointer">
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-200">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <h3 className="mt-4 text-base font-bold text-stone-900 group-hover:text-stone-600 transition-colors font-heading line-clamp-2">
                  {post.title}
                </h3>
                <p className="mt-2 text-sm text-stone-500 line-clamp-2 font-body">{post.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.15em] text-stone-900 font-body">
                  Baca Selengkapnya
                  <ArrowRight className="size-3" />
                </span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
