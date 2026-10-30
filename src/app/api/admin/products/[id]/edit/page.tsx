
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  ImagePlus,
} from "lucide-react";

type Category = {
  _id: string;
  name: string;
};

type Variant = {
  sku: string;
  size: string;
  color: string;
  stock: number | string;
};

type ProductData = {
  name: string;
  description: string;
  shortDescription: string;
  category: string;
  price: number | string;
  compareAtPrice: number | string;
  images: string[];
  variants: Variant[];
  isFeatured: boolean;
  isActive: boolean;
};

const emptyProduct: ProductData = {
  name: "",
  description: "",
  shortDescription: "",
  category: "",
  price: "",
  compareAtPrice: "",
  images: [],
  variants: [],
  isFeatured: false,
  isActive: true,
};

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [form, setForm] = useState<ProductData>(emptyProduct);
  const [categories, setCategories] = useState<Category[]>([]);
  const [imageInput, setImageInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProduct = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [productResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/admin/products/${productId}`, {
          cache: "no-store",
        }),
        fetch("/api/admin/products", {
          cache: "no-store",
        }),
      ]);

      const productData = await productResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!productResponse.ok || !productData.success) {
        throw new Error(productData.message || "Unable to load product.");
      }

      if (!categoriesResponse.ok || !categoriesData.success) {
        throw new Error(
          categoriesData.message || "Unable to load categories."
        );
      }

      const product = productData.product;

      setCategories(categoriesData.categories || []);

      setForm({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        category:
          typeof product.category === "object"
            ? product.category?._id || ""
            : product.category || "",
        price: product.price ?? "",
        compareAtPrice: product.compareAtPrice ?? "",
        images: product.images || [],
        variants: (product.variants || []).map((variant: Variant) => ({
          sku: variant.sku || "",
          size: variant.size || "",
          color: variant.color || "",
          stock: variant.stock ?? 0,
        })),
        isFeatured: Boolean(product.isFeatured),
        isActive: Boolean(product.isActive),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load product."
      );
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    loadProduct();
  }, [loadProduct]);

  function updateField<K extends keyof ProductData>(
    field: K,
    value: ProductData[K]
  ) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function addImage() {
    const image = imageInput.trim();

    if (!image) return;

    updateField("images", [...form.images, image]);
    setImageInput("");
  }

  function removeImage(index: number) {
    updateField(
      "images",
      form.images.filter((_, imageIndex) => imageIndex !== index)
    );
  }

  function addVariant() {
    updateField("variants", [
      ...form.variants,
      { sku: "", size: "", color: "", stock: 0 },
    ]);
  }

  function updateVariant(
    index: number,
    field: keyof Variant,
    value: string | number
  ) {
    const updated = [...form.variants];
    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    updateField("variants", updated);
  }

  function removeVariant(index: number) {
    updateField(
      "variants",
      form.variants.filter((_, variantIndex) => variantIndex !== index)
    );
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update product.");
      }

      setSuccess("Product updated successfully.");

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 900);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update product."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center gap-3 text-sm text-stone-500">
        <RefreshCw size={18} className="animate-spin" />
        Loading product...
      </div>
    );
  }

  if (error && !form.name) {
    return (
      <div className="min-h-screen px-5 py-10 sm:px-8">
        <div className="mx-auto max-w-3xl border border-red-200 bg-red-50 p-6">
          <p className="text-sm text-red-700">{error}</p>
          <Link
            href="/admin/products"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#380712]"
          >
            <ArrowLeft size={16} />
            Back to products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-5 py-8 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-[#380712]"
        >
          <ArrowLeft size={16} />
          Back to products
        </Link>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
            Product management
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#380712] sm:text-4xl">
            Edit Product
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Update product information, images and inventory.
          </p>
        </div>

        {error && (
          <div role="alert" className="mt-6 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div role="status" className="mt-6 border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-7">
          <section className="border border-[#EDE4D9] bg-white p-5 sm:p-7">
            <h2 className="font-serif text-xl font-semibold text-[#380712]">
              Basic information
            </h2>

            <div className="mt-6 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Product name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full border border-[#E9DFD2] px-4 py-3 text-sm outline-none focus:border-[#9A6B35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Short description
                </label>
                <textarea
                  rows={2}
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateField("shortDescription", e.target.value)
                  }
                  className="w-full border border-[#E9DFD2] px-4 py-3 text-sm outline-none focus:border-[#9A6B35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Full description *
                </label>
                <textarea
                  required
                  rows={6}
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  className="w-full border border-[#E9DFD2] px-4 py-3 text-sm outline-none focus:border-[#9A6B35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Category *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full border border-[#E9DFD2] bg-white px-4 py-3 text-sm outline-none focus:border-[#9A6B35]"
                >
                  <option value="">Select category</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="border border-[#EDE4D9] bg-white p-5 sm:p-7">
            <h2 className="font-serif text-xl font-semibold text-[#380712]">
              Pricing
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Selling price (₹) *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="w-full border border-[#E9DFD2] px-4 py-3 text-sm outline-none focus:border-[#9A6B35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Compare-at price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.compareAtPrice}
                  onChange={(e) =>
                    updateField("compareAtPrice", e.target.value)
                  }
                  className="w-full border border-[#E9DFD2] px-4 py-3 text-sm outline-none focus:border-[#9A6B35]"
                />
              </div>
            </div>
          </section>

          <section className="border border-[#EDE4D9] bg-white p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#380712]">
                  Product images
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                  Add image URLs. Image file uploading will be added separately.
                </p>
              </div>
              <ImagePlus size={22} className="text-[#9A6B35]" />
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="Paste product image URL"
                className="min-w-0 flex-1 border border-[#E9DFD2] px-4 py-3 text-sm outline-none focus:border-[#9A6B35]"
              />
              <button
                type="button"
                onClick={addImage}
                className="inline-flex items-center justify-center gap-2 bg-[#FAF3E8] px-5 py-3 text-sm font-semibold text-[#380712] hover:bg-[#F1E5D4]"
              >
                <Plus size={16} />
                Add image
              </button>
            </div>

            {form.images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {form.images.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative">
                    <div className="aspect-square overflow-hidden bg-[#FAF7F2]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                      className="absolute right-2 top-2 bg-white p-2 text-red-600 shadow hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                    </button>
                    <p className="mt-2 truncate text-xs text-stone-400">
                      Image {index + 1}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="border border-[#EDE4D9] bg-white p-5 sm:p-7">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#380712]">
                  Product variants
                </h2>
                <p className="mt-1 text-xs text-stone-500">
                  Add SKU, size, color and available stock for each variant.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center justify-center gap-2 border border-[#D4AF69] px-4 py-2.5 text-sm font-semibold text-[#380712] hover:bg-[#FAF3E8]"
              >
                <Plus size={16} />
                Add variant
              </button>
            </div>

            {form.variants.length === 0 ? (
              <p className="mt-6 bg-[#FAF7F2] p-5 text-center text-sm text-stone-500">
                No variants added. You can add variants if your product has different sizes or colors.
              </p>
            ) : (
              <div className="mt-6 space-y-4">
                {form.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="grid gap-3 border border-[#EEE7DE] p-4 sm:grid-cols-2 lg:grid-cols-5"
                  >
                    <div>
                      <label className="mb-2 block text-xs font-medium text-stone-500">
                        SKU
                      </label>
                      <input
                        value={variant.sku}
                        onChange={(e) =>
                          updateVariant(index, "sku", e.target.value)
                        }
                        placeholder="SKU"
                        className="w-full border border-[#E9DFD2] px-3 py-2.5 text-sm outline-none focus:border-[#9A6B35]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-stone-500">
                        Size
                      </label>
                      <input
                        value={variant.size}
                        onChange={(e) =>
                          updateVariant(index, "size", e.target.value)
                        }
                        placeholder="S, M, L..."
                        className="w-full border border-[#E9DFD2] px-3 py-2.5 text-sm outline-none focus:border-[#9A6B35]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-stone-500">
                        Color
                      </label>
                      <input
                        value={variant.color}
                        onChange={(e) =>
                          updateVariant(index, "color", e.target.value)
                        }
                        placeholder="Color"
                        className="w-full border border-[#E9DFD2] px-3 py-2.5 text-sm outline-none focus:border-[#9A6B35]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-medium text-stone-500">
                        Stock
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="1"
                        value={variant.stock}
                        onChange={(e) =>
                          updateVariant(index, "stock", e.target.value)
                        }
                        className="w-full border border-[#E9DFD2] px-3 py-2.5 text-sm outline-none focus:border-[#9A6B35]"
                      />
                    </div>

                    <div className="flex items-end">
                      <button
                        type="button"
                        onClick={() => removeVariant(index)}
                        className="inline-flex w-full items-center justify-center gap-2 border border-red-200 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="border border-[#EDE4D9] bg-white p-5 sm:p-7">
            <h2 className="font-serif text-xl font-semibold text-[#380712]">
              Product visibility
            </h2>

            <div className="mt-5 space-y-4">
              <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="h-4 w-4 accent-[#380712]"
                />
                Active — product can be displayed in the store
              </label>

              <label className="flex cursor-pointer items-center gap-3 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    updateField("isFeatured", e.target.checked)
                  }
                  className="h-4 w-4 accent-[#380712]"
                />
                Featured — highlight this product in the store
              </label>
            </div>
          </section>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              href="/admin/products"
              className="inline-flex items-center justify-center border border-[#E9DFD2] px-6 py-3 text-sm font-semibold text-stone-600 hover:bg-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 bg-[#380712] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#5A1020] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <RefreshCw size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? "Saving changes..." : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
