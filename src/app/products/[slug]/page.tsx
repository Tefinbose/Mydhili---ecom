
import { connection } from "next/server";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ShoppingBag, ShieldCheck, Truck } from "lucide-react";

import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export const instant = false;

interface ProductVariant {
  sku?: string;
  size?: string;
  color?: string;
  stock?: number;
}

interface ProductData {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  shortDescription?: string;
  category?: string;
  price: number;
  compareAtPrice?: number;
  images?: string[];
  variants?: ProductVariant[];
  isFeatured?: boolean;
  isActive?: boolean;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

function formatCategory(category?: string) {
  if (!category) return "Boutique Collection";

  return category
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function getProduct(slug: string): Promise<ProductData | null> {
  await connectToDatabase();

  const product = await Product.findOne({
    slug,
    isActive: true,
  }).lean();

  if (!product) return null;

  return JSON.parse(JSON.stringify(product)) as ProductData;
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await connection();

  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  const images = product.images?.filter(Boolean) ?? [];
  const imageUrl = images[0];
  const variants = product.variants ?? [];

  const sizes = [
    ...new Set(
      variants
        .map((variant) => variant.size)
        .filter((size): size is string => Boolean(size))
    ),
  ];

  const colors = [
    ...new Set(
      variants
        .map((variant) => variant.color)
        .filter((color): color is string => Boolean(color))
    ),
  ];

  const inStock = variants.length
    ? variants.some((variant) => (variant.stock ?? 0) > 0)
    : true;

  const discount =
    product.compareAtPrice && product.compareAtPrice > product.price
      ? Math.round(
          ((product.compareAtPrice - product.price) /
            product.compareAtPrice) *
            100
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#380712]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/shop"
          className="mb-8 inline-flex items-center gap-2 text-sm text-neutral-600 transition hover:text-[#9A6B35]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to collection
        </Link>

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Product image */}
          <section>
            <div className="relative flex aspect-[4/5] items-center justify-center overflow-hidden bg-[#F0E9DF]">
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={product.name}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex flex-col items-center gap-4 px-8 text-center">
                  <ShoppingBag className="h-16 w-16 text-[#9A6B35]/50" />
                  <p className="font-serif text-2xl text-[#9A6B35]">
                    Mydhili Collections
                  </p>
                  <p className="text-sm text-neutral-500">
                    Product image coming soon
                  </p>
                </div>
              )}

              {product.isFeatured && (
                <span className="absolute left-4 top-4 bg-[#380712] px-4 py-2 text-xs uppercase tracking-[0.2em] text-white">
                  Featured
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-3">
                {images.slice(1, 5).map((image, index) => (
                  <div
                    key={`${image}-${index}`}
                    className="relative aspect-[3/4] overflow-hidden bg-[#F0E9DF]"
                  >
                    <Image
                      src={image}
                      alt={`${product.name} - view ${index + 2}`}
                      fill
                      sizes="(max-width: 1024px) 25vw, 12vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Product information */}
          <section className="flex flex-col py-2 lg:py-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#9A6B35]">
              {formatCategory(product.category)}
            </p>

            <h1 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
              {product.name}
            </h1>

            {product.shortDescription && (
              <p className="mt-5 text-base leading-7 text-neutral-600">
                {product.shortDescription}
              </p>
            )}

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="text-2xl font-medium">
                {formatPrice(product.price)}
              </span>

              {product.compareAtPrice &&
                product.compareAtPrice > product.price && (
                  <>
                    <span className="text-base text-neutral-400 line-through">
                      {formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="bg-[#E9DCC5] px-3 py-1 text-xs font-semibold text-[#380712]">
                      {discount}% OFF
                    </span>
                  </>
                )}
            </div>

            <div className="my-8 h-px bg-[#E5DCD0]" />

            {product.description && (
              <div>
                <h2 className="font-serif text-xl">Product details</h2>
                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-neutral-600">
                  {product.description}
                </p>
              </div>
            )}

            {sizes.length > 0 && (
              <div className="mt-8">
                <h2 className="text-sm font-semibold">Available sizes</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <span
                      key={size}
                      className="border border-[#D8C9B7] bg-white px-4 py-2 text-sm"
                    >
                      {size}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {colors.length > 0 && (
              <div className="mt-6">
                <h2 className="text-sm font-semibold">Available colours</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <span
                      key={color}
                      className="border border-[#D8C9B7] bg-white px-4 py-2 text-sm"
                    >
                      {color}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8">
              {inStock ? (
                <p className="flex items-center gap-2 text-sm text-green-700">
                  <span className="h-2 w-2 rounded-full bg-green-600" />
                  Available for purchase
                </p>
              ) : (
                <p className="text-sm text-red-700">
                  Currently out of stock
                </p>
              )}
            </div>

            <Link
              href="/shop"
              className="mt-5 flex min-h-14 items-center justify-center gap-3 bg-[#380712] px-6 py-4 text-sm font-medium uppercase tracking-[0.15em] text-white transition hover:bg-[#520D1D]"
            >
              <ShoppingBag className="h-5 w-5" />
              Explore more products
            </Link>

            <div className="mt-8 grid gap-4 border-t border-[#E5DCD0] pt-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <Truck className="mt-1 h-5 w-5 shrink-0 text-[#9A6B35]" />
                <div>
                  <p className="text-sm font-medium">Delivery information</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Delivery availability and charges are confirmed at checkout.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 h-5 w-5 shrink-0 text-[#9A6B35]" />
                <div>
                  <p className="text-sm font-medium">Shopping with confidence</p>
                  <p className="mt-1 text-xs leading-5 text-neutral-500">
                    Please review our shipping and returns policy before ordering.
                  </p>
                </div>
              </div>
            </div>

            <Link
              href="/shipping-returns"
              className="mt-5 text-sm text-[#9A6B35] underline underline-offset-4 hover:text-[#380712]"
            >
              View shipping and returns policy
            </Link>
          </section>
        </div>
      </div>
    </main>
  );
}
