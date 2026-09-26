import cosmicOrangeAsset from "@/assets/iphone-17-pro-max-cosmic-orange.png.asset.json";
import deepBlueAsset from "@/assets/iphone-17-pro-max-deep-blue.png.asset.json";
import silverBackAsset from "@/assets/iphone-17-pro-max-silver-1-verso.png.asset.json";
import iphone17ProImage from "@/assets/iphone-17-pro-transparent.webp";
import silverSideAsset from "@/assets/iphone-17-pro-max-silver-2-lateral.png.asset.json";
import silverFrontAsset from "@/assets/iphone-17-pro-max-silver-3-frente.png.asset.json";

export type ProductImageVariant = {
  name: string;
  color: string;
  images: string[];
};

const STORE = "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/";
const SUPPORT = "https://cdsassets.apple.com/live/7WUAS350/images/iphone/";
const storeViews = (base: string) => [
  `${STORE}${base}?wid=900&hei=1050&fmt=png-alpha`,
  `${STORE}${base}_AV2?wid=900&hei=700&fmt=png-alpha`,
  `${STORE}${base}_AV3?wid=1100&hei=650&fmt=png-alpha`,
];

const colors = (items: Array<[string, string, string]>) =>
  items.map(([name, color, base]) => ({ name, color, images: storeViews(base) }));

export const OFFICIAL_PRODUCT_IMAGES: Record<string, ProductImageVariant[]> = {
  "iPhone 18 Pro": [
    { name: "Preto-titânio", color: "#2d2d2f", images: [] },
    { name: "Titânio Natural", color: "#a8a299", images: [] },
    { name: "Titânio Azul", color: "#3c4756", images: [] },
    { name: "Titânio Vinho (Burgundy)", color: "#54252f", images: [] },
  ],
  "iPhone 17 Pro Max": [
    { name: "Prateado", color: "#d9dadd", images: [] },
    { name: "Titânio Laranja (Cosmic)", color: "#df7138", images: [] },
    { name: "Azul Profundo", color: "#263853", images: [] },
  ],
  "iPhone 17 Pro": [
    { name: "Prateado", color: "#d9dadd", images: [] },
    { name: "Preto-espacial", color: "#343538", images: [] },
    { name: "Azul Titânio", color: "#324357", images: [] },
    { name: "Titânio Laranja", color: "#d96f39", images: [] },
    { name: "Prata Iridescente", color: "#bce4e8", images: [] },
  ],
  "iPhone 17": [
    { name: "Preto-espacial", color: "#2e3033", images: [] },
    { name: "Branco", color: "#eeeae2", images: [] },
    { name: "Verde-pistache", color: "#b3c99c", images: [] },
    { name: "Azul-celeste", color: "#92b5d8", images: [] },
    { name: "Lilás", color: "#d8c2e7", images: [] },
  ],
  "iPhone Air": [
    { name: "Preto-espacial", color: "#242527", images: [] },
    { name: "Branco", color: "#f2f2ee", images: [] },
    { name: "Dourado Suave", color: "#e8dfcc", images: [] },
    { name: "Azul-gelo", color: "#b9d2e3", images: [] },
  ],
  "iPhone 16 Pro Max": [
    { name: "Titânio Deserto", color: "#c2a58d", images: [] },
    { name: "Titânio Natural", color: "#aaa294", images: [] },
    { name: "Titânio Branco", color: "#e8e5df", images: [] },
    { name: "Titânio Preto", color: "#3d3d3b", images: [] },
  ],
  "iPhone 16 Pro": [
    { name: "Titânio Deserto", color: "#c2a58d", images: [] },
    { name: "Titânio Natural", color: "#aaa294", images: [] },
    { name: "Titânio Branco", color: "#e8e5df", images: [] },
    { name: "Titânio Preto", color: "#3d3d3b", images: [] },
  ],
  "iPhone 16": [
    { name: "Preto", color: "#292827", images: [] },
    { name: "Branco", color: "#eeeae2", images: [] },
    { name: "Rosa", color: "#e8b7ca", images: [] },
    { name: "Verde-acinzentado", color: "#8ea59a", images: [] },
    { name: "Ultramarino", color: "#778bc6", images: [] },
  ],
  "iPhone 15 Pro Max": [
    { name: "Titânio Natural", color: "#aaa294", images: [] },
    { name: "Titânio Azul", color: "#596678", images: [] },
    { name: "Titânio Branco", color: "#e8e5df", images: [] },
    { name: "Titânio Preto", color: "#3d3d3b", images: [] },
  ],
  "iPhone 15": [
    { name: "Preto", color: "#353839", images: [] },
    { name: "Azul", color: "#d5e2e8", images: [] },
    { name: "Verde", color: "#d5dfd4", images: [] },
    { name: "Amarelo", color: "#f3e7b4", images: [] },
    { name: "Rosa", color: "#ead0d4", images: [] },
  ],
  "iPhone 14": [
    { name: "Meia-noite", color: "#34363a", images: [] },
    { name: "Estelar", color: "#eee7db", images: [] },
    { name: "Rosa", color: "#e8c3d1", images: [] },
    { name: "Azul", color: "#a8bfd0", images: [] },
    { name: "Roxo", color: "#c8b9d1", images: [] },
  ],
  "iPhone 13": [
    { name: "Meia-noite", color: "#232a31", images: [] },
    { name: "Estelar", color: "#faf6f0", images: [] },
    { name: "Rosa", color: "#fae0dd", images: [] },
    { name: "Azul", color: "#437793", images: [] },
    { name: "Verde", color: "#3c4d42", images: [] },
    { name: "(PRODUCT)RED", color: "#bf0012", images: [] },
  ],
};

const IPHONE_17_CATALOG_IMAGE = "/iphone-17-catalog.webp";

const supportMap: Record<string, string> = {
  "iPhone 17 Pro": iphone17ProImage,
  "iPhone 17": IPHONE_17_CATALOG_IMAGE,
  "iPhone 16 Pro Max": `${SUPPORT}iphone-16-pro-max-colors.png`,
  "iPhone 16 Pro": `${SUPPORT}iphone-16-pro-colors.png`,
  "iPhone 11": `${SUPPORT}identify-iphone-11-colors.jpg`,
  "iPhone XR": `${SUPPORT}iphone-xr/identify-iphone-xr-colors.jpg`,
};

export function getOfficialVariants(productName: string): ProductImageVariant[] {
  const key = Object.keys(OFFICIAL_PRODUCT_IMAGES).find((name) => productName.startsWith(name));
  if (key) return OFFICIAL_PRODUCT_IMAGES[key] ?? [];
  const supportKey = Object.keys(supportMap).find((name) => productName.startsWith(name));
  if (!supportKey) return [];
  const image = supportMap[supportKey];
  if (!image) return [];
  return [{ name: "Cores disponíveis", color: "#8a8a8a", images: [image] }];
}

export function parseImageVariants(value: unknown): ProductImageVariant[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is ProductImageVariant => {
    if (!item || typeof item !== "object") return false;
    const candidate = item as Record<string, unknown>;
    return typeof candidate["name"] === "string" && typeof candidate["color"] === "string" &&
      Array.isArray(candidate["images"]) && candidate["images"].every((image) => typeof image === "string");
  });
}
