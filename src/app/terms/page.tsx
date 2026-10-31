import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms & Conditions | Mydhili Boutique",
  description: "Terms and conditions of service at Mydhili Collections.",
};

export default function TermsPage() {
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
              <FileText size={16} />
              <span>Customer Agreement</span>
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-[#380712]">
              Terms &amp; Conditions
            </h1>
            <p className="text-xs text-stone-500 mt-1">
              Last updated: October 2026
            </p>
          </div>

          <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif text-lg font-bold text-[#380712]">
              1. Boutique Orders &amp; Availability
            </h2>
            <p>
              All orders placed through Mydhili Boutique are subject to product availability and confirmation. In the rare event an item is out of stock after order placement, our team will promptly contact you for an exchange or full refund.
            </p>
          </section>

          <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif text-lg font-bold text-[#380712]">
              2. Handcrafted &amp; Artisanal Variations
            </h2>
            <p>
              Many of our sarees and ethnic garments feature authentic handloom weaving, embroidery, and dyeing. Minor variations in texture, weave, and color shade are natural hallmarks of handcrafted elegance and should not be treated as defects.
            </p>
          </section>

          <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif text-lg font-bold text-[#380712]">
              3. Pricing &amp; Taxes
            </h2>
            <p>
              Prices listed on the website are in Indian Rupees (INR) and include applicable taxes unless specified otherwise. Shipping charges, where applicable, are calculated transparently at checkout.
            </p>
          </section>

          <section className="space-y-3 text-sm text-stone-700 leading-relaxed">
            <h2 className="font-serif text-lg font-bold text-[#380712]">
              4. Support &amp; Inquiries
            </h2>
            <p>
              For any questions regarding orders, sizing, or styling advice, please reach out through our{" "}
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
