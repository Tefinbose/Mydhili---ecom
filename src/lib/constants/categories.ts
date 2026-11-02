export interface StoreCategory {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  isActive: boolean;
  department?: "gents" | "ladies" | "kids" | "accessories";
}

export interface CategoryGroup {
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: { name: string; slug: string }[];
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    name: "Gents",
    slug: "gents",
    description: "Premium shirts, T-shirts, pants, track suits, lungis, and traditional mundu.",
    image: "/categories/gents.jpg",
    subcategories: [
      { name: "Shirts", slug: "shirts" },
      { name: "T Shirts", slug: "t-shirts" },
      { name: "Pants", slug: "gents-pants" },
      { name: "Track Suit", slug: "track-suit" },
      { name: "Three Forth", slug: "three-forth" },
      { name: "Shorts", slug: "shorts" },
      { name: "Lungi", slug: "lungi" },
      { name: "Mundu", slug: "mundu" },
    ],
  },
  {
    name: "Ladies",
    slug: "ladies",
    description: "Readymade churidars, kurthies, cot sets, designer sarees, blouses, and night wears.",
    image: "/categories/saree.jpg",
    subcategories: [
      { name: "Readymade Churidars", slug: "readymade-churidars" },
      { name: "Kurthies", slug: "kurtis" },
      { name: "Cot Set", slug: "cot-set" },
      { name: "Pants", slug: "ladies-pants" },
      { name: "Sarees", slug: "sarees" },
      { name: "Blouse", slug: "blouses" },
      { name: "Night Wears", slug: "night-wears" },
    ],
  },
  {
    name: "Kids",
    slug: "kids",
    description: "Joyful celebratory and everyday boutique clothing for boys & girls.",
    image: "/categories/kids.jpg",
    subcategories: [
      { name: "Boys & Girls", slug: "boys-girls" },
    ],
  },
  {
    name: "Accessories",
    slug: "accessories",
    description: "Belts, socks, caps, baby shoes, and designer perfumes.",
    image: "/categories/accessories.jpg",
    subcategories: [
      { name: "Belt", slug: "belts" },
      { name: "Socks", slug: "socks" },
      { name: "Cap", slug: "caps" },
      { name: "Baby Shoes", slug: "baby-shoes" },
      { name: "Perfume", slug: "perfumes" },
    ],
  },
];

