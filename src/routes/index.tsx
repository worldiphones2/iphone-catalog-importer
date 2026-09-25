import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import {
  ArrowDown,
  ArrowUpRight,
  BatteryCharging,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Flame,
  Headphones,
  Menu,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";

import heroImage from "@/assets/world-iphones-hero.jpg";
import lineupImage from "@/assets/world-iphones-lineup.jpg";
import iphone17CatalogImage from "@/assets/iphone-17-catalog.webp";
import { listPublicProducts, type PublicProduct } from "@/lib/products.functions";
import { formatPrice } from "@/lib/format";
import { getOfficialVariants } from "@/lib/product-images";
import { supabase } from "@/integrations/supabase/client";

const productsQuery = queryOptions({
  queryKey: ["public-products"],
  queryFn: () => listPublicProducts(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery),
  errorComponent: () => (
    <main className="grid min-h-screen place-items-center bg-background px-6 text-center text-foreground">
      <p className="text-sm text-muted-foreground">
        Não foi possível carregar o catálogo agora. Tente novamente em instantes.
      </p>
    </main>
  ),
  notFoundComponent: () => (
    <main className="grid min-h-screen place-items-center bg-background text-foreground">
      <p className="text-sm text-muted-foreground">Página não encontrada.</p>
    </main>
  ),
  head: () => ({
    meta: [
      { title: "World iPhones | Catálogo de iPhones" },
      {
        name: "description",
        content:
          "Encontre seu próximo iPhone na World iPhones. Aparelhos selecionados, compra segura e atendimento personalizado.",
      },
      { property: "og:title", content: "World iPhones | Seu próximo iPhone" },
      {
        property: "og:description",
        content: "Catálogo de iPhones selecionados com atendimento próximo e compra segura.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PHONE_NUMBER = "5547992533977";
const whatsapp = (message: string) =>
  `https://wa.me/${PHONE_NUMBER}?text=${encodeURIComponent(message)}`;


const faqs = [
  {
    q: "Os aparelhos são novos ou seminovos?",
    a: "Trabalhamos com aparelhos novos e seminovos selecionados. A condição de cada iPhone é informada com clareza no atendimento.",
  },
  {
    q: "Quais formas de pagamento estão disponíveis?",
    a: "Aceitamos Pix e cartão. As condições e opções de parcelamento são confirmadas no momento da compra.",
  },
  {
    q: "Vocês realizam envios?",
    a: "Sim. Consulte nossa equipe para confirmar prazo, valor e disponibilidade de entrega para a sua região.",
  },
  {
    q: "Como faço para comprar?",
    a: "Escolha um modelo do catálogo e fale conosco pelo WhatsApp. Nossa equipe confirma os detalhes e acompanha você até a entrega.",
  },
];

function Logo() {
  return (
    <a href="#inicio" className="flex items-center gap-3" aria-label="World iPhones, início">
      <span className="grid size-7 place-items-center rounded-full border border-brand/50 text-[10px] font-semibold text-brand">
        W
      </span>
      <span className="text-sm font-semibold uppercase tracking-[0.24em] text-foreground">
        World <span className="font-normal text-muted-foreground">iPhones</span>
      </span>
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const links = [
    ["Início", "#inicio"],
    ["Catálogo", "#catalogo"],
    ["Diferenciais", "#diferenciais"],
    ["Como funciona", "#como-funciona"],
    ["Dúvidas", "#duvidas"],
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/85 backdrop-blur-xl">
      <div className="page-shell flex h-20 items-center justify-between">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex" aria-label="Navegação principal">
          {links.map(([label, href]) => (
            <a key={href} className="nav-link" href={href}>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="button button-outline hidden lg:inline-flex"
          href={whatsapp("Olá! Quero conhecer os iPhones disponíveis na World iPhones.")}
          target="_blank"
          rel="noreferrer"
        >
          Falar no WhatsApp
          <ArrowUpRight size={15} />
        </a>
        <button
          type="button"
          className="icon-button lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      {open && (
        <nav className="page-shell flex flex-col border-t border-border py-4 lg:hidden" aria-label="Navegação móvel">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="py-3 text-sm text-muted-foreground" onClick={() => setOpen(false)}>
              {label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function PhoneVisual({ tone }: { tone: string }) {
  return (
    <div className={`phone-visual phone-${tone}`} aria-hidden="true">
      <div className="phone-screen">
        <span className="dynamic-island" />
        <span className="screen-halo" />
      </div>
      <div className="camera-cluster">
        <span /><span /><span /><i />
      </div>
    </div>
  );
}

function StockMeter({ quantity }: { quantity: number }) {
  const max = 8;
  const filled = Math.min(Math.max(quantity, 0), max);
  const percent = Math.round((filled / max) * 100);
  const soldOut = quantity <= 0;
  const critical = quantity > 0 && quantity <= 2;

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className={critical || soldOut ? "font-medium text-brand" : "text-muted-foreground"}>
          {soldOut
            ? "Esgotado — entre na lista de espera"
            : quantity === 1
              ? "Última unidade disponível"
              : critical
                ? `Apenas ${quantity} unidades restantes`
                : `${quantity} unidades disponíveis`}
        </span>
        <span className="tabular-nums text-muted-foreground">{Math.max(quantity, 0)} em estoque</span>
      </div>
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-border">
        <span
          className="block h-full rounded-full bg-brand transition-[width] duration-500"
          style={{ width: `${soldOut ? 4 : Math.max(percent, 12)}%` }}
        />
      </div>
    </div>
  );
}

function ProductCard({ product, index }: { product: PublicProduct; index: number }) {
  const variants: ReturnType<typeof getOfficialVariants> = [];
  const useOfficialGallery = false;
  const [colorIndex] = useState(0);
  const [imageIndex] = useState(0);
  const activeVariant = variants[colorIndex] ?? variants[0];
  const activeImages: string[] = [];
  const activeImage: string | null = null;
  const hasDiscount =
    product.is_on_sale && !!product.compare_at_price && product.compare_at_price > product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.price / (product.compare_at_price as number)) * 100)
    : 0;
  const soldOut = product.stock_quantity <= 0;

  return (
    <article className="product-card">
      <div className="flex items-center justify-between gap-3 px-5 pt-5">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <span className="product-badge">{product.badge}</span>
          {hasDiscount && (
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-brand px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-background">
              <Flame size={12} /> -{discount}%
            </span>
          )}
        </div>
        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <div className="product-stage relative">
        {activeImage ? (
          <img
            src={activeImage}
            alt={`${product.name} ${activeVariant?.name ?? product.capacity} — vista ${imageIndex + 1}`}
            className={`size-full object-contain p-5 ${useOfficialGallery ? `product-phone-image product-phone-image-${imageIndex + 1}` : ""}`}
            loading="lazy"
          />
        ) : (
          <PhoneVisual tone={product.tone} />
        )}
        {activeImages.length > 1 && (
          <>
            <button
              type="button"
              className="gallery-arrow left-3"
              aria-label="Foto anterior"
              onClick={() => setImageIndex((current) => (current - 1 + activeImages.length) % activeImages.length)}
            >
              <ChevronLeft size={17} />
            </button>
            <button
              type="button"
              className="gallery-arrow right-3"
              aria-label="Próxima foto"
              onClick={() => setImageIndex((current) => (current + 1) % activeImages.length)}
            >
              <ChevronRight size={17} />
            </button>
            <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5" aria-label="Vistas do produto">
              {activeImages.map((_, viewIndex) => (
                <button
                  key={viewIndex}
                  type="button"
                  className={`gallery-dot ${viewIndex === imageIndex ? "gallery-dot-active" : ""}`}
                  aria-label={`Ver foto ${viewIndex + 1}`}
                  onClick={() => setImageIndex(viewIndex)}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="border-t border-border p-5 sm:p-6">
        <p className="mb-2 text-xs uppercase tracking-[0.18em] text-brand">{product.condition}</p>
        <h3 className="text-2xl font-medium text-foreground">{product.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{product.capacity}</p>
        {variants.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-muted-foreground">
              Cor: <span className="text-foreground">{activeVariant?.name}</span>
            </p>
            <div className="mt-2 flex flex-wrap gap-2" aria-label={`Escolher cor do ${product.name}`}>
              {variants.map((variant, variantIndex) => (
                <button
                  key={`${variant.name}-${variantIndex}`}
                  type="button"
                  className={`color-swatch ${variantIndex === colorIndex ? "color-swatch-active" : ""}`}
                  style={{ "--swatch-color": variant.color } as CSSProperties}
                  aria-label={variant.name}
                  title={variant.name}
                  onClick={() => {
                    setColorIndex(variantIndex);
                    setImageIndex(0);
                  }}
                />
              ))}
            </div>
          </div>
        )}
        <StockMeter quantity={product.stock_quantity} />
        <div className="mt-6 flex items-end justify-between gap-4 border-t border-border pt-5">
          <div>
            {hasDiscount ? (
              <p className="text-xs text-muted-foreground line-through">
                {formatPrice(product.compare_at_price as number)}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">A partir de</p>
            )}
            <p className="mt-1 text-xl font-semibold text-foreground">{formatPrice(product.price)}</p>
            <p className="mt-1 text-xs text-muted-foreground">{product.installment}</p>
          </div>
          <a
            className="icon-button shrink-0"
            aria-label={`Consultar ${product.name} pelo WhatsApp`}
            href={whatsapp(
              soldOut
                ? `Olá! Quero avisos quando o ${product.name} ${product.capacity} voltar ao estoque.`
                : `Olá! Quero garantir o ${product.name} ${product.capacity} por ${formatPrice(product.price)}.`,
            )}
            target="_blank"
            rel="noreferrer"
          >
            <ArrowUpRight size={19} />
          </a>
        </div>
      </div>
    </article>
  );
}

function Index() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("products-public")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, () => {
        queryClient.invalidateQueries({ queryKey: ["public-products"] });
      })
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return (
    <main className="overflow-hidden bg-background text-foreground">
      <Header />

      <section id="inicio" className="relative min-h-[760px] border-b border-border pt-20">
        <img
          src={heroImage}
          alt="iPhone em titânio preto visto de perto"
          className="absolute inset-0 size-full object-cover object-[67%_center]"
          width={1600}
          height={1000}
        />
        <div className="hero-overlay absolute inset-0" />
        <div className="page-shell relative flex min-h-[680px] items-center py-20">
          <div className="max-w-3xl animate-rise">
            <p className="eyebrow">World iPhones</p>
            <h1 className="mt-7 max-w-3xl text-5xl font-light leading-[1.04] sm:text-6xl lg:text-7xl">
              Seu próximo iPhone começa com uma escolha de confiança.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Tecnologia, procedência e atendimento próximo para você encontrar o iPhone que combina com o seu momento.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <a className="button button-primary" href="#catalogo">
                Ver catálogo <ArrowDown size={16} />
              </a>
              <a
                className="button button-outline"
                href={whatsapp("Olá! Quero ajuda para escolher meu próximo iPhone.")}
                target="_blank"
                rel="noreferrer"
              >
                Falar com especialista
              </a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-6 hidden items-center gap-3 text-xs uppercase tracking-[0.2em] text-muted-foreground md:flex lg:right-12">
          <span className="h-px w-16 bg-border" /> Seleção premium
        </div>
      </section>

      <section id="catalogo" className="section-pad border-b border-border">
        <div className="page-shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catálogo</p>
              <h2 className="mt-5 text-4xl font-light sm:text-5xl">Todos os iPhones, preços abaixo da média.</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              Estoque limitado e atualizado em tempo real. Os modelos em oferta saem rápido — confirme a
              disponibilidade antes que a última unidade acabe.
            </p>
          </div>
          <div className="mt-14 grid gap-4 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
          {products.length === 0 && (
            <p className="mt-14 text-sm text-muted-foreground">
              Novos modelos chegando. Fale com a nossa equipe para conhecer as opções disponíveis.
            </p>
          )}
          <p className="mt-5 text-xs text-muted-foreground">
            Valores ilustrativos e sujeitos à disponibilidade. Confirme a oferta atual pelo WhatsApp.
          </p>
        </div>
      </section>

      <section id="diferenciais" className="section-pad border-b border-border">
        <div className="page-shell grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-24">
          <div>
            <p className="eyebrow">Por que a World iPhones?</p>
            <h2 className="mt-5 text-4xl font-light leading-tight sm:text-5xl">
              Muito além de um aparelho.
            </h2>
            <p className="mt-6 max-w-md leading-7 text-muted-foreground">
              Sua compra merece informação clara, atenção aos detalhes e tranquilidade em cada etapa.
            </p>
          </div>
          <div className="grid gap-px bg-border sm:grid-cols-2">
            {[
              [ShieldCheck, "Confiança", "Procedência e transparência para você decidir com segurança."],
              [Sparkles, "Qualidade", "Aparelhos selecionados com cuidado e critérios claros."],
              [Headphones, "Atendimento", "Conversa próxima para encontrar a escolha certa para você."],
              [BatteryCharging, "Custo-benefício", "Opções que equilibram tecnologia, condição e investimento."],
            ].map(([Icon, title, text]) => {
              const ItemIcon = Icon as typeof ShieldCheck;
              return (
                <article key={title as string} className="bg-background p-7 sm:p-9">
                  <ItemIcon size={22} strokeWidth={1.4} className="text-brand" />
                  <h3 className="mt-8 text-lg font-medium">{title as string}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{text as string}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="grid min-h-[650px] lg:grid-cols-2">
          <div className="relative min-h-[420px] overflow-hidden border-b border-border lg:min-h-full lg:border-b-0 lg:border-r">
            <img
              src={lineupImage}
              alt="Linha de iPhones em titânio, preto e azul"
              className="absolute inset-0 size-full object-cover"
              loading="lazy"
              width={1200}
              height={1200}
            />
          </div>
          <div className="flex items-center px-6 py-20 sm:px-12 lg:px-20">
            <div className="max-w-lg">
              <p className="eyebrow">Tecnologia que combina com você</p>
              <h2 className="mt-6 text-4xl font-light leading-tight sm:text-5xl">
                O iPhone certo para a sua rotina.
              </h2>
              <p className="mt-7 leading-7 text-muted-foreground">
                Desempenho, câmera, bateria ou tamanho: conte o que importa para você e receba uma recomendação sem complicação.
              </p>
              <a
                className="button button-primary mt-10"
                href={whatsapp("Olá! Quero uma recomendação de iPhone para a minha rotina.")}
                target="_blank"
                rel="noreferrer"
              >
                Receber recomendação <ArrowUpRight size={16} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="section-pad border-b border-border">
        <div className="page-shell">
          <p className="eyebrow">Como funciona</p>
          <h2 className="mt-5 text-4xl font-light sm:text-5xl">Simples do início ao fim.</h2>
          <div className="process-line mt-16 grid gap-10 md:grid-cols-3">
            {[
              ["01", "Escolha", "Explore os modelos e encontre seus favoritos."],
              ["02", "Converse", "Chame nossa equipe e tire todas as suas dúvidas."],
              ["03", "Receba", "Confirme sua compra e acompanhe cada etapa com tranquilidade."],
            ].map(([number, title, text]) => (
              <article key={number} className="relative pt-7">
                <span className="process-dot" />
                <span className="text-xs tracking-[0.24em] text-brand">{number}</span>
                <h3 className="mt-6 text-xl font-medium">{title}</h3>
                <p className="mt-3 max-w-sm text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad border-b border-border">
        <div className="page-shell">
          <p className="eyebrow">Quem compra, recomenda</p>
          <div className="mt-12 grid gap-4 md:grid-cols-3">
            {[
              ["“Atendimento excelente. Tiraram todas as minhas dúvidas e o aparelho chegou impecável.”", "Marina S."],
              ["“Compra tranquila do início ao fim. Já indiquei a World iPhones para meus amigos.”", "Gabriel M."],
              ["“Consegui escolher o modelo certo sem gastar além do que precisava.”", "André L."],
            ].map(([quote, name]) => (
              <figure key={name} className="testimonial">
                <div className="flex gap-1 text-brand" aria-label="5 estrelas">
                  {[1, 2, 3, 4, 5].map((star) => <span key={star}>★</span>)}
                </div>
                <blockquote className="mt-7 text-lg leading-8 text-foreground">{quote}</blockquote>
                <figcaption className="mt-9 flex items-center gap-3 border-t border-border pt-5 text-sm text-muted-foreground">
                  <span className="grid size-8 place-items-center rounded-full border border-border text-xs text-brand">{name?.charAt(0)}</span>
                  {name} <Check size={14} className="text-brand" />
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section id="duvidas" className="section-pad border-b border-border">
        <div className="page-shell grid gap-14 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24">
          <div>
            <p className="eyebrow">Dúvidas</p>
            <h2 className="mt-5 text-4xl font-light sm:text-5xl">Perguntas frequentes.</h2>
          </div>
          <div className="border-t border-border">
            {faqs.map((faq) => (
              <details key={faq.q} className="faq-item group">
                <summary>
                  <span>{faq.q}</span>
                  <ChevronDown size={18} className="shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p>{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad text-center">
        <div className="page-shell">
          <PackageCheck size={28} strokeWidth={1.3} className="mx-auto text-brand" />
          <h2 className="mx-auto mt-7 max-w-3xl text-4xl font-light leading-tight sm:text-5xl">
            Seu próximo iPhone começa aqui.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-muted-foreground">
            Fale com a World iPhones e descubra as opções disponíveis para você.
          </p>
          <a
            className="button button-primary mt-9"
            href={whatsapp("Olá! Quero comprar meu próximo iPhone com a World iPhones.")}
            target="_blank"
            rel="noreferrer"
          >
            Falar com um especialista <ArrowUpRight size={16} />
          </a>
        </div>
      </section>

      <footer className="border-t border-border py-9">
        <div className="page-shell flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <Logo />
          <p className="text-xs text-muted-foreground">© 2026 World iPhones. Todos os direitos reservados.</p>
        </div>
      </footer>
    </main>
  );
}