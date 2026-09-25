import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Eye, EyeOff, Loader2, Plus, Save, Trash2, Upload } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/format";
import { parseImageVariants, type ProductImageVariant } from "@/lib/product-images";

export const Route = createFileRoute("/_authenticated/painel")({
  head: () => ({
    meta: [
      { title: "Painel do catálogo | World iPhones" },
      {
        name: "description",
        content: "Atualize produtos, preços e fotos do catálogo da World iPhones em tempo real.",
      },
      { property: "og:title", content: "Painel do catálogo | World iPhones" },
      {
        property: "og:description",
        content: "Gerencie o catálogo da World iPhones sem recarregar o site.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PainelPage,
});

type Product = {
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
  is_published: boolean;
  sort_order: number;
};

const TONES = [
  ["titanium", "Titânio"],
  ["graphite", "Preto"],
  ["blue", "Azul"],
] as const;

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 5;

function PainelPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      const { data: allowed } = await supabase.rpc("has_role", {
        _user_id: data.user.id,
        _role: "admin",
      });
      setIsAdmin(Boolean(allowed));
    });
  }, []);

  const products = useQuery({
    queryKey: ["admin-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((row) => ({
        ...row,
        price: Number(row.price),
        compare_at_price: row.compare_at_price === null ? null : Number(row.compare_at_price),
        image_variants: parseImageVariants(row.image_variants),
      })) as Product[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("products-admin")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        queryClient.invalidateQueries({ queryKey: ["admin-products"] });
        queryClient.invalidateQueries({ queryKey: ["public-products"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createProduct = useMutation({
    mutationFn: async () => {
      const nextOrder = (products.data?.length ?? 0) + 1;
      const { error } = await supabase.from("products").insert({
        name: "Novo iPhone",
        capacity: "128 GB",
        condition: "Novo • Lacrado",
        badge: "Novidade",
        price: 0,
        installment: "",
        tone: "graphite",
        sort_order: nextOrder,
        is_published: false,
      });
      if (error) throw error;
    },
    onSuccess: () => toast.success("Produto criado. Preencha os dados e salve."),
    onError: () => toast.error("Não foi possível criar o produto."),
  });

  const signOut = async () => {
    await supabase.auth.signOut();
    queryClient.clear();
    navigate({ to: "/auth" });
  };

  if (isAdmin === false) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
        <div className="max-w-md">
          <h1 className="text-3xl font-light">Acesso não liberado</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            Sua conta não tem permissão para editar o catálogo. Fale com o responsável da loja.
          </p>
          <button className="button button-outline mt-8" onClick={signOut}>
            Sair
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-24 text-foreground">
      <header className="border-b border-border">
        <div className="page-shell flex h-20 items-center justify-between gap-4">
          <div>
            <p className="eyebrow">World iPhones</p>
            <h1 className="mt-1 text-lg font-medium">Painel do catálogo</h1>
          </div>
          <div className="flex items-center gap-2">
            <a className="button button-outline" href="/" target="_blank" rel="noreferrer">
              Ver site <ArrowUpRight size={15} />
            </a>
            <button className="button button-outline" onClick={signOut}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <section className="page-shell pt-12">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-light">Produtos</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              As alterações aparecem no site na hora, sem recarregar a página.
            </p>
          </div>
          <button
            className="button button-primary"
            onClick={() => createProduct.mutate()}
            disabled={createProduct.isPending}
          >
            <Plus size={16} /> Novo produto
          </button>
        </div>

        {products.isLoading && (
          <p className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 size={16} className="animate-spin" /> Carregando produtos...
          </p>
        )}

        <div className="mt-10 grid gap-4">
          {products.data?.map((product) => (
            <ProductEditor key={product.id} product={product} />
          ))}
        </div>

        {products.data?.length === 0 && (
          <p className="mt-10 text-sm text-muted-foreground">
            Nenhum produto ainda. Crie o primeiro com o botão acima.
          </p>
        )}
      </section>
    </main>
  );
}

function ProductEditor({ product }: { product: Product }) {
  const queryClient = useQueryClient();
  const fileInput = useRef<HTMLInputElement>(null);
  const [draft, setDraft] = useState(product);
  const [uploading, setUploading] = useState(false);
  const [variantsText, setVariantsText] = useState(() => JSON.stringify(product.image_variants, null, 2));

  useEffect(() => {
    setDraft(product);
    setVariantsText(JSON.stringify(product.image_variants, null, 2));
  }, [product]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });
    queryClient.invalidateQueries({ queryKey: ["public-products"] });
  };

  const save = useMutation({
    mutationFn: async (values: Partial<Product>) => {
      const { error } = await supabase.from("products").update(values).eq("id", product.id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Alterações salvas.");
    },
    onError: () => toast.error("Não foi possível salvar."),
  });

  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      toast.success("Produto removido.");
    },
    onError: () => toast.error("Não foi possível remover."),
  });

  const uploadPhoto = async (file: File) => {
    setUploading(true);
    try {
      const path = `${product.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const { error: uploadError } = await supabase.storage
        .from("product-photos")
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data, error } = await supabase.storage
        .from("product-photos")
        .createSignedUrl(path, SIGNED_URL_TTL);
      if (error || !data) throw error ?? new Error("sem url");

      await save.mutateAsync({ image_url: data.signedUrl });
      setDraft((prev) => ({ ...prev, image_url: data.signedUrl }));
    } catch {
      toast.error("Não foi possível enviar a foto.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <article className="border border-border bg-card p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        <div>
          <div className="grid h-52 place-items-center overflow-hidden border border-border bg-accent">
            {draft.image_url ? (
              <img
                src={draft.image_url}
                alt={draft.name}
                className="size-full object-cover"
                loading="lazy"
              />
            ) : (
              <span className="px-4 text-center text-xs text-muted-foreground">
                Sem foto — o desenho padrão será exibido
              </span>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadPhoto(file);
              event.target.value = "";
            }}
          />
          <button
            className="button button-outline mt-3 w-full"
            onClick={() => fileInput.current?.click()}
            disabled={uploading}
          >
            {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            {uploading ? "Enviando..." : "Trocar foto"}
          </button>
          {draft.image_url && (
            <button
              className="mt-3 w-full text-xs text-muted-foreground underline"
              onClick={() => {
                setDraft((prev) => ({ ...prev, image_url: null }));
                save.mutate({ image_url: null });
              }}
            >
              Remover foto
            </button>
          )}
        </div>

        <div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Modelo">
              <input
                className="field"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
            </Field>
            <Field label="Capacidade">
              <input
                className="field"
                value={draft.capacity}
                onChange={(e) => setDraft({ ...draft, capacity: e.target.value })}
              />
            </Field>
            <Field label="Condição">
              <input
                className="field"
                value={draft.condition}
                onChange={(e) => setDraft({ ...draft, condition: e.target.value })}
              />
            </Field>
            <Field label="Selo">
              <input
                className="field"
                value={draft.badge}
                onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
              />
            </Field>
            <Field label={`Preço (${formatPrice(draft.price || 0)})`}>
              <input
                className="field"
                type="number"
                min={0}
                step="0.01"
                value={draft.price}
                onChange={(e) => setDraft({ ...draft, price: Number(e.target.value) })}
              />
            </Field>
            <Field label="Parcelamento">
              <input
                className="field"
                value={draft.installment}
                onChange={(e) => setDraft({ ...draft, installment: e.target.value })}
              />
            </Field>
            <Field label="Cor do desenho">
              <select
                className="field"
                value={draft.tone}
                onChange={(e) => setDraft({ ...draft, tone: e.target.value })}
              >
                {TONES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Ordem no catálogo">
              <input
                className="field"
                type="number"
                value={draft.sort_order}
                onChange={(e) => setDraft({ ...draft, sort_order: Number(e.target.value) })}
              />
            </Field>
            <Field label="Quantidade em estoque">
              <input
                className="field"
                type="number"
                min={0}
                value={draft.stock_quantity}
                onChange={(e) => setDraft({ ...draft, stock_quantity: Number(e.target.value) })}
              />
            </Field>
            <Field
              label={`Preço antigo (riscado)${
                draft.compare_at_price ? ` — ${formatPrice(draft.compare_at_price)}` : ""
              }`}
            >
              <input
                className="field"
                type="number"
                min={0}
                step="0.01"
                value={draft.compare_at_price ?? ""}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    compare_at_price: e.target.value === "" ? null : Number(e.target.value),
                  })
                }
              />
            </Field>
            <label className="flex items-center gap-3 text-xs uppercase tracking-[0.14em] text-muted-foreground sm:col-span-2">
              <input
                type="checkbox"
                className="size-4 accent-[var(--brand)]"
                checked={draft.is_on_sale}
                onChange={(e) => setDraft({ ...draft, is_on_sale: e.target.checked })}
              />
              Marcar como oferta (mostra selo de desconto no site)
            </label>
            <Field label="Fotos por cor (nome, cor e 3 endereços de imagem)">
              <textarea
                className="field min-h-40 font-mono text-xs"
                value={variantsText}
                onChange={(event) => setVariantsText(event.target.value)}
                spellCheck={false}
              />
            </Field>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 border-t border-border pt-5">
            <button
              className="button button-primary"
              onClick={() => {
                let imageVariants: ProductImageVariant[];
                try {
                  imageVariants = parseImageVariants(JSON.parse(variantsText));
                } catch {
                  toast.error("Confira o formato das fotos por cor.");
                  return;
                }
                save.mutate({
                  name: draft.name,
                  capacity: draft.capacity,
                  condition: draft.condition,
                  badge: draft.badge,
                  price: draft.price,
                  compare_at_price: draft.compare_at_price,
                  is_on_sale: draft.is_on_sale,
                  stock_quantity: draft.stock_quantity,
                  installment: draft.installment,
                  tone: draft.tone,
                  sort_order: draft.sort_order,
                  image_variants: imageVariants,
                })
              }}
              disabled={save.isPending}
            >
              <Save size={16} /> Salvar
            </button>
            <button
              className="button button-outline"
              onClick={() => save.mutate({ is_published: !draft.is_published })}
            >
              {draft.is_published ? <EyeOff size={16} /> : <Eye size={16} />}
              {draft.is_published ? "Ocultar do site" : "Publicar no site"}
            </button>
            <span className="text-xs text-muted-foreground">
              {draft.is_published ? "Visível no site" : "Rascunho"}
            </span>
            <button
              className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
              onClick={() => {
                if (confirm(`Remover ${draft.name} do catálogo?`)) remove.mutate();
              }}
            >
              <Trash2 size={15} /> Remover
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
      {label}
      {children}
    </label>
  );
}
