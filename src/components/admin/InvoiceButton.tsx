
"use client";

import Link from "next/link";

export default function InvoiceButton({
  orderId,
}: {
  orderId: string;
}) {
  return (
    <Link
      href={`/admin/orders/${orderId}/invoice`}
      className="inline-flex items-center justify-center rounded-lg border border-[#D4AF69] px-4 py-2 text-sm font-medium text-[#380712] transition hover:bg-[#FAF7F2]"
    >
      View Invoice
    </Link>
  );
}
