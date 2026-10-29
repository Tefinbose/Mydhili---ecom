
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import CurrentYear from "@/components/layout/CurrentYear";

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const categories = [
  { label: "Kurtis", href: "/categories/kurtis" },
  { label: "Sarees", href: "/categories/sarees" },
  { label: "Ethnic Wear", href: "/categories/ethnic-wear" },
  { label: "Dresses", href: "/categories/dresses" },
  { label: "Blouses", href: "/categories/blouses" },
  { label: "Accessories", href: "/categories/accessories" },
];

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#380712] text-white">
      <div className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-12 sm:px-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#D4AF69]">
              Mydhili Boutique
            </p>

            <h2 className="mt-3 font-serif text-2xl sm:text-3xl">
              Elegance in every detail.
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/65">
              Discover styles that celebrate tradition and modern living.
            </p>
          </div>

          <Link
            href="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-[#D4AF69] px-6 py-3 text-sm font-semibold text-[#380712] transition hover:bg-[#ead09a]"
          >
            Explore Collection
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 lg:gap-12">
        <div>
          <Link href="/" className="group inline-flex items-center gap-3.5">
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[#D4AF69]/40 bg-[#380712] shadow-md transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/logo/logo.png"
                alt="Mydhili Boutique logo"
                fill
                sizes="56px"
                className="object-contain p-1.5"
              />
            </div>
            <div>
              <span className="font-serif text-2xl tracking-wide text-white transition-colors duration-300 group-hover:text-[#F5DFC0]">
                Mydhili
              </span>
              <span className="mt-0.5 block text-[9px] font-medium uppercase tracking-[0.34em] text-[#D4AF69]">
                Boutique
              </span>
            </div>
          </Link>

          <p className="mt-5 max-w-xs text-sm leading-7 text-white/65">
            Your destination for elegant ethnic wear, timeless styles, and
            thoughtfully curated fashion for every occasion.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href="https://www.instagram.com/mydhilicollections2010/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-[#D4AF69] hover:text-[#D4AF69]"
            >
              <InstagramIcon />
            </Link>

            <Link
              href="/contact"
              aria-label="Contact us"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-[#D4AF69] hover:text-[#D4AF69]"
            >
              <Mail size={18} />
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF69]">
            Quick Links
          </h3>

          <ul className="mt-6 space-y-4">
            {quickLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-white/65 transition hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF69]">
            Shop Categories
          </h3>

          <ul className="mt-6 space-y-4">
            {categories.map((category) => (
              <li key={category.href}>
                <Link
                  href={category.href}
                  className="text-sm text-white/65 transition hover:text-white"
                >
                  {category.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#D4AF69]">
            Get in Touch
          </h3>

          <div className="mt-6 space-y-5">
            <div className="flex items-start gap-3">
              <MapPin
                size={19}
                className="mt-1 shrink-0 text-[#D4AF69]"
              />
              <p className="text-sm leading-6 text-white/65">
                Mydhili Collections
                <br />
                Azhimala, Vizhinjam
                <br />
                Thiruvananthapuram, Kerala, India
              </p>
            </div>

            <div className="flex items-start gap-3">
              <Phone
                size={18}
                className="mt-1 shrink-0 text-[#D4AF69]"
              />
              <p className="text-sm leading-6 text-white/65">
                Contact details coming soon
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-6 text-xs text-white/50 sm:px-8 md:flex-row md:items-center md:justify-between">
          <p>
           © <CurrentYear /> Mydhili Collections. All rights reserved.
            reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-3">
            <Link
              href="/privacy-policy"
              className="transition hover:text-white"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-white"
            >
              Terms &amp; Conditions
            </Link>

            <Link
              href="/shipping-policy"
              className="transition hover:text-white"
            >
              Shipping &amp; Returns
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
