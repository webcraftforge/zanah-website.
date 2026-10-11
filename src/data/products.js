
// Placeholder products. Replace names, prices and photos with your real ones.
// Each product needs a unique `slug` (used in the page address).

const A = "photo-1539109136881-3be0616acf4b";
const B = "photo-1483985988355-763728e1935b";
const C = "photo-1485230895905-ec40ba36b9bc";

// Placeholders. When you have your own photos, use their base path instead,
// e.g. images: ["/images/products/kurti-1", "/images/products/kurti-2"]
const img = (id) => `https://images.unsplash.com/${id}`;

const SIZES = ["XS", "S", "M", "L", "XL"];

export const products = [
  {
    slug: "everyday-kurti",
    name: "The Everyday Kurti",
    category: "Kurtis",
    price: 4900,
    sizes: SIZES,
    images: [img(A), img(B), img(C)],
    description:
      "A relaxed straight-cut kurti made for long days. Soft, breathable and easy to dress up or down.",
    fabric: "Premium cotton lawn",
    care: "Machine wash cold, iron on low",
  },
  {
    slug: "modern-edit-set",
    name: "The Modern Edit Set",
    category: "Co-ords",
    price: 7900,
    sizes: SIZES,
    images: [img(B), img(C), img(A)],
    description:
      "A matching two-piece with a clean, tailored shape. Wear it together or style each piece on its own.",
    fabric: "Linen blend",
    care: "Gentle wash, cool iron",
  },
  {
    slug: "neutral-story-dress",
    name: "The Neutral Story Dress",
    category: "Dresses",
    price: 8900,
    sizes: SIZES,
    images: [img(C), img(A), img(B)],
    description:
      "A flowing midi dress in a quiet neutral tone. Light, comfortable and made to move with you.",
    fabric: "Viscose crepe",
    care: "Hand wash cold, hang dry",
  },
  {
    slug: "soft-linen-kurti",
    name: "The Soft Linen Kurti",
    category: "Kurtis",
    price: 5500,
    sizes: SIZES,
    images: [img(B), img(A), img(C)],
    description:
      "Textured linen with a gentle drape and side slits. A summer essential in a calm, earthy shade.",
    fabric: "Pure linen",
    care: "Machine wash cold, line dry",
  },
  {
    slug: "sand-co-ord",
    name: "The Sand Co-ord",
    category: "Co-ords",
    price: 8400,
    sizes: SIZES,
    images: [img(A), img(C), img(B)],
    description:
      "A shirt and trouser set in warm sand. Structured, simple and easy to wear all day.",
    fabric: "Cotton twill",
    care: "Machine wash cold, iron medium",
  },
  {
    slug: "quiet-shirt-dress",
    name: "The Quiet Shirt Dress",
    category: "Dresses",
    price: 9500,
    sizes: SIZES,
    images: [img(C), img(B), img(A)],
    description:
      "A longline shirt dress with a soft collar and a waist tie. Effortless from morning to evening.",
    fabric: "Cotton poplin",
    care: "Machine wash cold, iron medium",
  },
  {
    slug: "weekend-kurti",
    name: "The Weekend Kurti",
    category: "Kurtis",
    price: 4500,
    sizes: SIZES,
    images: [img(A), img(C), img(B)],
    description:
      "A short, easy kurti with a boxy fit. Pair it with trousers or jeans for a relaxed look.",
    fabric: "Cotton slub",
    care: "Machine wash cold",
  },
  {
    slug: "ivory-co-ord",
    name: "The Ivory Co-ord",
    category: "Co-ords",
    price: 8200,
    sizes: SIZES,
    images: [img(B), img(C), img(A)],
    description:
      "A crisp ivory set with a slightly cropped top. Clean lines and a light, airy feel.",
    fabric: "Cotton blend",
    care: "Gentle wash, cool iron",
  },
  {
    slug: "evening-drape-dress",
    name: "The Evening Drape Dress",
    category: "Dresses",
    price: 11500,
    sizes: SIZES,
    images: [img(C), img(A), img(B)],
    description:
      "A softly draped dress with a flattering neckline. Made for dinners and celebrations.",
    fabric: "Satin crepe",
    care: "Dry clean recommended",
  },
];

export const categories = ["All", ...new Set(products.map((p) => p.category))];

export const formatPrice = (n) => `PKR ${n.toLocaleString("en-US")}`;