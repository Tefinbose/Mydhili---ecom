
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Search,
  Package,
  RefreshCw,
  ExternalLink,
  Pencil,
  Trash2,
  AlertTriangle,
} from "lucide-react";

type CategoryInfo = {
  _id?: string;
  name?: string;
};

type Product = {
  _id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: CategoryInfo | string;
  variants: {
    sku: string;
    size: string;
    color: string;
    stock: number;
  }[];
  isActive: boolean;
  isFeatured: boolean;
  createdAt?: string;
};

type Category = {
  _id: string;
  name: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<{ id: string; name: string } | null>(null);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load products.");
      }

      setProducts(data.products || []);
      setCategories(data.categories || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleDeleteConfirmed() {
    if (!productToDelete) return;
    setDeletingId(productToDelete.id);

    try {
      const response = await fetch(`/api/admin/products/${productToDelete.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete product.");
      }

      setProducts((prev) => prev.filter((p) => p._id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete product.");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.slug.toLowerCase().includes(search.toLowerCase());

      const catId =
        typeof product.category === "object"
          ? product.category?._id
          : product.category;

      const matchesCategory =
        selectedCategory === "all" || catId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  function getCategoryName(category: Product["category"]) {
    if (typeof category === "object" && category?.name) {
      return category.name;
    }
    if (typeof category === "string") {
      const found = categories.find((c) => c._id === category);
      if (found) return found.name;
    }

    return "Uncategorised";
  }

  function getStock(product: Product) {
    return (product.variants || []).reduce(
      (total, variant) => total + Number(variant.stock || 0),
      0
    );
  }

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* Page heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
              Store inventory
            </p>

            <h1 className="mt-2 font-serif text-3xl font-semibold text-[#380712] sm:text-4xl">
              Products
            </h1>

            <p className="mt-2 text-sm text-stone-500">
              Manage your boutique products and inventory.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="inline-flex items-center justify-center gap-2 bg-[#380712] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#5A1020]"
          >
            <Plus size={17} />
            Add product
          </Link>
        </div>

        {/* Statistics */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="border border-[#EDE4D9] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Total products
            </p>
            <p className="mt-2 font-serif text-3xl font-semibold text-[#380712]">
              {products.length}
            </p>
          </div>

          <div className="border border-[#EDE4D9] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Active products
            </p>
            <p className="mt-2 font-serif text-3xl font-semibold text-[#380712]">
              {products.filter((product) => product.isActive).length}
            </p>
          </div>

          <div className="border border-[#EDE4D9] bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-stone-400">
              Featured products
            </p>
            <p className="mt-2 font-serif text-3xl font-semibold text-[#380712]">
              {products.filter((product) => product.isFeatured).length}
            </p>
          </div>
        </div>

        {/* Search and filters */}
        <section className="mt-8 border border-[#EDE4D9] bg-white p-5 sm:p-6">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products..."
                className="w-full border border-[#E9DFD2] py-3 pl-11 pr-4 text-sm outline-none focus:border-[#9A6B35]"
              />
            </div>

            <select
              value={selectedCategory}
              onChange={(event) => setSelectedCategory(event.target.value)}
              className="border border-[#E9DFD2] bg-white px-4 py-3 text-sm text-[#380712] outline-none focus:border-[#9A6B35]"
            >
              <option value="all">All categories</option>

              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={loadProducts}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 border border-[#E9DFD2] px-4 py-3 text-sm text-[#380712] hover:bg-[#FAF7F2] disabled:opacity-50"
            >
              <RefreshCw
                size={16}
                className={loading ? "animate-spin" : ""}
              />
              Refresh
            </button>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        {/* Product table */}
        <section className="mt-6 overflow-hidden border border-[#EDE4D9] bg-white">
          <div className="flex items-center justify-between border-b border-[#EEE7DE] px-5 py-4">
            <h2 className="font-serif text-xl font-semibold text-[#380712]">
              Product collection
            </h2>

            <span className="text-xs text-stone-400">
              {filteredProducts.length} products
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center gap-3 py-20 text-sm text-stone-500">
              <RefreshCw size={18} className="animate-spin" />
              Loading products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="px-5 py-20 text-center">
              <Package
                size={35}
                className="mx-auto text-[#C6AD8A]"
              />

              <h3 className="mt-4 font-serif text-xl font-semibold text-[#380712]">
                No products found
              </h3>

              <p className="mt-2 text-sm text-stone-500">
                {products.length === 0
                  ? "Start building your collection by adding your first product."
                  : "Try changing your search or category filter."}
              </p>

              {products.length === 0 && (
                <Link
                  href="/admin/products/new"
                  className="mt-5 inline-flex items-center gap-2 bg-[#380712] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5A1020]"
                >
                  <Plus size={16} />
                  Add your first product
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-[#FAF7F2] text-[11px] uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Product</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Price</th>
                    <th className="px-5 py-4 font-semibold">Stock</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-5 py-4 font-semibold">Store</th>
                    <th className="px-5 py-4 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#F0EAE2]">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="transition hover:bg-[#FFFEFC]"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-14 w-14 shrink-0 overflow-hidden bg-[#FAF7F2]">
                            {product.images?.[0] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-[#C6AD8A]">
                                <Package size={20} />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-medium text-[#380712]">
                              {product.name}
                            </p>
                            <p className="mt-1 text-xs text-stone-400">
                              {product.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 text-sm text-stone-600">
                        {getCategoryName(product.category)}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4 text-sm font-semibold text-[#380712]">
                        ₹{Number(product.price).toLocaleString("en-IN")}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4 text-sm text-stone-600">
                        {getStock(product)}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex px-2.5 py-1 text-xs font-medium ${
                            product.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </span>

                        {product.isFeatured && (
                          <span className="mt-1 inline-flex bg-[#FBF3E5] px-2.5 py-1 text-xs font-medium text-[#8A5A22]">
                            Featured
                          </span>
                        )}
                      </td>

                      {/* Store */}
                      <td className="px-5 py-4">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#8B2635] hover:text-[#380712]"
                        >
                          View product
                          <ExternalLink size={13} />
                        </Link>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/products/${product._id}/edit`}
                            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-[#FAF3E8] px-3.5 py-2 text-xs font-semibold text-[#380712] transition hover:bg-[#D4AF69]"
                          >
                            <Pencil size={13} />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              setProductToDelete({
                                id: product._id,
                                name: product.name,
                              })
                            }
                            aria-label={`Delete ${product.name}`}
                            className="inline-flex items-center rounded-lg border border-red-200 bg-white p-2 text-xs text-red-600 transition hover:bg-red-50"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Delete confirmation modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-[#E9DFD2] bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <AlertTriangle size={20} />
              </div>
              <h3 className="font-serif text-lg font-semibold text-[#380712]">
                Delete product?
              </h3>
            </div>

            <p className="mt-3 text-sm text-stone-600">
              Are you sure you want to delete <span className="font-semibold text-stone-900">&ldquo;{productToDelete.name}&rdquo;</span>? This will permanently remove the product from your store.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                disabled={Boolean(deletingId)}
                className="rounded-xl border border-[#E9DFD2] px-4 py-2 text-sm font-semibold text-stone-600 hover:bg-stone-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteConfirmed}
                disabled={Boolean(deletingId)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
              >
                {deletingId && <RefreshCw size={14} className="animate-spin" />}
                {deletingId ? "Deleting..." : "Yes, delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
