export type Product = {
  id: string;
  name: string;
  capacity: string;
  condition: string;
  badge: string;
  price: number;
  compare_at_price: number | null;
  is_on_sale: boolean;
  stock_quantity: number;
  installment: string;
  tone: string;
  image_url?: string | null;
};

export const PRODUCTS: Product[] = [
  {
    id: "iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    capacity: "256 GB",
    condition: "Novo • Lacrado",
    badge: "Destaque",
    price: 8699,
    compare_at_price: null,
    is_on_sale: false,
    stock_quantity: 5,
    installment: "ou 12x de R$ 724,92",
    tone: "titanium",
  },
  {
    id: "iphone-16-pro",
    name: "iPhone 16 Pro",
    capacity: "128 GB",
    condition: "Novo • Lacrado",
    badge: "Mais procurado",
    price: 7299,
    compare_at_price: null,
    is_on_sale: false,
    stock_quantity: 4,
    installment: "ou 12x de R$ 608,25",
    tone: "graphite",
  },
  {
    id: "iphone-15",
    name: "iPhone 15",
    capacity: "128 GB",
    condition: "Seminovo • Impecável",
    badge: "Melhor custo-benefício",
    price: 4299,
    compare_at_price: null,
    is_on_sale: false,
    stock_quantity: 3,
    installment: "",
    tone: "blue",
    image_url: "/iphone-15-lineup.png",
  },
  {
    id: "iphone-14",
    name: "iPhone 14",
    capacity: "128 GB",
    condition: "Seminovo • Impecável",
    badge: "Oferta",
    price: 3599,
    compare_at_price: 3999,
    is_on_sale: true,
    stock_quantity: 4,
    installment: "",
    tone: "purple",
    image_url: "/iphone-14-lineup.png",
  },
  {
    id: "iphone-13",
    name: "iPhone 13",
    capacity: "128 GB",
    condition: "Seminovo • Vitrine",
    badge: "Popular",
    price: 2899,
    compare_at_price: 3299,
    is_on_sale: true,
    stock_quantity: 5,
    installment: "",
    tone: "blue",
    image_url: "/iphone-13-lineup.png",
  },
];
