
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function seedProducts() {
  const mongoose = (await import("mongoose")).default;
  const { connectToDatabase } = await import("../src/lib/mongodb");
  const { default: Category } = await import("../src/models/Category");
  const { default: Product } = await import("../src/models/Product");

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing. Please check your .env.local file."
      );
    }

    await connectToDatabase();

    console.log("Connected to MongoDB.");

    // Updated categories for Mydhili Collections
    const categories = [
      {
        name: "Kurtis",
        slug: "kurtis",
        description: "Elegant kurtis for everyday wear and special occasions.",
      },
      {
        name: "Sarees",
        slug: "sarees",
        description: "Timeless sarees for celebrations and traditional occasions.",
      },
      {
        name: "Ethnic Wear",
        slug: "ethnic-wear",
        description: "Beautiful ethnic outfits with a contemporary touch.",
      },
      {
        name: "Dresses",
        slug: "dresses",
        description: "Modern dresses for everyday style and special moments.",
      },
      {
        name: "Blouses",
        slug: "blouses",
        description: "Stylish blouses to complement your saree collection.",
      },
      {
        name: "Accessories",
        slug: "accessories",
        description: "Accessories to complete your look.",
      },
    ];

    const categoryIds = new Map<string, string>();

    // Hide legacy categories without deleting their records.
    const activeCategorySlugs = categories.map((category) => category.slug);

    await Category.updateMany(
      { slug: { $nin: activeCategorySlugs } },
      { $set: { isActive: false } }
    );

    // Create or update categories.
    for (const category of categories) {
      const savedCategory = await Category.findOneAndUpdate(
        { slug: category.slug },
        {
          $set: {
            ...category,
            isActive: true,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      categoryIds.set(category.slug, savedCategory._id.toString());
    }

    // Sample products. Replace these details with the client's real catalogue.
    const products = [
      {
        name: "Royal Burgundy Silk Saree",
        slug: "royal-burgundy-silk-saree",
        description:
          "An elegant saree for celebrations and special occasions. Confirm the fabric, measurements, care instructions, and product details before publishing.",
        shortDescription: "Elegant occasion-wear saree",
        categorySlug: "sarees",
        price: 2499,
        compareAtPrice: 2999,
        images: [],
        variants: [
          {
            sku: "MC-SAR-001",
            size: "Free Size",
            color: "Burgundy",
            stock: 10,
          },
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Classic Floral Kurti",
        slug: "classic-floral-kurti",
        description:
          "A versatile floral kurti for everyday styling. Update the description with the actual fabric, fit, and washing instructions.",
        shortDescription: "Everyday floral kurti",
        categorySlug: "kurtis",
        price: 899,
        compareAtPrice: 1199,
        images: [],
        variants: [
          {
            sku: "MC-KUR-001-S",
            size: "S",
            color: "Rose",
            stock: 5,
          },
          {
            sku: "MC-KUR-001-M",
            size: "M",
            color: "Rose",
            stock: 8,
          },
          {
            sku: "MC-KUR-001-L",
            size: "L",
            color: "Rose",
            stock: 8,
          },
          {
            sku: "MC-KUR-001-XL",
            size: "XL",
            color: "Rose",
            stock: 5,
          },
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Embroidered Festive Ethnic Set",
        slug: "embroidered-festive-ethnic-set",
        description:
          "A festive ethnic outfit for special occasions. Replace this sample information with the confirmed product specifications.",
        shortDescription: "Festive ethnic wear",
        categorySlug: "ethnic-wear",
        price: 3299,
        compareAtPrice: 3999,
        images: [],
        variants: [
          {
            sku: "MC-ETH-001-M",
            size: "M",
            color: "Maroon",
            stock: 4,
          },
          {
            sku: "MC-ETH-001-L",
            size: "L",
            color: "Maroon",
            stock: 4,
          },
        ],
        isFeatured: true,
        isActive: true,
      },
      {
        name: "Elegant Everyday Dress",
        slug: "elegant-everyday-dress",
        description:
          "A modern dress for everyday wear and outings. Add the actual fabric, fit, and care information before publishing.",
        shortDescription: "Modern everyday dress",
        categorySlug: "dresses",
        price: 1499,
        images: [],
        variants: [
          {
            sku: "MC-DRE-001-S",
            size: "S",
            color: "Black",
            stock: 4,
          },
          {
            sku: "MC-DRE-001-M",
            size: "M",
            color: "Black",
            stock: 6,
          },
          {
            sku: "MC-DRE-001-L",
            size: "L",
            color: "Black",
            stock: 4,
          },
        ],
        isFeatured: false,
        isActive: true,
      },
      {
        name: "Classic Designer Blouse",
        slug: "classic-designer-blouse",
        description:
          "A blouse designed to complement traditional sarees. Confirm the sizing, fabric, and tailoring options before publishing.",
        shortDescription: "Traditional blouse style",
        categorySlug: "blouses",
        price: 799,
        images: [],
        variants: [
          {
            sku: "MC-BLO-001-M",
            size: "M",
            color: "Gold",
            stock: 5,
          },
          {
            sku: "MC-BLO-001-L",
            size: "L",
            color: "Gold",
            stock: 5,
          },
        ],
        isFeatured: false,
        isActive: true,
      },
      {
        name: "Traditional Embroidered Clutch",
        slug: "traditional-embroidered-clutch",
        description:
          "An accessory to complement ethnic and festive outfits. Replace this sample description with the actual product details.",
        shortDescription: "Elegant occasion accessory",
        categorySlug: "accessories",
        price: 699,
        images: [],
        variants: [
          {
            sku: "MC-ACC-001",
            size: "One Size",
            color: "Gold",
            stock: 10,
          },
        ],
        isFeatured: false,
        isActive: true,
      },
    ];

    // Create or update products using their unique slugs.
    for (const product of products) {
      const { categorySlug, ...productData } = product;
      const categoryId = categoryIds.get(categorySlug);

      if (!categoryId) {
        throw new Error(`Category not found: ${categorySlug}`);
      }

      await Product.findOneAndUpdate(
        { slug: product.slug },
        {
          $set: {
            ...productData,
            category: categoryId,
          },
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );
    }

    console.log("Mydhili Collections seeding completed successfully.");
    console.log(`Categories processed: ${categories.length}`);
    console.log(`Products processed: ${products.length}`);
  } catch (error) {
    console.error("Product seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedProducts();
