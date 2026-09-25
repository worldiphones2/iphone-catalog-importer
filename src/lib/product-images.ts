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
  "iPhone 17 Pro Max": [
    { name: "Silver", color: "#d9dadd", images: [silverBackAsset.url, silverSideAsset.url, silverFrontAsset.url] },
    { name: "Cosmic Orange", color: "#df7138", images: [cosmicOrangeAsset.url] },
    { name: "Deep Blue", color: "#263853", images: [deepBlueAsset.url] },
  ],
  "iPhone 16 Plus": colors([
    ["Ultramarino", "#778bc6", "iphone-16-plus-ultramarine-select-202409"],
    ["Verde-acinzentado", "#8ea59a", "iphone-16-plus-teal-select-202409"],
    ["Rosa", "#e8b7ca", "iphone-16-plus-pink-select-202409"],
    ["Branco", "#eeeae2", "iphone-16-plus-white-select-202409"],
    ["Preto", "#292827", "iphone-16-plus-black-select-202409"],
  ]),
  "iPhone 16": colors([
    ["Ultramarino", "#778bc6", "iphone-16-ultramarine-select-202409"],
    ["Verde-acinzentado", "#8ea59a", "iphone-16-teal-select-202409"],
    ["Rosa", "#e8b7ca", "iphone-16-pink-select-202409"],
    ["Branco", "#eeeae2", "iphone-16-white-select-202409"],
    ["Preto", "#292827", "iphone-16-black-select-202409"],
  ]),
  "iPhone 15 Pro Max": colors([
    ["Titânio natural", "#aaa294", "iphone-15-pro-max-naturaltitanium-select"],
    ["Titânio azul", "#596678", "iphone-15-pro-max-bluetitanium-select"],
    ["Titânio branco", "#e8e5df", "iphone-15-pro-max-whitetitanium-select"],
    ["Titânio preto", "#3d3d3b", "iphone-15-pro-max-blacktitanium-select"],
  ]),
  "iPhone 15 Pro": colors([
    ["Titânio natural", "#aaa294", "iphone-15-pro-naturaltitanium-select"],
    ["Titânio azul", "#596678", "iphone-15-pro-bluetitanium-select"],
    ["Titânio branco", "#e8e5df", "iphone-15-pro-whitetitanium-select"],
    ["Titânio preto", "#3d3d3b", "iphone-15-pro-blacktitanium-select"],
  ]),
  "iPhone 15 Plus": colors([
    ["Azul", "#d5e2e8", "iphone-15-plus-blue-select-202309"],
    ["Rosa", "#ead0d4", "iphone-15-plus-pink-select-202309"],
    ["Verde", "#d5dfd4", "iphone-15-plus-green-select-202309"],
    ["Preto", "#353839", "iphone-15-plus-black-select-202309"],
  ]),
  "iPhone 15": colors([
    ["Azul", "#d5e2e8", "iphone-15-blue-select-202309"],
    ["Rosa", "#ead0d4", "iphone-15-pink-select-202309"],
    ["Verde", "#d5dfd4", "iphone-15-green-select-202309"],
    ["Preto", "#353839", "iphone-15-black-select-202309"],
  ]),
  "iPhone 14 Pro Max": colors([
    ["Preto-espacial", "#4a4946", "iphone-14-pro-max-spaceblack-select"],
    ["Roxo-profundo", "#635c68", "iphone-14-pro-max-deeppurple-select"],
    ["Dourado", "#d8c4a9", "iphone-14-pro-max-gold-select"],
    ["Prateado", "#e5e4df", "iphone-14-pro-max-silver-select"],
  ]),
  "iPhone 14": colors([
    ["Azul", "#a8bfd0", "iphone-14-blue-select-202209"],
    ["Meia-noite", "#34363a", "iphone-14-midnight-select-202209"],
    ["Roxo", "#c8b9d1", "iphone-14-purple-select-202209"],
    ["Estelar", "#eee7db", "iphone-14-starlight-select-202209"],
  ]),
  "iPhone 13": colors([
    ["Azul", "#47718a", "iphone-13-blue-select-2021"],
    ["Meia-noite", "#31353a", "iphone-13-midnight-select-2021"],
    ["Rosa", "#e7c5c2", "iphone-13-pink-select-2021"],
  ]),
  "iPhone 12": colors([
    ["Azul", "#315b74", "iphone-12-blue-select-2020"],
    ["Preto", "#303033", "iphone-12-black-select-2020"],
    ["Branco", "#f0ede8", "iphone-12-white-select-2020"],
    ["Roxo", "#b8a9d1", "iphone-12-purple-select-2021"],
  ]),
  "iPhone SE (3ª geração)": colors([
    ["Meia-noite", "#313338", "iphone-se-midnight-select-202203"],
    ["Estelar", "#eee8dd", "iphone-se-starlight-select-202203"],
    ["Vermelho", "#c8252c", "iphone-se-red-select-202203"],
  ]),
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
