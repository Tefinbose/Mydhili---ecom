
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Plus,
  Save,
  Trash2,
  ImagePlus,
} from "lucide-react";
import ImageUpload from "@/components/admin/ImageUpload";

type Variant = {
  sku: string;
  size: string;
  color: string;
  stock: number;
};

type Category = {
  _id: string;
  name: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  shortDescription?: string;
  category: string | { _id: string; name: string };
  price: number;
  compareAtPrice?: number;
  images: string[];
  variants: Variant[];
  isFeatured: boolean;
  isActive: boolean;
};

const emptyVariant: Variant = {
  sku: "",
  size: "",
  color: "",
  stock: 0,
};

export default function EditProductPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const productId = params.id;

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    shortDescription: "",
    category: "",
    price: "",
    compareAtPrice: "",
    images: "",
    variants: [{ ...emptyVariant }],
    isFeatured: false,
    isActive: true,
  });

  useEffect(() => {
    if (productId) loadProduct();
  }, [productId]);

  async function loadProduct() {
    try {
      setLoading(true);
      setError("");

      const [productResponse, categoriesResponse] = await Promise.all([
        fetch(`/api/admin/products/${productId}`, { cache: "no-store" }),
        fetch("/api/admin/categories", { cache: "no-store" }),
      ]);

      const productData = await productResponse.json();
      const categoriesData = await categoriesResponse.json();

      if (!productResponse.ok || !productData.success || !productData.product) {
        throw new Error(productData.message || "Unable to load product.");
      }

      const product: Product = productData.product;

      const categoryId =
        typeof product.category === "string"
          ? product.category
          : product.category?._id || "";

      setForm({
        name: product.name || "",
        description: product.description || "",
        shortDescription: product.shortDescription || "",
        category: categoryId,
        price: String(product.price ?? ""),
        compareAtPrice:
          product.compareAtPrice != null
            ? String(product.compareAtPrice)
            : "",
        images: (product.images || []).join("\n"),
        variants:
          product.variants?.length > 0
            ? product.variants.map((variant) => ({
                sku: variant.sku || "",
                size: variant.size || "",
                color: variant.color || "",
                stock: Number(variant.stock || 0),
              }))
            : [{ ...emptyVariant }],
        isFeatured: Boolean(product.isFeatured),
        isActive: product.isActive !== false,
      });

      setImages(product.images || []);

      if (categoriesResponse.ok && categoriesData.success) {
        setCategories(categoriesData.categories || []);
      } else {
        throw new Error(
          categoriesData.message || "Unable to load product categories."
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateVariant(
    index: number,
    field: keyof Variant,
    value: string | number
  ) {
    setForm((current) => ({
      ...current,
      variants: current.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
  }

  function addVariant() {
    setForm((current) => ({
      ...current,
      variants: [...current.variants, { ...emptyVariant }],
    }));
  }

  function removeVariant(index: number) {
    setForm((current) => ({
      ...current,
      variants: current.variants.filter((_, i) => i !== index),
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim() || !form.category || !form.price) {
      setError("Please complete the product name, category and price.");
      return;
    }

    const variants = form.variants
      .filter(
        (variant) =>
          variant.sku.trim() ||
          variant.size.trim() ||
          variant.color.trim()
      );

    const incompleteVariant = variants.some(
      (variant) =>
        !variant.sku.trim() ||
        !variant.size.trim() ||
        !variant.color.trim() ||
        !Number.isFinite(Number(variant.stock)) ||
        Number(variant.stock) < 0
    );

    if (incompleteVariant) {
      setError("Complete the SKU, size, color and valid stock for each variant.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          description: form.description,
          shortDescription: form.shortDescription,
          category: form.category,
          price: Number(form.price),
          compareAtPrice: form.compareAtPrice
            ? Number(form.compareAtPrice)
            : undefined,
          images: images.filter(Boolean),
          variants: variants.map((variant) => ({
            ...variant,
            stock: Number(variant.stock),
          })),
          isFeatured: form.isFeatured,
          isActive: form.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update product.");
      }

      setSuccess("Product updated successfully.");

      setTimeout(() => {
        router.push("/admin/products");
        router.refresh();
      }, 800);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#9A6B35]" size={30} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/admin/products"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-600 hover:text-[#380712]"
        >
          <ArrowLeft size={17} />
          Back to Products
        </Link>

        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
            Product Management
          </p>
          <h1 className="mt-2 text-3xl font-serif text-[#380712]">
            Edit Product
          </h1>
          <p className="mt-2 text-sm text-stone-500">
            Update your product information, images and inventory.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-[#380712]">
              Basic Information
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Product Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-[#9A6B35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Short Description
                </label>
                <input
                  value={form.shortDescription}
                  onChange={(e) =>
                    updateField("shortDescription", e.target.value)
                  }
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-[#9A6B35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Full Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-[#9A6B35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Category *
                </label>
                <select
                  required
                  value={form.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 bg-white px-4 py-3 outline-none focus:border-[#9A6B35]"
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

          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-[#380712]">
              Pricing
            </h2>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Selling Price (₹) *
                </label>
                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => updateField("price", e.target.value)}
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-[#9A6B35]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Compare-at Price (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.compareAtPrice}
                  onChange={(e) =>
                    updateField("compareAtPrice", e.target.value)
                  }
                  className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-[#9A6B35]"
                />
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-[#EDE4D9] bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="font-serif text-xl font-bold text-[#380712]">
                  Gallery Images
                </h2>
                <p className="mt-0.5 text-xs text-stone-500">
                  Upload images from your computer or paste image links. First image becomes the primary cover.
                </p>
              </div>
              <ImagePlus size={22} className="text-[#9A6B35]" />
            </div>

            <ImageUpload
              multiple
              value={images}
              onChange={(newImages) => setImages(newImages as string[])}
              label="Product Photography"
              helperText="Upload angles, close-ups, and fabric texture shots directly from your device."
            />
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-[#380712]">
                  Product Variants
                </h2>
                <p className="mt-1 text-sm text-stone-500">
                  Manage SKU, size, color and available stock.
                </p>
              </div>
              <button
                type="button"
                onClick={addVariant}
                className="inline-flex items-center gap-2 rounded-lg border border-[#9A6B35] px-4 py-2 text-sm font-medium text-[#9A6B35] hover:bg-[#FAF7F2]"
              >
                <Plus size={16} />
                Add Variant
              </button>
            </div>

            <div className="space-y-4">
              {form.variants.map((variant, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-lg border border-stone-200 p-4 sm:grid-cols-2 lg:grid-cols-5"
                >
                  <input
                    value={variant.sku}
                    onChange={(e) =>
                      updateVariant(index, "sku", e.target.value)
                    }
                    placeholder="SKU"
                    className="rounded-lg border border-stone-300 px-3 py-2"
                  />
                  <input
                    value={variant.size}
                    onChange={(e) =>
                      updateVariant(index, "size", e.target.value)
                    }
                    placeholder="Size"
                    className="rounded-lg border border-stone-300 px-3 py-2"
                  />
                  <input
                    value={variant.color}
                    onChange={(e) =>
                      updateVariant(index, "color", e.target.value)
                    }
                    placeholder="Color"
                    className="rounded-lg border border-stone-300 px-3 py-2"
                  />
                  <input
                    type="number"
                    min="0"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(index, "stock", Number(e.target.value))
                    }
                    placeholder="Stock"
                    className="rounded-lg border border-stone-300 px-3 py-2"
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={15} />
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-lg font-semibold text-[#380712]">
              Store Settings
            </h2>

            <div className="space-y-4">
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) =>
                    updateField("isFeatured", e.target.checked)
                  }
                  className="h-4 w-4 accent-[#380712]"
                />
                Show this product as featured
              </label>

              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => updateField("isActive", e.target.checked)}
                  className="h-4 w-4 accent-[#380712]"
                />
                Product is active in the store
              </label>
            </div>
          </section>

          <div className="flex flex-wrap justify-end gap-3 pb-8">
            <Link
              href="/admin/products"
              className="rounded-lg border border-stone-300 px-5 py-3 text-sm font-medium text-stone-700 hover:bg-white"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#380712] px-6 py-3 text-sm font-medium text-white hover:bg-[#54101f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