export const DEFAULT_CATEGORIES: StoreCategory[] = [
  // Primary Departments
  {
    id: "gents",
    _id: "gents",
    name: "Gents",
    slug: "gents",
    description: "Premium shirts, T-shirts, pants, track suits, lungis, and traditional mundu.",
    image: "/categories/gents.jpg",
    isActive: true,
    department: "gents",
  },
  {
    id: "ladies",
    _id: "ladies",
    name: "Ladies",
    slug: "ladies",
    description: "Readymade churidars, kurthies, cot sets, sarees, blouses, and night wears.",
    image: "/categories/saree.jpg",
    isActive: true,
    department: "ladies",
  },
  {
    id: "kids",
    _id: "kids",
    name: "Kids",
    slug: "kids",
    description: "Boutique collection for boys & girls crafted for joyful comfort.",
    image: "/categories/kids.jpg",
    isActive: true,
    department: "kids",
  },
  {
    id: "accessories",
    _id: "accessories",
    name: "Accessories",
    slug: "accessories",
    description: "Belts, socks, caps, baby shoes, perfumes, and signature styling accents.",
    image: "/categories/accessories.jpg",
    isActive: true,
    department: "accessories",
  },

  // Key Collections & Subcategories
  {
    id: "sarees",
    _id: "sarees",
    name: "Sarees",
    slug: "sarees",
    description: "Timeless sarees for celebrations, weddings, and traditional occasions.",
    image: "/categories/saree.jpg",
    isActive: true,
    department: "ladies",
  },
  {
    id: "kurtis",
    _id: "kurtis",
    name: "Kurthies",
    slug: "kurtis",
    description: "Elegant and comfortable kurthies for everyday wear and festive gatherings.",
    image: "/categories/kurtis.avif",
    isActive: true,
    department: "ladies",
  },
  {
    id: "readymade-churidars",
    _id: "readymade-churidars",
    name: "Readymade Churidars",
    slug: "readymade-churidars",
    description: "Graceful readymade churidars and anarkalis designed for graceful silhouettes.",
    image: "/categories/salvarsuits.jpg",
    isActive: true,
    department: "ladies",
  },
  {
    id: "shirts",
    _id: "shirts",
    name: "Shirts",
    slug: "shirts",
    description: "Classic and contemporary gents shirts crafted with fine fabrics.",
    image: "/categories/shirts.jpg",
    isActive: true,
    department: "gents",
  },
  {
    id: "t-shirts",
    _id: "t-shirts",
    name: "T Shirts",
    slug: "t-shirts",
    description: "Comfortable and casual T-shirts for everyday gents wear.",
    image: "/categories/tshirts.jpg",
    isActive: true,
    department: "gents",
  },
  {
    id: "cot-set",
    _id: "cot-set",
    name: "Cot Set",
    slug: "cot-set",
    description: "Chic co-ord sets and modern sets tailored for contemporary elegance.",
    image: "/categories/cotset.jpg",
    isActive: true,
    department: "ladies",
  },
  {
    id: "blouses",
    _id: "blouses",
    name: "Blouse",
    slug: "blouses",
    description: "Artisan-tailored designer blouses to perfectly complement your saree.",
    image: "/categories/blouse.webp",
    isActive: true,
    department: "ladies",
  },
  {
    id: "night-wears",
    _id: "night-wears",
    name: "Night Wears",
    slug: "night-wears",
    description: "Soft, breathable, and relaxed nightwear and loungewear for ladies.",
    image: "/categories/nightwears.jpg",
    isActive: true,
    department: "ladies",
  },
  {
    id: "mundu",
    _id: "mundu",
    name: "Mundu",
    slug: "mundu",
    description: "Authentic traditional Kerala mundu and dhotis with classic borders.",
    image: "/categories/mundu.jpg",
    isActive: true,
    department: "gents",
  },
  {
    id: "lungi",
    _id: "lungi",
    name: "Lungi",
    slug: "lungi",
    description: "Comfortable daily-wear cotton lungis for gents.",
    image: "/categories/lungi.jpg",
    isActive: true,
    department: "gents",
  },
  {
    id: "track-suit",
    _id: "track-suit",
    name: "Track Suit",
    slug: "track-suit",
    description: "Modern athletic track suits and activewear for gents.",
    image: "/categories/tracksuit.jpg",
    isActive: true,
    department: "gents",
  },
  {
    id: "three-forth",
    _id: "three-forth",
    name: "Three Forth",
    slug: "three-forth",
    description: "Casual 3/4th pants and relaxed capris for gents.",
    image: "/categories/pants.jpg",
    isActive: true,
    department: "gents",
  },
  {
    id: "shorts",
    _id: "shorts",
    name: "Shorts",
    slug: "shorts",
    description: "Relaxed fit and breezy cotton shorts for casual comfort.",
    image: "/categories/pants.jpg",
    isActive: true,
    department: "gents",
  },
  {
    id: "boys-girls",
    _id: "boys-girls",
    name: "Boys & Girls",
    slug: "boys-girls",
    description: "Charming traditional and modern fashion for boys and girls.",
    image: "/categories/kids.jpg",
    isActive: true,
    department: "kids",
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
    id: "lehenga",
    _id: "lehenga",
    name: "Lehengas",
    slug: "lehenga",
    description: "Majestic bridal and festive lehengas with intricate zari and embroidery.",
    image: "/categories/lehenga.jpg",
    isActive: true,
    department: "ladies",
  },
  {
    id: "salwar-suits",
    _id: "salwar-suits",
    name: "Salwar Suits",
    slug: "salwar-suits",
    description: "Graceful salwar suits and anarkalis designed for graceful silhouettes.",
    image: "/categories/salvarsuits.jpg",
    isActive: true,
    department: "ladies",
  },
];

