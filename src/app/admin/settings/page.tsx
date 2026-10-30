
"use client";

import { useEffect, useState } from "react";
import {
  Store,
  MapPin,
  Truck,
  CreditCard,
  Image as ImageIcon,
  Save,
  RefreshCw,
} from "lucide-react";

interface StoreSettings {
  storeName: string;
  tagline: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  logoUrl: string;
  shippingCharge: number;
  freeShippingThreshold: number;
  codEnabled: boolean;
  onlinePaymentEnabled: boolean;
}

const initialSettings: StoreSettings = {
  storeName: "Mydhili Boutique",
  tagline: "",
  email: "",
  phone: "",
  whatsapp: "",
  address: "",
  city: "",
  state: "",
  pincode: "",
  logoUrl: "",
  shippingCharge: 0,
  freeShippingThreshold: 0,
  codEnabled: true,
  onlinePaymentEnabled: true,
};

function SectionTitle({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6 flex items-start gap-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#FAF3E8] text-[#8B2635]">
        <Icon size={20} />
      </div>
      <div>
        <h2 className="font-serif text-lg font-bold text-[#380712]">{title}</h2>
        <p className="mt-0.5 text-xs text-stone-500">{description}</p>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[#380712]">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={type === "number" ? "0" : undefined}
        className="w-full rounded-xl border border-[#E9DFD2] bg-white px-4 py-3 text-sm text-[#380712] outline-none transition placeholder:text-stone-400 focus:border-[#9A6B35] focus:ring-2 focus:ring-[#D4AF69]/20"
      />
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] =
    useState<StoreSettings>(initialSettings);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch("/api/admin/settings", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load settings.");
        }

        setSettings({
          ...initialSettings,
          ...data.settings,
        });
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function updateField<K extends keyof StoreSettings>(
    field: K,
    value: StoreSettings[K]
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSave() {
    try {
      setSaving(true);
      setMessage("");
      setError("");

      if (!settings.storeName.trim()) {
        throw new Error("Please enter your boutique name.");
      }

      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save settings.");
      }

      setSettings({
        ...initialSettings,
        ...data.settings,
      });

      setMessage("Your boutique settings have been saved successfully.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while saving."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#FAF7F2]">
        <RefreshCw className="animate-spin text-[#380712]" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-px w-6 bg-[#A27B35]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
                Store Configuration
              </p>
            </div>
            <h1 className="mt-1 font-serif text-3xl font-bold tracking-tight text-[#380712] sm:text-4xl">
              Boutique Settings
            </h1>
            <p className="mt-1 text-xs text-stone-500 sm:text-sm">
              Manage your boutique identity, contact information, shipping rates, and payment options.
            </p>
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#380712] px-6 py-2.5 text-xs font-semibold text-[#F5DFC0] shadow-md transition hover:bg-[#520A1A] disabled:opacity-60"
          >
            <Save size={15} />
            {saving ? "Saving Changes..." : "Save Settings"}
          </button>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Boutique Information */}
          <section className="rounded-2xl border border-[#D4AF69]/30 bg-white p-6 shadow-sm sm:p-8">
            <SectionTitle
              icon={Store}
              title="Boutique Information"
              description="Your boutique's basic information and contact details."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Boutique Name"
                value={settings.storeName}
                onChange={(v) => updateField("storeName", v)}
                placeholder="Mydhili Boutique"
              />

              <Field
                label="Tagline"
                value={settings.tagline}
                onChange={(v) => updateField("tagline", v)}
                placeholder="Your boutique tagline"
              />

              <Field
                label="Email Address"
                type="email"
                value={settings.email}
                onChange={(v) => updateField("email", v)}
                placeholder="hello@example.com"
              />

              <Field
                label="Phone Number"
                value={settings.phone}
                onChange={(v) => updateField("phone", v)}
                placeholder="+91 XXXXX XXXXX"
              />

              <Field
                label="WhatsApp Number"
                value={settings.whatsapp}
                onChange={(v) => updateField("whatsapp", v)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </section>

          {/* Address */}
          <section className="rounded-2xl border border-[#D4AF69]/30 bg-white p-6 shadow-sm sm:p-8">
            <SectionTitle
              icon={MapPin}
              title="Boutique Address"
              description="Your official business and contact address."
            />

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Street Address
                </label>
                <textarea
                  value={settings.address}
                  onChange={(e) => updateField("address", e.target.value)}
                  rows={3}
                  placeholder="Enter your complete address"
                  className="w-full rounded-lg border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#9A6B35]"
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="City"
                  value={settings.city}
                  onChange={(v) => updateField("city", v)}
                  placeholder="City"
                />

                <Field
                  label="State"
                  value={settings.state}
                  onChange={(v) => updateField("state", v)}
                  placeholder="State"
                />

                <Field
                  label="PIN Code"
                  value={settings.pincode}
                  onChange={(v) => updateField("pincode", v)}
                  placeholder="PIN Code"
                />
              </div>
            </div>
          </section>

          {/* Logo */}
          <section className="rounded-2xl border border-[#D4AF69]/30 bg-white p-6 shadow-sm sm:p-8">
            <SectionTitle
              icon={ImageIcon}
              title="Boutique Logo"
              description="Add the image URL of your boutique logo."
            />

            <Field
              label="Logo Image URL"
              value={settings.logoUrl}
              onChange={(v) => updateField("logoUrl", v)}
              placeholder="/images/logo.png or an image URL"
            />

            {settings.logoUrl && (
              <div className="mt-5 rounded-xl border border-gray-100 bg-[#FAF7F2] p-5">
                <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Logo Preview
                </p>
                <img
                  src={settings.logoUrl}
                  alt="Boutique logo preview"
                  className="max-h-24 max-w-full object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}
          </section>

          {/* Shipping */}
          <section className="rounded-2xl border border-[#D4AF69]/30 bg-white p-6 shadow-sm sm:p-8">
            <SectionTitle
              icon={Truck}
              title="Shipping Settings"
              description="Configure delivery charges and free shipping."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Shipping Charge (₹)"
                type="number"
                value={settings.shippingCharge}
                onChange={(v) =>
                  updateField("shippingCharge", Number(v))
                }
                placeholder="0"
              />

              <Field
                label="Free Shipping Above (₹)"
                type="number"
                value={settings.freeShippingThreshold}
                onChange={(v) =>
                  updateField("freeShippingThreshold", Number(v))
                }
                placeholder="0"
              />
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-400">
              Set the free-shipping threshold to 0 if you do not want to
              configure a free-shipping limit.
            </p>
          </section>

          {/* Payments */}
          <section className="rounded-2xl border border-[#D4AF69]/30 bg-white p-6 shadow-sm sm:p-8">
            <SectionTitle
              icon={CreditCard}
              title="Payment Settings"
              description="Choose which payment methods customers can use."
            />

            <div className="space-y-4">
              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 transition hover:bg-[#FAF7F2]">
                <div>
                  <p className="font-medium text-[#380712]">
                    Cash on Delivery
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Allow customers to pay when their order is delivered.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.codEnabled}
                  onChange={(e) =>
                    updateField("codEnabled", e.target.checked)
                  }
                  className="h-5 w-5 accent-[#380712]"
                />
              </label>

              <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-gray-100 p-4 transition hover:bg-[#FAF7F2]">
                <div>
                  <p className="font-medium text-[#380712]">
                    Online Payment
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Allow customers to pay online using your payment gateway.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={settings.onlinePaymentEnabled}
                  onChange={(e) =>
                    updateField("onlinePaymentEnabled", e.target.checked)
                  }
                  className="h-5 w-5 accent-[#380712]"
                />
              </label>
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-400">
              These switches save your payment preferences. Your checkout
              must also read these settings before showing payment options.
              Online payment still requires a payment gateway integration.
            </p>
          </section>
        </div>

        {/* Bottom Save */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-[#380712] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#5A1724] disabled:opacity-60"
          >
            <Save size={17} />
            {saving ? "Saving..." : "Save All Settings"}
          </button>
        </div>
      </div>
    </div>
  );
}
