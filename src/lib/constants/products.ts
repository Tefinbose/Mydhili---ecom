export interface StoreProduct {
  id: string;
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number;
  compareAtPrice: number | null;
  images: string[];
  variants: {
    sku: string;
    size: string;
    color: string;
    stock: number;
  }[];
  isFeatured: boolean;
  isActive: boolean;
  category: {
    id: string;
    _id: string;
    name: string;
    slug: string;
  };
}

export const DEFAULT_PRODUCTS: StoreProduct[] = [
  {
    id: "prod-lungi-001",
    _id: "prod-lungi-001",
    name: "Heritage Handloom Cotton Check Lungi",
    slug: "heritage-handloom-cotton-lungi",
    description:
      "Crafted from 100% pure combed handloom cotton, this traditional South Indian lungi offers timeless comfort, breathability, and authentic woven borders.",
    shortDescription: "Handloom pure cotton traditional lungi",
    price: 449.0,
    compareAtPrice: 599.0,
    images: ["/categories/lungi.jpg"],
    variants: [
      { sku: "MC-LNG-001", size: "Free Size", color: "Amber Check", stock: 20 },
      { sku: "MC-LNG-002", size: "Free Size", color: "Indigo Check", stock: 15 },
    ],
    isFeatured: true,
    isActive: true,
    category: {
      id: "lungi",
      _id: "lungi",
      name: "Lungi",
      slug: "lungi",
    },
  },
  {
    id: "prod-sar-001",
    _id: "prod-sar-001",
    name: "Royal Burgundy Silk Saree",
    slug: "royal-burgundy-silk-saree",
    description:
      "An exquisitely woven silk saree in deep royal burgundy, adorned with delicate golden zari borders. Handcrafted by master weavers for grand celebrations and weddings.",
    shortDescription: "Handcrafted pure silk festive saree",
    price: 2499.0,
    compareAtPrice: 2999.0,
    images: ["/categories/saree.jpg"],
    variants: [
      { sku: "MC-SAR-001", size: "Free Size", color: "Burgundy", stock: 12 },
    ],
    isFeatured: true,
    isActive: true,
    category: {
      id: "sarees",
      _id: "sarees",
      name: "Sarees",
      slug: "sarees",
    },
  },
  {
    id: "prod-kur-001",
    _id: "prod-kur-001",
    name: "Classic Floral Chanderi Kurti",
    slug: "classic-floral-kurti",
    description:
      "Lightweight, breathable Chanderi kurti featuring delicate floral motifs, comfortable side slits, and a Mandarin neckline.",
    shortDescription: "Everyday floral boutique kurti",
    price: 899.0,
    compareAtPrice: 1199.0,
    images: ["/categories/kurtis.avif"],
    variants: [
      { sku: "MC-KUR-001-S", size: "S", color: "Rose", stock: 6 },
      { sku: "MC-KUR-001-M", size: "M", color: "Rose", stock: 10 },
      { sku: "MC-KUR-001-L", size: "L", color: "Rose", stock: 8 },
    ],
    isFeatured: true,
    isActive: true,
    category: {
      id: "kurtis",
      _id: "kurtis",
      name: "Kurthies",
      slug: "kurtis",
    },
  },
  {
    id: "prod-eth-001",
    _id: "prod-eth-001",
    name: "Embroidered Festive Ethnic Set",
    slug: "embroidered-festive-ethnic-set",
    description:
      "A 3-piece festive ethnic set consisting of an embroidered kurta, straight-fit trousers, and a luxurious tissue dupatta.",
    shortDescription: "3-piece festive embroidered ensemble",
    price: 3299.0,
    compareAtPrice: 3999.0,
    images: ["/categories/ethnicwear.jpg"],
    variants: [
      { sku: "MC-ETH-001-M", size: "M", color: "Maroon", stock: 6 },
      { sku: "MC-ETH-001-L", size: "L", color: "Maroon", stock: 8 },
    ],
    isFeatured: true,
    isActive: true,
    category: {
      id: "ethnic-wear",
      _id: "ethnic-wear",
      name: "Ethnic Wear",
      slug: "ethnic-wear",
    },
  },
  {
    id: "prod-dre-001",
    _id: "prod-dre-001",
    name: "Elegant Everyday Georgette Dress",
    slug: "elegant-everyday-dress",
    description:
      "Flowing georgette maxi dress featuring subtle gather details at the waist and airy tiered hemline.",
    shortDescription: "Flowy georgette tiered dress",
    price: 1499.0,
    compareAtPrice: 1799.0,
    images: ["/categories/dresses.jpg"],
    variants: [
      { sku: "MC-DRE-001-S", size: "S", color: "Emerald", stock: 5 },
      { sku: "MC-DRE-001-M", size: "M", color: "Emerald", stock: 7 },
    ],
    isFeatured: false,
    isActive: true,
    category: {
      id: "dresses",
      _id: "dresses",
      name: "Dresses",
      slug: "dresses",
    },
  },
  {
    id: "prod-blo-001",
    _id: "prod-blo-001",
    name: "Classic Zardozi Designer Blouse",
    slug: "classic-designer-blouse",
    description:
      "Hand-embroidered zardozi blouse in rich antique gold raw silk with comfortable padded cups and soft inner lining.",
    shortDescription: "Handcrafted zardozi bridal blouse",
    price: 1299.0,
    compareAtPrice: 1599.0,
    images: ["/categories/blouse.webp"],
    variants: [
      { sku: "MC-BLO-001-36", size: "36", color: "Antique Gold", stock: 6 },
    ],
    isFeatured: false,
    isActive: true,
    category: {
      id: "blouses",
      _id: "blouses",
      name: "Blouse",
      slug: "blouses",
    },
  },
  {
    id: "prod-acc-001",
    _id: "prod-acc-001",
    name: "Traditional Embroidered Potli Clutch",
    slug: "traditional-embroidered-clutch",
    description:
      "A boutique hand-beaded potli clutch with pearl tassels, perfect for storing essentials at weddings and receptions.",
    shortDescription: "Handcrafted pearl tassel potli clutch",
    price: 699.0,
    compareAtPrice: 899.0,
    images: ["/categories/accessories.jpg"],
    variants: [
      { sku: "MC-ACC-001", size: "One Size", color: "Gold", stock: 15 },
    ],
    isFeatured: false,
    isActive: true,
    category: {
      id: "accessories",
      _id: "accessories",
      name: "Accessories",
      slug: "accessories",
    },
  },
  {
    id: "prod-leh-001",
    _id: "prod-leh-001",
    name: "Emerald Green Velvet Bridal Lehenga",
    slug: "emerald-green-bridal-lehenga",
    description:
      "Luxurious heavy bridal lehenga in rich velvet with intricate resham and sequin work, paired with a matching blouse and net dupatta.",
    shortDescription: "Hand-embellished velvet bridal lehenga",
    price: 5999.0,
    compareAtPrice: 7499.0,
    images: ["/categories/lehenga.jpg"],
    variants: [
      { sku: "MC-LEH-001-M", size: "Semi-Stitched", color: "Emerald Green", stock: 4 },
    ],
    isFeatured: true,
    isActive: true,
    category: {
      id: "lehenga",
      _id: "lehenga",
      name: "Lehengas",
      slug: "lehenga",
    },
  },
  {
    id: "prod-sal-001",
    _id: "prod-sal-001",
    name: "Pastel Lavender Chanderi Salwar Suit",
    slug: "pastel-lavender-salwar-suit",
    description:
      "Graceful pastel lavender salwar suit crafted from fine Chanderi with delicate gota patti detailing on neckline and dupatta.",
    shortDescription: "Gota patti pastel salwar suit set",
    price: 2199.0,
    compareAtPrice: 2699.0,
    images: ["/categories/salvarsuits.jpg"],
    variants: [
      { sku: "MC-SAL-001-M", size: "M", color: "Lavender", stock: 6 },
    ],
    isFeatured: true,
    isActive: true,
    category: {
      id: "salwar-suits",
      _id: "salwar-suits",
      name: "Salwar Suits",
      slug: "salwar-suits",
    },
  },
];