export const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  // Gents
  gent: "gents",
  gents: "gents",
  men: "gents",
  mens: "gents",
  menswear: "gents",
  shirt: "shirts",
  shirts: "shirts",
  "t-shirt": "t-shirts",
  "t-shirts": "t-shirts",
  tshirt: "t-shirts",
  tshirts: "t-shirts",
  "gents-shirt": "shirts",
  "gents-shirts": "shirts",
  "gents-pants": "pants",
  pant: "pants",
  pants: "pants",
  "track-suit": "track-suit",
  "track-suits": "track-suit",
  tracksuit: "track-suit",
  tracksuits: "track-suit",
  "three-forth": "three-forth",
  "three-fourths": "three-forth",
  threeforth: "three-forth",
  "3-4th": "three-forth",
  short: "shorts",
  shorts: "shorts",
  lungi: "lungi",
  lungis: "lungi",
  mundu: "mundu",
  mundus: "mundu",
  dhoti: "mundu",

  // Ladies
  lady: "ladies",
  ladies: "ladies",
  women: "ladies",
  womens: "ladies",
  womenswear: "ladies",
  "readymade-churidars": "readymade-churidars",
  "readymade-churidar": "readymade-churidars",
  churidar: "readymade-churidars",
  churidars: "readymade-churidars",
  kurthi: "kurtis",
  kurthies: "kurtis",
  kurti: "kurtis",
  kurtis: "kurtis",
  "cot-set": "cot-set",
  "cot-sets": "cot-set",
  "co-ord-set": "cot-set",
  "co-ord-sets": "cot-set",
  "coord-set": "cot-set",
  "coord-sets": "cot-set",
  "ladies-pants": "ladies-pants",
  "ladies-pant": "ladies-pants",
  saree: "sarees",
  sarees: "sarees",
  blouse: "blouses",
  blouses: "blouses",
  "night-wear": "night-wears",
  "night-wears": "night-wears",
  nightwear: "night-wears",
  nightwears: "night-wears",
  lehenga: "lehenga",
  lehengas: "lehenga",
  salwarsuit: "salwar-suits",
  salwarsuits: "salwar-suits",
  "salwar-suit": "salwar-suits",
  "salwar-suits": "salwar-suits",
  "salvar-suits": "salwar-suits",
  "salvar-suit": "salwar-suits",
  dress: "dresses",
  dresses: "dresses",
  ethnicwear: "ethnic-wear",
  "ethnic-wear": "ethnic-wear",

  // Kids
  kid: "kids",
  kids: "kids",
  "boys-and-girls": "boys-girls",
  "boys-girls": "boys-girls",
  boy: "boys-girls",
  boys: "boys-girls",
  girl: "boys-girls",
  girls: "boys-girls",
  children: "kids",

  // Accessories
  accessory: "accessories",
  accessories: "accessories",
  belt: "belts",
  belts: "belts",
  sock: "socks",
  socks: "socks",
  cap: "caps",
  caps: "caps",
  hat: "caps",
  "baby-shoe": "baby-shoes",
  "baby-shoes": "baby-shoes",
  perfume: "perfumes",
  perfumes: "perfumes",
};

export function normalizeCategorySlug(slug?: string | null): string {
  if (!slug) return "";
  const cleaned = slug.toLowerCase().trim();
  return CATEGORY_SLUG_ALIASES[cleaned] || cleaned;
}

export const DEPARTMENT_MAP: Record<string, "gents" | "ladies" | "kids" | "accessories"> = {
  // Gents
  gents: "gents",
  gent: "gents",
  men: "gents",
  mens: "gents",
  menswear: "gents",
  shirts: "gents",
  shirt: "gents",
  "t-shirts": "gents",
  "t-shirt": "gents",
  pants: "gents",
  pant: "gents",
  "gents-pants": "gents",
  "track-suit": "gents",
  "three-forth": "gents",
  shorts: "gents",
  lungi: "gents",
  mundu: "gents",

  // Ladies
  ladies: "ladies",
  lady: "ladies",
  women: "ladies",
  womens: "ladies",
  "readymade-churidars": "ladies",
  "readymade-churidar": "ladies",
  churidars: "ladies",
  churidar: "ladies",
  kurtis: "ladies",
  kurti: "ladies",
  kurthies: "ladies",
  kurthi: "ladies",
  "cot-set": "ladies",
  "ladies-pants": "ladies",
  sarees: "ladies",
  saree: "ladies",
  blouses: "ladies",
  blouse: "ladies",
  "night-wears": "ladies",
  "night-wear": "ladies",
  lehenga: "ladies",
  lehengas: "ladies",
  "salwar-suits": "ladies",
  dresses: "ladies",
  "ethnic-wear": "ladies",

  // Kids
  kids: "kids",
  kid: "kids",
  "boys-girls": "kids",
  "boys-and-girls": "kids",

  // Accessories
  accessories: "accessories",
  accessory: "accessories",
  belts: "accessories",
  belt: "accessories",
  socks: "accessories",
  sock: "accessories",
  caps: "accessories",
  cap: "accessories",
  "baby-shoes": "accessories",
  "baby-shoe": "accessories",
  perfumes: "accessories",
  perfume: "accessories",
};

export function matchesCategoryFilter(productCategorySlug: string, filterSlug: string): boolean {
  if (!filterSlug || filterSlug === "all") return true;

  const normalizedFilter = normalizeCategorySlug(filterSlug);
  const normalizedProduct = normalizeCategorySlug(productCategorySlug);

  if (normalizedProduct === normalizedFilter) return true;

  // Department-level match (e.g. filter is 'gents', and product is 'shirts')
  if (
    normalizedFilter === "gents" ||
    normalizedFilter === "ladies" ||
    normalizedFilter === "kids" ||
    normalizedFilter === "accessories"
  ) {
    return DEPARTMENT_MAP[normalizedProduct] === normalizedFilter;
  }

  return false;
}

