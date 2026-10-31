import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | Mydhili Boutique",
  description: "Privacy policy and data handling practices at Mydhili Collections.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#380712] py-12 px-4 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#9A6B35] hover:text-[#380712] mb-6 transition"
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <div className="rounded-2xl border border-[#E7DECE] bg-white p-8 sm:p-12 shadow-sm space-y-8">
          <div className="border-b border-stone-100 pb-6">
            <div className="flex items-center gap-2 text-[#9A6B35] text-xs font-semibold uppercase tracking-widest mb-2">
              <ShieldCheck size={16} />
              <span>Security & Confidentiality</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#380712]">
              Privacy Policy
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Last updated: October 2026
            </p>
          </div>

          <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif text-lg font-bold text-[#380712]">
              1. Information We Collect
            </h2>
            <p>
              When you purchase or browse products at Mydhili Collections, we collect personal information you provide such as your name, delivery address, email address, phone number, and payment preferences necessary to fulfill your orders.
            </p>
          </section>

          <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif text-lg font-bold text-[#380712]">
              2. How We Use Your Information
            </h2>
            <p>
              We use your information exclusively to process orders, arrange courier deliveries, send status updates and tracking details, and provide personalized boutique customer support. We never sell or share your personal data with unauthorized third parties.
            </p>
          </section>

          <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif text-lg font-bold text-[#380712]">
              3. Payment Security
            </h2>
            <p>
              All online payment transactions are processed through encrypted, certified payment gateways (such as Razorpay). We never store your full credit card, debit card, or UPI credentials on our servers.
            </p>
          </section>

          <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif text-lg font-bold text-[#380712]">
              4. Contact Us
            </h2>
            <p>
              If you have any questions regarding your personal information, please visit our{" "}
              <Link href="/contact" className="text-[#9A6B35] font-semibold underline underline-offset-2">
                Contact Page
              </Link>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
