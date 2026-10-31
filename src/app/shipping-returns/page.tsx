import type { Metadata } from "next";
import ShippingReturnsFAQ from "@/components/home/ShippingReturnsFAQ";

export const metadata: Metadata = {
  title: "Shipping & Returns Policy | Mydhili Boutique",
  description:
    "Learn about our dispatch timelines, domestic and international shipping, and return policies at Mydhili Collections.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] py-8">
      <ShippingReturnsFAQ />
    </div>
  );
}
