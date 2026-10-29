
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";
import ProductDetails from "@/components/products/ProductDetails";

type PageProps = {
  params: Promise<{ slug: string }>;
};

async function getProduct(slug: string) {
  await connectToDatabase();

  const product = await Product.findOne({
    slug,
    isActive: true,
  })
    .populate("category", "name slug")
    .lean();

  if (!product) return null;

  // Convert MongoDB values into plain, serializable data for the client.
  return JSON.parse(JSON.stringify(product));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  return {
    title: product.name,
    description:
      product.shortDescription ||
      product.description ||
      `Discover ${product.name} at Mydhili Collections.`,
    openGraph: {
      title: product.name,
      description:
        product.shortDescription ||
        product.description ||
        `Discover ${product.name} at Mydhili Collections.`,
      images: product.images?.length ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      <ProductDetails product={product} />
    </div>
  );
}
