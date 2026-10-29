
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
  sku?: string;
};

type CheckoutFormData = {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
};

const initialForm: CheckoutFormData = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  notes: "",
};

export default function CheckoutForm() {
  const router = useRouter();

  const [form, setForm] = useState<CheckoutFormData>(initialForm);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "razorpay">("cod");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cartReady, setCartReady] = useState(false);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("mydhili-cart");
      const parsedCart = savedCart ? JSON.parse(savedCart) : [];

      setCart(Array.isArray(parsedCart) ? parsedCart : []);
    } catch {
      setCart([]);
    } finally {
      setCartReady(true);
    }
  }, []);

  const subtotal = cart.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  function updateField(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!cart.length) {
      setError("Your cart is empty. Please add products before checkout.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer: {
            fullName: form.fullName,
            email: form.email,
            phone: form.phone,
          },
          shippingAddress: {
            address: form.address,
            landmark: form.landmark,
            city: form.city,
            state: form.state,
            pincode: form.pincode,
            notes: form.notes,
          },
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            sku: item.sku ?? "",
            size: item.size ?? "",
            color: item.color ?? "",
          })),
          paymentMethod,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success || !result.order) {
        throw new Error(result.message || "Unable to place your order.");
      }

      // Save the order details for the confirmation page.
      sessionStorage.setItem(
        "mydhili-last-order",
        JSON.stringify(result.order)
      );

      // Clear the cart only after the server creates the order.
      localStorage.removeItem("mydhili-cart");
      window.dispatchEvent(new Event("mydhili-cart-updated"));

      if (paymentMethod === "razorpay") {
        router.push(
          `/order-success?orderNumber=${encodeURIComponent(
            result.order.orderNumber
          )}&payment=pending`
        );
      } else {
        router.push(
          `/order-success?orderNumber=${encodeURIComponent(
            result.order.orderNumber
          )}`
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (!cartReady) {
    return <p className="py-12 text-center">Loading checkout...</p>;
  }

  if (!cart.length) {
    return (
      <div className="rounded-2xl border border-[#eadfdc] bg-white p-8 text-center">
        <h2 className="text-xl font-semibold text-[#380712]">
          Your cart is empty
        </h2>
        <p className="mt-2 text-sm text-gray-600">
          Add something beautiful to your cart before checking out.
        </p>
        <button
          type="button"
          onClick={() => router.push("/shop")}
          className="mt-6 rounded-full bg-[#380712] px-6 py-3 text-sm font-semibold text-white"
        >
          Continue shopping
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
      <div className="space-y-8">
        <section className="rounded-2xl border border-[#eadfdc] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[#380712]">
            Contact information
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <Field
              label="Full name"
              name="fullName"
              value={form.fullName}
              onChange={updateField}
              required
            />
            <Field
              label="Phone number"
              name="phone"
              value={form.phone}
              onChange={updateField}
              required
              type="tel"
            />
            <div className="sm:col-span-2">
              <Field
                label="Email address"
                name="email"
                value={form.email}
                onChange={updateField}
                type="email"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#eadfdc] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[#380712]">
            Delivery address
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field
                label="House number, street and address"
                name="address"
                value={form.address}
                onChange={updateField}
                required
              />
            </div>
            <div className="sm:col-span-2">
              <Field
                label="Landmark (optional)"
                name="landmark"
                value={form.landmark}
                onChange={updateField}
              />
            </div>
            <Field
              label="City"
              name="city"
              value={form.city}
              onChange={updateField}
              required
            />
            <Field
              label="State"
              name="state"
              value={form.state}
              onChange={updateField}
              required
            />
            <Field
              label="PIN code"
              name="pincode"
              value={form.pincode}
              onChange={updateField}
              required
            />
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Order notes (optional)
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={updateField}
                  rows={3}
                  maxLength={500}
                  className="mt-2 w-full rounded-xl border border-[#e6d9d5] px-4 py-3 outline-none focus:border-[#9a6b35]"
                  placeholder="Any delivery instructions?"
                />
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-[#eadfdc] bg-white p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-[#380712]">
            Payment method
          </h2>

          <div className="mt-5 space-y-3">
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#eadfdc] p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="cod"
                checked={paymentMethod === "cod"}
                onChange={() => setPaymentMethod("cod")}
                className="mt-1 accent-[#380712]"
              />
              <span>
                <span className="block font-medium text-[#380712]">
                  Cash on Delivery
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  Pay when your order arrives.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#eadfdc] p-4">
              <input
                type="radio"
                name="paymentMethod"
                value="razorpay"
                checked={paymentMethod === "razorpay"}
                onChange={() => setPaymentMethod("razorpay")}
                className="mt-1 accent-[#380712]"
              />
              <span>
                <span className="block font-medium text-[#380712]">
                  Online Payment
                </span>
                <span className="mt-1 block text-sm text-gray-500">
                  Razorpay integration will be connected in the next step.
                </span>
              </span>
            </label>
          </div>
        </section>
      </div>

      <aside className="h-fit rounded-2xl border border-[#eadfdc] bg-white p-6 sm:p-8 lg:sticky lg:top-24">
        <h2 className="text-xl font-semibold text-[#380712]">
          Order summary
        </h2>

        <div className="mt-6 space-y-4">
          {cart.map((item, index) => (
            <div
              key={`${item.productId}-${item.sku || item.size || ""}-${index}`}
              className="flex justify-between gap-4 text-sm"
            >
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="mt-1 text-gray-500">
                  Qty: {item.quantity}
                  {item.size ? ` · Size: ${item.size}` : ""}
                  {item.color ? ` · ${item.color}` : ""}
                </p>
              </div>
              <p className="whitespace-nowrap font-medium">
                ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3 border-t border-[#eadfdc] pt-5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Shipping</span>
            <span>Calculated later</span>
          </div>
          <div className="flex justify-between border-t border-[#eadfdc] pt-4 text-base font-semibold text-[#380712]">
            <span>Order total</span>
            <span>₹{subtotal.toLocaleString("en-IN")}</span>
          </div>
          <p className="text-xs leading-5 text-gray-500">
            Final shipping charges, if applicable, are not included in this estimate.
          </p>
        </div>

        {error && (
          <p
            role="alert"
            className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700"
          >
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-full bg-[#380712] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#541321] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Processing..."
            : paymentMethod === "cod"
              ? "Place order"
              : "Continue to online payment"}
        </button>

        <p className="mt-4 text-center text-xs text-gray-500">
          Your order details will be processed securely.
        </p>
      </aside>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  required?: boolean;
  type?: string;
};

function Field({
  label,
  name,
  value,
  onChange,
  required = false,
  type = "text",
}: FieldProps) {
  return (
    <label className="block text-sm font-medium text-gray-700">
      {label}
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={300}
        autoComplete="on"
        className="mt-2 w-full rounded-xl border border-[#e6d9d5] px-4 py-3 outline-none focus:border-[#9a6b35]"
      />
    </label>
  );
}
