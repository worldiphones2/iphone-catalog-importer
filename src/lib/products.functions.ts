import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { parseImageVariants, type ProductImageVariant } from "@/lib/product-images";

export type PublicProduct = {
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
  image_url: string | null;
  image_variants: ProductImageVariant[];
  tone: string;
};

export const listPublicProducts = createServerFn({ method: "GET" }).handler(
  async (): Promise<PublicProduct[]> => {
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"]!;
    const supabasePublic = createClient<Database>(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      global: {
        fetch: (input, init) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) {
            h.delete("Authorization");
          }
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });

    const { data, error } = await supabasePublic
      .from("products")
      .select(
        "id, name, capacity, condition, badge, price, compare_at_price, is_on_sale, stock_quantity, installment, image_url, image_variants, tone",
      )
      .eq("is_published", true)
      .order("sort_order", { ascending: true });

    if (error) return [];
    return (data ?? []).map((row) => ({
      ...row,
      price: row.name === "iPhone 17 Pro" || row.name === "iPhone 17 Pro Max" ? 8700 : Number(row.price),
      compare_at_price: row.compare_at_price === null ? null : Number(row.compare_at_price),
      image_variants: parseImageVariants(row.image_variants),
    }));
  },
);
