
import type { Metadata } from "next";
import "./globals.css";

import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import StorefrontLayout from "@/components/layout/StorefrontLayout";

export const metadata: Metadata = {
  title: {
    default: "Mydhili Collections | Elegant Fashion for Every Occasion",
    template: "%s | Mydhili Collections",
  },
  description:
    "Discover elegant sarees, kurtis, ethnic wear, dresses, blouses, and accessories at Mydhili Collections. Celebrate tradition with modern style.",
  keywords: [
    "Mydhili Collections",
    "Indian ethnic wear",
    "sarees",
    "kurtis",
    "women's fashion",
    "ethnic dresses",
    "Indian boutique",
  ],
  icons: {
    icon: "/logo/logo.png",
    shortcut: "/logo/logo.png",
    apple: "/logo/logo.png",
  },
  openGraph: {
    title: "Mydhili Collections",
    description:
      "Explore timeless ethnic wear and contemporary fashion for every occasion.",
    type: "website",
    locale: "en_IN",
    siteName: "Mydhili Collections",
    images: [
      {
        url: "/logo/logo.png",
        width: 759,
        height: 566,
        alt: "Mydhili Boutique Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FAF7F2] text-stone-900 antialiased">
        <CartProvider>
          <WishlistProvider>
           <StorefrontLayout>{children}</StorefrontLayout>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
