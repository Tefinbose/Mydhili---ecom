
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Menu,
  X,
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ChevronDown,
  ArrowUpRight,
  Sparkles,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

type Category = {
  _id: string;
  name: string;
  slug: string;
};

const mobileLinks = [
  { label: "Home", href: "/" },
  { label: "Shop All", href: "/shop" },
  { label: "Our Story", href: "/our-story" },
  { label: "Contact Us", href: "/contact" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "My Account", href: "/account" },
  { label: "Shopping Cart", href: "/cart" },
];

const INSTAGRAM_URL = "https://www.instagram.com/mydhilicollections2010/";

export default function Navbar() {
  const { itemCount, isLoaded } = useCart();

  const [categories, setCategories] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCategories() {
      try {
        const response = await fetch("/api/categories");
        if (!response.ok) throw new Error("Unable to load categories");

        const data = await response.json();

        if (!cancelled && data.success && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error("Navbar categories failed to load:", error);
      }
    }

    loadCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let ticking = false;

    function handleScroll() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const y = window.scrollY;
          setScrolled((prev) => (y > 45 ? true : y < 15 ? false : prev));
          ticking = false;
        });

        ticking = true;
      }
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setCategoryMenuOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [menuOpen]);

  const closeMenus = () => {
    setMenuOpen(false);
    setCategoryMenuOpen(false);
  };

  const navLinkClass =
    "relative flex h-full items-center text-[11px] font-medium uppercase tracking-[0.16em] text-[#380712]/80 transition-colors duration-300 hover:text-[#9A6B35] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#D4AF69] after:transition-all after:duration-300 hover:after:w-full";

  const iconBtnClass =
    "flex h-9 w-9 items-center justify-center rounded-full text-[#380712] transition-colors duration-300 hover:bg-[#380712]/[0.06] hover:text-[#9A6B35]";

  return (
    <>
      {/* Announcement Strip */}
      <div className="bg-[#380712] py-2 text-center text-[10px] font-medium uppercase tracking-[0.22em] text-[#F5DFC0] sm:text-[11px] sm:tracking-[0.25em]">
        <div className="inline-flex items-center justify-center gap-2">
          <Sparkles size={11} className="text-[#D4AF69]" />
          <span>A little tradition, a lot of elegance</span>
          <Sparkles size={11} className="text-[#D4AF69]" />
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 bg-[#FAF7F2]/95 text-[#380712] backdrop-blur-md transition-shadow duration-300 ${scrolled
            ? "shadow-[0_8px_30px_rgba(56,7,18,0.08)] bg-[#FAF7F2]/98"
            : ""
          }`}
      >
        {/* Header container */}
        <div className="relative mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:h-24 lg:px-10">
          {/* Left: Mobile hamburger / Desktop logo */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              className={`${iconBtnClass} -ml-2 lg:hidden`}
              aria-label={menuOpen ? "Close navigation" : "Open navigation"}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
            >
              {menuOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Menu size={20} strokeWidth={1.5} />
              )}
            </button>

            {/* Desktop Logo */}
            <Link
              href="/"
              onClick={closeMenus}
              className="group hidden shrink-0 items-center lg:flex"
              aria-label="Mydhili Boutique home"
            >
              <div className="relative flex items-center transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/logo/logo.png"
                  alt="Mydhili Boutique logo"
                  width={759}
                  height={566}
                  priority
                  className="h-16 w-auto object-contain lg:h-18 xl:h-20"
                />
              </div>
            </Link>
          </div>

          {/* Mobile Logo */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 lg:hidden">
            <Link
              href="/"
              onClick={closeMenus}
              className="group flex items-center justify-center"
              aria-label="Mydhili Boutique home"
            >
              <Image
                src="/logo/logo.png"
                alt="Mydhili Boutique logo"
                width={759}
                height={566}
                priority
                className="h-[52px] w-auto object-contain transition-transform duration-300 group-hover:scale-105 sm:h-14"
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden h-full items-stretch gap-8 lg:flex xl:gap-10"
          >
            <Link href="/shop" className={navLinkClass}>
              Shop All
            </Link>

            <div
              className="group relative flex items-stretch"
              onMouseEnter={() => setCategoryMenuOpen(true)}
              onMouseLeave={() => setCategoryMenuOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoryMenuOpen((open) => !open)}
                onKeyDown={(event) => {
                  if (event.key === "Escape") setCategoryMenuOpen(false);
                }}
                className={`${navLinkClass} gap-1.5`}
                aria-expanded={categoryMenuOpen}
                aria-haspopup="true"
              >
                Categories
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-300 ${categoryMenuOpen ? "rotate-180" : ""
                    }`}
                />
              </button>

              <div
                className={`absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 transition-all duration-200 ${categoryMenuOpen
                    ? "visible translate-y-0 opacity-100"
                    : "invisible -translate-y-1 opacity-0 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100"
                  }`}
              >
                <div className="mt-px border border-[#D4AF69]/30 bg-white p-2 shadow-[0_15px_40px_rgba(56,7,18,0.12)]">
                  <div className="border-b border-[#380712]/10 px-4 py-3">
                    <p className="font-serif text-lg text-[#380712]">
                      Find your style
                    </p>
                    <p className="mt-0.5 text-[10px] uppercase tracking-[0.18em] text-[#9A6B35]">
                      Explore the collection
                    </p>
                  </div>

                  {categories.length > 0 ? (
                    <div className="max-h-[50vh] overflow-y-auto py-1">
                      {categories.map((category) => (
                        <Link
                          key={category._id}
                          href={`/categories/${category.slug}`}
                          onClick={closeMenus}
                          className="group/item flex items-center justify-between px-4 py-2.5 text-sm text-stone-700 transition hover:bg-[#FAF7F2] hover:text-[#9A6B35]"
                        >
                          {category.name}
                          <ArrowUpRight
                            size={14}
                            className="text-[#9A6B35] opacity-0 transition group-hover/item:opacity-100"
                          />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="px-4 py-4 text-sm text-stone-500">
                      Explore all our categories on the shop page.
                    </p>
                  )}

                  <Link
                    href="/shop"
                    onClick={closeMenus}
                    className="flex items-center justify-between border-t border-[#380712]/10 px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.17em] text-[#380712] transition hover:text-[#9A6B35]"
                  >
                    View All Products
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/our-story" className={navLinkClass}>
              Our Story
            </Link>

            <Link href="/contact" className={navLinkClass}>
              Contact
            </Link>

            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${navLinkClass} gap-1`}
            >
              Instagram
              <ArrowUpRight size={12} />
            </Link>
          </nav>

          {/* Right: Action icons */}
          <div className="flex items-center justify-end gap-0.5">
            <Link
              href="/shop"
              aria-label="Search products"
              className={iconBtnClass}
            >
              <Search size={19} strokeWidth={1.5} />
            </Link>

            <Link
              href="/wishlist"
              aria-label="Wishlist"
              className={`${iconBtnClass} hidden sm:flex`}
            >
              <Heart size={19} strokeWidth={1.5} />
            </Link>

            <Link
              href="/account"
              aria-label="My account"
              className={`${iconBtnClass} hidden lg:flex`}
            >
              <UserRound size={19} strokeWidth={1.5} />
            </Link>

            {/* Cart icon with live item count */}
            <Link
              href="/cart"
              aria-label={`Shopping cart with ${itemCount} items`}
              className={`${iconBtnClass} relative`}
            >
              <ShoppingBag size={19} strokeWidth={1.5} />

              {isLoaded && itemCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#380712] px-1 text-[9px] font-semibold leading-none text-white ring-2 ring-[#FAF7F2]">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Gold hairline */}
        <div className="h-px bg-gradient-to-r from-transparent via-[#D4AF69]/50 to-transparent" />

        {/* Mobile navigation */}
        <div
          id="mobile-navigation"
          className={`absolute left-0 right-0 top-full z-50 overflow-hidden border-t border-[#D4AF69]/30 bg-[#FAF7F2] shadow-[0_20px_35px_rgba(56,7,18,0.12)] transition-all duration-300 ease-in-out lg:hidden ${menuOpen
              ? "visible max-h-[80vh] overflow-y-auto opacity-100"
              : "invisible max-h-0 opacity-0"
            }`}
          aria-hidden={!menuOpen}
        >
          <nav
            aria-label="Mobile navigation"
            className="px-5 pb-6 pt-3 sm:px-8"
          >
            <div className="mb-4 flex items-center justify-between border-b border-[#380712]/[0.08] pb-4 pt-1">
              <Link href="/" onClick={closeMenus} className="flex items-center">
                <Image
                  src="/logo/logo.png"
                  alt="Mydhili Boutique logo"
                  width={759}
                  height={566}
                  className="h-14 w-auto object-contain"
                />
              </Link>

              <p className="text-[8px] font-medium uppercase tracking-[0.24em] text-[#9A6B35]">
                A little tradition, a lot of elegance
              </p>
            </div>

            <p className="mb-1 px-1 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
              Explore Mydhili
            </p>

            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenus}
                tabIndex={menuOpen ? 0 : -1}
                className="group flex items-center justify-between border-b border-[#380712]/[0.08] py-3 text-sm text-[#380712] transition hover:pl-2 hover:text-[#9A6B35]"
              >
                <span>{item.label}</span>
                <ArrowUpRight
                  size={15}
                  className="text-[#9A6B35] opacity-0 transition group-hover:opacity-100"
                />
              </Link>
            ))}

            <div className="border-b border-[#380712]/[0.08] py-4">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6B35]">
                Shop by Category
              </p>

              {categories.length > 0 ? (
                <div className="grid grid-cols-2 gap-x-5">
                  {categories.map((category) => (
                    <Link
                      key={category._id}
                      href={`/categories/${category.slug}`}
                      onClick={closeMenus}
                      tabIndex={menuOpen ? 0 : -1}
                      className="py-2 text-sm text-stone-600 transition hover:text-[#9A6B35]"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  href="/shop"
                  onClick={closeMenus}
                  tabIndex={menuOpen ? 0 : -1}
                  className="text-sm text-stone-600 hover:text-[#9A6B35]"
                >
                  Browse all products
                </Link>
              )}
            </div>

            <Link
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMenus}
              tabIndex={menuOpen ? 0 : -1}
              className="mt-4 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#380712] transition hover:text-[#9A6B35]"
            >
              Follow us on Instagram
              <ArrowUpRight size={15} />
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
