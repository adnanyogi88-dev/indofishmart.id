export const productCategories = ["Semua", "Ikan Fillet", "Seafood", "Ikan Utuh"] as const;
export type ProductCategory = (typeof productCategories)[number];

export type Product = {
  name: string;
  category: Exclude<ProductCategory, "Semua">;
  image: string;
  description: string;
  size: string;
};

export const products: Product[] = [
  {
    name: "Dori Fillet Premium",
    category: "Ikan Fillet",
    image: "/images/dori-fillet.webp",
    description: "Daging lembut, tanpa duri, praktis untuk rumah makan dan katering.",
    size: "Kemasan 1 kg",
  },
  {
    name: "Gurame Fillet",
    category: "Ikan Fillet",
    image: "/images/gurame-fillet.webp",
    description: "Potongan rapi dengan tekstur padat untuk menu goreng dan bakar.",
    size: "Kemasan vakum",
  },
  {
    name: "Udang Vaname",
    category: "Seafood",
    image: "/images/udang-vaname.jpg",
    description: "Ukuran konsisten dan ditangani dengan rantai dingin yang terjaga.",
    size: "Tersedia berbagai size",
  },
  {
    name: "Ikan Laut Pilihan",
    category: "Ikan Utuh",
    image: "/images/ikan-laut.jpg",
    description: "Pilihan ikan laut untuk kebutuhan retail, restoran, dan distributor.",
    size: "Segar dan beku",
  },
  {
    name: "Gurame Segar",
    category: "Ikan Utuh",
    image: "/images/gurame-segar.jpg",
    description: "Dipilih dari pemasok tepercaya untuk kualitas yang lebih konsisten.",
    size: "Ukuran sesuai permintaan",
  },
];
