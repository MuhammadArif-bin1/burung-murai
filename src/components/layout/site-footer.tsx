import Link from "next/link";
import { Bird, Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="bg-stone-900 text-stone-300">
      {/* Top section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 py-16 md:grid-cols-4">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/beranda" className="inline-flex items-center gap-2 group">
              <Bird className="w-5 h-5 text-white" />
              <span className="font-bold text-sm tracking-[0.15em] uppercase text-white font-body">
                MuraiMarket
              </span>
            </Link>
            <p className="mt-4 text-xs leading-6 text-stone-400 font-body">
              Platform terpercaya untuk jual beli burung Murai Batu berkualitas premium di Indonesia.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6 font-body">
              Navigasi
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/beranda", label: "Beranda" },
                { href: "/burung", label: "Katalog Burung" },
                { href: "/dashboard/transaksi", label: "Cek Transaksi" },
                { href: "/dashboard/favorit", label: "Favorit Saya" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-stone-400 hover:text-white transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Kategori */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6 font-body">
              Kategori
            </h3>
            <ul className="space-y-3">
              {[
                { href: "/burung?category=murai-batu-medan", label: "Murai Batu Medan" },
                { href: "/burung?category=murai-batu-borneo", label: "Murai Batu Borneo" },
                { href: "/burung?category=murai-trotol", label: "Murai Trotol" },
                { href: "/burung?category=murai-gacor", label: "Murai Gacor" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-stone-400 hover:text-white transition-colors font-body"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white mb-6 font-body">
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-xs text-stone-400 font-body">
                <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-stone-500" />
                <span>
                  Jl. Murai Batu No. 123
                  <br />
                  Jakarta Selatan, Indonesia
                </span>
              </li>
              <li className="flex items-center gap-3 text-xs text-stone-400 font-body">
                <Phone className="w-4 h-4 shrink-0 text-stone-500" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3 text-xs text-stone-400 font-body">
                <Mail className="w-4 h-4 shrink-0 text-stone-500" />
                <span>halo@muraimarket.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-stone-800 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] text-stone-500 uppercase tracking-wider font-body">
            &copy; {new Date().getFullYear()} MuraiMarket. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6">
            <Link href="/" className="text-[10px] text-stone-500 hover:text-white uppercase tracking-wider transition-colors font-body">
              Kebijakan Privasi
            </Link>
            <Link href="/" className="text-[10px] text-stone-500 hover:text-white uppercase tracking-wider transition-colors font-body">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
