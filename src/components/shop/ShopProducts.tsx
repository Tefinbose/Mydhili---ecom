
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
  X,
  RefreshCw,
} from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";

type Category = {
  _id?: string;
  name: string;
  slug: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category?: Category | string | null;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  variants?: {
    sku?: string;
    size?: string;
    color?: string;
    stock?: number;
  }[];
  isFeatured?: boolean;
  createdAt?: string;
};

type SortOption = "newest" | "price-low" | "price-high";

const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

const fallbackImage =
  "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=85";

interface ShopProductsProps {
  initialCategory?: string;
}

export default function ShopProducts({
  initialCategory = "all",
}: ShopProductsProps = {}) {
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    if (initialCategory) {
      setSelectedCategory(initialCategory);
    }
  }, [initialCategory]);

  const loadShopData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productsResponse, categoriesResponse] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);

      if (!productsResponse.ok || !categoriesResponse.ok) {
        throw new Error("We couldn't load the shop right now.");
      }

      const productsData = await productsResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!productsData.success || !categoriesData.success) {
        throw new Error(
          productsData.message ||
            categoriesData.message ||
            "Unable to load shop data."
        );
      }

      setProducts(
        Array.isArray(productsData.products) ? productsData.products : []
      );
      setCategories(
        Array.isArray(categoriesData.categories)
          ? categoriesData.categories
          : []
      );
    } catch (err) {
      console.error("Shop loading failed:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadShopData();
  }, [loadShopData]);

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = products.filter((product) => {
      const category =
        typeof product.category === "object" && product.category
          ? product.category.slug
          : "";

      const categoryMatches =
        selectedCategory === "all" || category === selectedCategory;

      const searchMatches =
        !query ||
        product.name.toLowerCase().includes(query) ||
        (product.description || "").toLowerCase().includes(query) ||
        (product.shortDescription || "").toLowerCase().includes(query) ||
        (typeof product.category === "object" && product.category
          ? product.category.name.toLowerCase().includes(query)
          : "");

      return categoryMatches && searchMatches;
    });

    return result.sort((a, b) => {
      if (sort === "price-low") return a.price - b.price;
      if (sort === "price-high") return b.price - a.price;

      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });
  }, [products, selectedCategory, search, sort]);

  const handleToggleWishlist = (product: Product) => {
    const validImage =
      product.images?.find(
        (img) => typeof img === "string" && img.trim().length > 0
      ) || fallbackImage;

    toggleWishlist({
      productId: product._id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: validImage,
      category:
        typeof product.category === "object"
          ? product.category?.name
          : undefined,
    });
  };

  const categoryButtons = (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => {
          setSelectedCategory("all");
          setMobileFiltersOpen(false);
        }}
        className={`w-full rounded-sm px-3 py-2.5 text-left text-sm transition ${
          selectedCategory === "all"
            ? "bg-[#380712] text-white"
            : "text-stone-600 hover:bg-[#F0E7DC] hover:text-[#380712]"
        }`}
      >
        All Products
      </button>

      {categories.map((category) => (
        <button
          key={category.slug}
          type="button"
          onClick={() => {
            setSelectedCategory(category.slug);
            setMobileFiltersOpen(false);
          }}
          className={`w-full rounded-sm px-3 py-2.5 text-left text-sm transition ${
            selectedCategory === category.slug
              ? "bg-[#380712] text-white"
              : "text-stone-600 hover:bg-[#F0E7DC] hover:text-[#380712]"
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
      <div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[#9A6B35]">
            Find your style
          </p>
          <h2 className="mt-2 font-serif text-2xl text-[#380712] sm:text-3xl">
            Our Collection
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            {loading
              ? "Loading products..."
              : `${filteredProducts.length} ${
                  filteredProducts.length === 1 ? "piece" : "pieces"
                } to explore`}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative min-w-0 flex-1 sm:min-w-[260px]">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search sarees, kurtis..."
              aria-label="Search products"
              className="h-11 w-full border border-[#E3D7CA] bg-white pl-10 pr-4 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#9A6B35]"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMobileFiltersOpen((open) => !open)}
              className="flex h-11 items-center justify-center gap-2 border border-[#E3D7CA] px-4 text-sm text-[#380712] lg:hidden"
            >
              <SlidersHorizontal size={16} />
              Categories
            </button>

            <label className="flex h-11 items-center gap-2 border border-[#E3D7CA] bg-white px-3">
              <span className="whitespace-nowrap text-xs text-stone-500">
                Sort by
              </span>
              <select
                value={sort}
                onChange={(event) =>
                  setSort(event.target.value as SortOption)
                }
                aria-label="Sort products"
                className="max-w-[145px] bg-transparent text-sm text-[#380712] outline-none"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      {mobileFiltersOpen && (
        <div className="mb-6 border border-[#E3D7CA] bg-white p-4 lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-serif text-lg text-[#380712]">Categories</h3>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              aria-label="Close category filters"
              className="p-1 text-stone-500"
            >
              <X size={18} />
            </button>
          </div>
          {categoryButtons}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[210px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-28 border border-[#E8DED2] bg-white p-4">
            <h3 className="mb-4 font-serif text-xl text-[#380712]">
              Categories
            </h3>
            {categoryButtons}

            <div className="mt-6 border-t border-[#E8DED2] pt-5">
              <p className="text-sm font-medium text-[#380712]">
                Need help choosing?
              </p>
              <p className="mt-2 text-xs leading-6 text-stone-500">
                Our team can help you find the right style for your occasion.
              </p>
              <a
                href="https://www.instagram.com/mydhilicollections2010/"
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-xs font-semibold uppercase tracking-wider text-[#9A6B35] hover:text-[#380712]"
              >
                Contact our boutique ↗
              </a>
            </div>
          </div>
        </aside>

        <div>
          {loading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#EDE4D9]" />
                  <div className="mt-4 h-3 w-3/4 bg-[#EDE4D9]" />
                  <div className="mt-3 h-3 w-1/3 bg-[#EDE4D9]" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="border border-[#E8DED2] bg-white px-6 py-16 text-center">
              <p className="font-serif text-2xl text-[#380712]">
                We couldn&apos;t load the collection
              </p>
              <p className="mx-auto mt-3 max-w-md text-sm text-stone-500">
                {error}
              </p>
              <button
                type="button"
                onClick={() => void loadShopData()}
                className="mt-6 inline-flex items-center gap-2 bg-[#380712] px-5 py-3 text-sm text-white transition hover:bg-[#5A1020]"
              >
                <RefreshCw size={16} />
                Try again
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="border border-[#E8DED2] bg-white px-6 py-16 text-center">
              <p className="font-serif text-2xl text-[#380712]">
                No pieces found
              </p>
              <p className="mt-3 text-sm text-stone-500">
                Try another search or explore a different category.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="mt-6 border border-[#380712] px-5 py-3 text-sm text-[#380712] transition hover:bg-[#380712] hover:text-white"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const image = product.images?.find(Boolean) || fallbackImage;
                const hasDiscount =
                  typeof product.compareAtPrice === "number" &&
                  product.compareAtPrice > product.price;
                const categoryName =
                  typeof product.category === "object" && product.category
                    ? product.category.name
                    : "";

                return (
                  <article key={product._id} className="group min-w-0 transition-all duration-500 hover:-translate-y-1.5">
                    <div className="relative overflow-hidden rounded-2xl bg-[#F0E7DC] shadow-[0_4px_20px_rgba(56,7,18,0.05)] transition-all duration-500 group-hover:shadow-[0_18px_40px_rgba(56,7,18,0.14)]">
                      <Link
                        href={`/products/${product.slug}`}
                        className="block"
                        aria-label={`View ${product.name}`}
                      >
                        <div className="aspect-[3/4] overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={image}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                          />
                        </div>
                      </Link>

                      {product.isFeatured && (
                        <span className="absolute left-2 top-2 bg-white/95 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-[#380712] sm:left-3 sm:top-3 sm:text-[10px]">
                          Featured
                        </span>
                      )}

                      {hasDiscount && (
                        <span className="absolute left-2 top-8 bg-[#380712] px-2 py-1 text-[9px] font-semibold text-white sm:left-3 sm:top-11 sm:text-[10px]">
                          Sale
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => handleToggleWishlist(product)}
                        aria-label={
                          isInWishlist(product._id)
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                        aria-pressed={isInWishlist(product._id)}
                        className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition sm:right-3 sm:top-3 ${
                          isInWishlist(product._id)
                            ? "bg-[#380712] text-[#E6C47A]"
                            : "bg-white/95 text-[#380712] hover:bg-[#380712] hover:text-[#E6C47A]"
                        }`}
                      >
                        <Heart
                          size={17}
                          fill={
                            isInWishlist(product._id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>

                      <Link
                        href={`/products/${product.slug}`}
                        className="absolute bottom-0 left-0 right-0 flex translate-y-full items-center justify-center gap-2 bg-[#380712]/95 py-3 text-xs font-medium text-white transition-transform duration-300 group-hover:translate-y-0 max-sm:hidden"
                      >
                        <ShoppingBag size={15} />
                        View Product
                      </Link>
                    </div>

                    <div className="pt-3 sm:pt-4">
                      {categoryName && (
                        <p className="mb-1 text-[9px] uppercase tracking-[0.16em] text-[#9A6B35] sm:text-[10px]">
                          {categoryName}
                        </p>
                      )}

                      <Link
                        href={`/products/${product.slug}`}
                        className="line-clamp-2 font-serif text-sm leading-6 text-[#380712] transition hover:text-[#9A6B35] sm:text-base"
                      >
                        {product.name}
                      </Link>

                      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold text-[#380712]">
                          {formatPrice(product.price)}
                        </span>
                        {hasDiscount && (
                          <span className="text-xs text-stone-400 line-through">
                            {formatPrice(product.compareAtPrice!)}
                          </span>
                        )}
                      </div>

                      {product.variants && product.variants.length > 0 && (
                        <p className="mt-2 text-[10px] text-stone-500 sm:text-xs">
                          {Array.from(
                            new Set(
                              product.variants
                                .map((variant) => variant.size)
                                .filter((size): size is string => Boolean(size))
                            )
                          )
                            .slice(0, 4)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
