export interface StoreCategory {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
}

export const DEFAULT_CATEGORIES: StoreCategory[] = [
  {
    id: "sarees",
    _id: "sarees",
    name: "Sarees",
    slug: "sarees",
    description: "Timeless sarees for celebrations, weddings, and traditional occasions.",
    image: "/categories/saree.jpg",
    isActive: true,
  },
  {
    id: "kurtis",
    _id: "kurtis",
    name: "Kurtis",
    slug: "kurtis",
    description: "Elegant and comfortable kurtis for everyday wear and festive gatherings.",
    image: "/categories/kurtis.avif",
    isActive: true,
  },
  {
    id: "ethnic-wear",
    _id: "ethnic-wear",
    name: "Ethnic Wear",
    slug: "ethnic-wear",
    description: "Beautiful ethnic outfits crafted with a luxurious contemporary touch.",
    image: "/categories/ethnicwear.jpg",
    isActive: true,
  },
  {
    id: "dresses",
    _id: "dresses",
    name: "Dresses",
    slug: "dresses",
    description: "Modern, flowy boutique dresses tailored for every memorable moment.",
    image: "/categories/dresses.jpg",
    isActive: true,
  },
  {
    id: "blouses",
    _id: "blouses",
    name: "Blouses",
    slug: "blouses",
    description: "Artisan-tailored designer blouses to perfectly complement your saree.",
    image: "/categories/blouse.webp",
    isActive: true,
  },
  {
    id: "accessories",
    _id: "accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Exquisite hand-finished accessories and clutches to complete your ensemble.",
    image: "/categories/accessories.jpg",
    isActive: true,
  },
  {
    id: "lehengas",
    _id: "lehengas",
    name: "Lehengas",
    slug: "lehengas",
    description: "Majestic bridal and festive lehengas with intricate zari and embroidery.",
    image: "/categories/lehenga.jpg",
    isActive: true,
  },
  {
    id: "salwar-suits",
    _id: "salwar-suits",
    name: "Salwar Suits",
    slug: "salwar-suits",
    description: "Graceful salwar suits and anarkalis designed for graceful silhouettes.",
    image: "/categories/salvarsuits.jpg",
    isActive: true,
  },
];

export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  lehenga: "lehengas",
  lehengas: "lehengas",
  saree: "sarees",
  sarees: "sarees",
  kurti: "kurtis",
  kurtis: "kurtis",
  dress: "dresses",
  dresses: "dresses",
  blouse: "blouses",
  blouses: "blouses",
  accessory: "accessories",
  accessories: "accessories",
  ethnicwear: "ethnic-wear",
  "ethnic-wear": "ethnic-wear",
  salwarsuit: "salwar-suits",
  salwarsuits: "salwar-suits",
  "salwar-suit": "salwar-suits",
  "salwar-suits": "salwar-suits",
  "salvar-suits": "salwar-suits",
  "salvar-suit": "salwar-suits",
};

export function normalizeCategorySlug(slug?: string | null): string {
  if (!slug) return "";
  const cleaned = slug.toLowerCase().trim();
  return CATEGORY_SLUG_ALIASES[cleaned] || cleaned;
}
