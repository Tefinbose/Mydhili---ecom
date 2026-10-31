import type { Metadata } from "next";
import ShippingReturnsFAQ from "@/components/home/ShippingReturnsFAQ";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Mydhili Boutique",
  description:
    "Find answers about shipping, returns, fabric care, and order tracking at Mydhili Collections.",
};

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8">
      <ShippingReturnsFAQ />
    </div>
  );
}
