
"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Folder,
  Loader2,
  Pencil,
  Plus,
  Search,
  X,
  Image as ImageIcon,
} from "lucide-react";

type Category = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
};

const emptyForm = {
  name: "",
  description: "",
  image: "",
  isActive: true,
};

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/categories", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load categories.");
      }

      setCategories(data.categories || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load categories."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(category: Category) {
    setEditingId(category._id);
    setForm({
      name: category.name,
      description: category.description || "",
      image: category.image || "",
      isActive: category.isActive,
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
    setError("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Please enter a category name.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch("/api/admin/categories", {
        method: editingId ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...(editingId ? { id: editingId } : {}),
          name: form.name,
          description: form.description,
          image: form.image,
          isActive: form.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save category.");
      }

      setSuccess(data.message || "Category saved successfully.");
      await loadCategories();
      setShowForm(false);
      setEditingId(null);
      setForm(emptyForm);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to save category."
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleStatus(category: Category) {
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/admin/categories", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: category._id,
          isActive: !category.isActive,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update category status.");
      }

      setSuccess(
        `${category.name} ${
          !category.isActive ? "activated" : "deactivated"
        } successfully.`
      );

      await loadCategories();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update status."
      );
    }
  }

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = categories.filter((category) => category.isActive).length;
  const inactiveCount = categories.length - activeCount;

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/admin"
          className="mb-6 inline-flex items-center gap-2 text-sm text-stone-500 transition hover:text-[#380712]"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>

        <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
              Store Management
            </p>
            <h1 className="mt-2 font-serif text-3xl text-[#380712] sm:text-4xl">
              Categories
            </h1>
            <p className="mt-2 text-sm text-stone-500">
              Organise your boutique products into collections.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#380712] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#54101f]"
          >
            <Plus size={17} />
            Add Category
          </button>
        </div>

        {error && !showForm && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && !showForm && (
          <div className="mb-5 rounded-lg border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {success}
          </div>
        )}

        <div className="mb-7 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Total Categories</p>
            <p className="mt-2 text-3xl font-semibold text-[#380712]">
              {categories.length}
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Active Categories</p>
            <p className="mt-2 text-3xl font-semibold text-green-700">
              {activeCount}
            </p>
          </div>

          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <p className="text-sm text-stone-500">Inactive Categories</p>
            <p className="mt-2 text-3xl font-semibold text-stone-500">
              {inactiveCount}
            </p>
          </div>
        </div>

        <div className="mb-5 flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3">
          <Search size={18} className="text-stone-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>

        {loading ? (
          <div className="flex min-h-48 items-center justify-center">
            <Loader2 className="animate-spin text-[#9A6B35]" size={30} />
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-16 text-center">
            <Folder className="mx-auto text-stone-300" size={40} />
            <h3 className="mt-4 font-serif text-xl text-[#380712]">
              No categories found
            </h3>
            <p className="mt-2 text-sm text-stone-500">
              Add your first category to organise your products.
            </p>
            <button
              onClick={openAddForm}
              className="mt-5 rounded-lg bg-[#380712] px-5 py-3 text-sm text-white"
            >
              Add Category
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[750px] text-left text-sm">
                <thead className="bg-[#F7F2EA] text-xs uppercase tracking-wider text-stone-500">
                  <tr>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Slug</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-stone-100">
                  {filteredCategories.map((category) => (
                    <tr key={category._id} className="hover:bg-[#FAF7F2]/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#F7F2EA]">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="text-[#9A6B35]" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-[#380712]">
                              {category.name}
                            </p>
                            <p className="mt-1 max-w-xs truncate text-xs text-stone-400">
                              {category.description || "No description"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-stone-500">
                        {category.slug}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            category.isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-stone-100 text-stone-500"
                          }`}
                        >
                          {category.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditForm(category)}
                            className="inline-flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-xs font-medium text-[#380712] hover:bg-[#FAF7F2]"
                          >
                            <Pencil size={14} />
                            Edit
                          </button>

                          <button
                            onClick={() => toggleStatus(category)}
                            className={`rounded-lg px-3 py-2 text-xs font-medium ${
                              category.isActive
                                ? "bg-red-50 text-red-600 hover:bg-red-100"
                                : "bg-green-50 text-green-700 hover:bg-green-100"
                            }`}
                          >
                            {category.isActive ? "Deactivate" : "Activate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
            <div className="my-8 w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
              <div className="mb-6 flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9A6B35]">
                    Category Management
                  </p>
                  <h2 className="mt-2 font-serif text-2xl text-[#380712]">
                    {editingId ? "Edit Category" : "Add Category"}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-full p-2 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
                >
                  <X size={20} />
                </button>
              </div>

              {error && (
                <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Category Name *
                  </label>
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="Example: Sarees"
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-[#9A6B35]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    placeholder="Write a short category description..."
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-[#9A6B35]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    Category Image URL
                  </label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) =>
                      setForm({ ...form, image: e.target.value })
                    }
                    placeholder="https://example.com/category-image.jpg"
                    className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-[#9A6B35]"
                  />
                </div>

                <label className="flex items-center gap-3 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.isActive}
                    onChange={(e) =>
                      setForm({ ...form, isActive: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#380712]"
                  />
                  Category is active
                </label>

                <div className="flex justify-end gap-3 border-t border-stone-100 pt-5">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="rounded-lg border border-stone-300 px-5 py-3 text-sm text-stone-600 hover:bg-stone-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#380712] px-5 py-3 text-sm font-medium text-white hover:bg-[#54101f] disabled:opacity-60"
                  >
                    {saving && (
                      <Loader2 size={16} className="animate-spin" />
                    )}
                    {saving
                      ? "Saving..."
                      : editingId
                        ? "Save Changes"
                        : "Create Category"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
