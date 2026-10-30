
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

type Category = {
  _id: string;
  name: string;
};

type Variant = {
  sku: string;
  size: string;
  color: string;
  stock: string;
};

export default function NewProductPage() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [imageInput, setImageInput] = useState("");

  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    description: "",
    category: "",
    price: "",
    compareAtPrice: "",
    isFeatured: false,
    isActive: true,
  });

  const [images, setImages] = useState<string[]>([]);
  const [variants, setVariants] = useState<Variant[]>([
    { sku: "", size: "", color: "", stock: "0" },
  ]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch("/api/admin/products");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Could not load categories.");
        }

        setCategories(data.categories || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Could not load categories."
        );
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function addImage() {
    const value = imageInput.trim();

    if (!value) return;

    if (value.startsWith("/")) {
      setImages((current) => [...current, value]);
      setImageInput("");
      setError("");
      return;
    }

    try {
      const url = new URL(value);

      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new Error("Invalid URL");
      }

      setImages((current) => [...current, value]);
      setImageInput("");
      setError("");
    } catch {
      setError("Please enter a valid image URL (e.g. https://... or /products/image.jpg).");
    }
  }

  function updateVariant(
    index: number,
    field: keyof Variant,
    value: string
  ) {
    setVariants((current) =>
      current.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      )
    );
  }

  function addVariant() {
    setVariants((current) => [
      ...current,
      { sku: "", size: "", color: "", stock: "0" },
    ]);
  }

  function removeVariant(index: number) {
    setVariants((current) => current.filter((_, i) => i !== index));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          compareAtPrice: form.compareAtPrice,
          images,
          variants: variants.map((variant) => ({
            ...variant,
            stock: Number(variant.stock),
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to create product.");
      }

      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  const inputClass =
    "mt-2 w-full rounded-xl border border-[#E8DED2] bg-white px-4 py-3 text-sm text-[#380712] outline-none transition placeholder:text-stone-400 focus:border-[#9A6B35] focus:ring-2 focus:ring-[#D4AF69]/20";

  const labelClass =
    "text-sm font-semibold text-[#380712]";

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#8B2635] hover:text-[#380712]"
        >
          <ArrowLeft size={17} />
          Back to products
        </Link>

        <div className="mb-8 mt-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#9A6B35]">
            Product management
          </p>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-[#380712] sm:text-4xl">
            Add new product
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Add a product to your Mydhili Collections store.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-2xl border border-[#EDE4D9] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="font-serif text-xl font-semibold text-[#380712]">
              Basic information
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className={labelClass}>Product name *</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  placeholder="e.g. Premium Floral Silk Saree"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Short description</label>
                <input
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateField("shortDescription", e.target.value)
                  }
                  placeholder="A short description for product cards"
                  className={inputClass}
                />
              </div>

              <div className="sm:col-span-2">
                <label className={labelClass}>Full description *</label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Describe the product, fabric, fit, details, and care instructions..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Category *</label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className={inputClass}
                  disabled={loadingCategories}
                >
                  <option value="">
                    {loadingCategories ? "Loading categories..." : "Select category"}
                  </option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {!loadingCategories && categories.length === 0 && (
                  <p className="mt-2 text-xs text-amber-700">
                    No active categories found. Add a category before creating a product.
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#EDE4D9] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="font-serif text-xl font-semibold text-[#380712]">
              Pricing
            </h2>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Selling price (₹) *</label>
                <input
                  required
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  placeholder="1499"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Compare-at price (₹)</label>
                <input
                  min="0"
                  step="0.01"
                  type="number"
                  value={form.compareAtPrice}
                  onChange={(e) =>
                    updateField("compareAtPrice", e.target.value)
                  }
                  placeholder="1999"
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#EDE4D9] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="font-serif text-xl font-semibold text-[#380712]">
              Product images
            </h2>
            <p className="mt-1 text-sm text-stone-500">
              Add publicly accessible image URLs for this product.
            </p>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <input
                value={imageInput}
                onChange={(e) => setImageInput(e.target.value)}
                placeholder="https://example.com/product-image.jpg"
                className={inputClass + " mt-0"}
              />
              <button
                type="button"
                onClick={addImage}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#380712] px-5 py-3 text-sm font-semibold text-white hover:bg-[#5A1020]"
              >
                <ImagePlus size={17} />
                Add image
              </button>
            </div>

            {images.length > 0 && (
              <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {images.map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="overflow-hidden rounded-xl border border-[#E8DED2]"
                  >
                    <div className="aspect-square bg-[#FAF7F2]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setImages((current) =>
                          current.filter((_, i) => i !== index)
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-[#EDE4D9] bg-white p-5 shadow-sm sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-semibold text-[#380712]">
                  Product variants
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Add sizes, colours, SKU codes, and stock quantities.
                </p>
              </div>

              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-2 rounded-xl border border-[#D4AF69] px-4 py-2.5 text-sm font-semibold text-[#6F451F] hover:bg-[#FBF5E9]"
              >
                <Plus size={16} />
                Add variant
              </button>
            </div>

            <div className="mt-5 space-y-4">
              {variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-xl border border-[#EDE4D9] bg-[#FFFEFC] p-4 sm:grid-cols-2 lg:grid-cols-4"
                >
                  <div>
                    <label className={labelClass}>SKU</label>
                    <input
                      value={variant.sku}
                      onChange={(e) =>
                        updateVariant(index, "sku", e.target.value)
                      }
                      placeholder="MYD-001"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Size</label>
                    <input
                      value={variant.size}
                      onChange={(e) =>
                        updateVariant(index, "size", e.target.value)
                      }
                      placeholder="Free Size / M / L"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Colour</label>
                    <input
                      value={variant.color}
                      onChange={(e) =>
                        updateVariant(index, "color", e.target.value)
                      }
                      placeholder="Maroon"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Stock quantity</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(index, "stock", e.target.value)
                      }
                      className={inputClass}
                    />
                  </div>

                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(index)}
                      className="inline-flex items-center gap-2 text-xs font-semibold text-red-600 hover:text-red-800 sm:col-span-2 lg:col-span-4"
                    >
                      <Trash2 size={14} />
                      Remove this variant
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-[#EDE4D9] bg-white p-5 shadow-sm sm:p-7">
            <h2 className="font-serif text-xl font-semibold text-[#380712]">
              Store visibility
            </h2>

            <div className="mt-5 space-y-4">
              <label className="flex items-center gap-3 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="h-4 w-4 accent-[#380712]"
                />
                Product is active and visible in the store
              </label>

              <label className="flex items-center gap-3 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => updateField("isFeatured", e.target.checked)}
                  className="h-4 w-4 accent-[#380712]"
                />
                Mark as a featured product
              </label>
            </div>
          </section>

          <div className="flex flex-col-reverse justify-end gap-3 sm:flex-row">
            <Link
              href="/admin/products"
              className="rounded-xl border border-[#E5D8C8] px-6 py-3 text-center text-sm font-semibold text-[#6F451F] hover:bg-white"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={saving || loadingCategories || categories.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#380712] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#5A1020] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  Saving product...
                </>
              ) : (
                "Save product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
