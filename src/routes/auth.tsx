import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Acesso do lojista | World iPhones" },
      {
        name: "description",
        content: "Entre para gerenciar produtos, preços e fotos do catálogo da World iPhones.",
      },
      { property: "og:title", content: "Acesso do lojista | World iPhones" },
      {
        property: "og:description",
        content: "Área restrita para atualizar o catálogo da World iPhones.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/painel" });
    });
  }, [navigate]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/painel` },
        });
        if (error) throw error;
        if (data.session) navigate({ to: "/painel" });
        else setMessage("Conta criada. Confirme seu e-mail para entrar.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/painel" });
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Não foi possível continuar.");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setMessage(null);
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      setMessage("Não foi possível entrar com o Google.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/painel" });
  };

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-16 text-foreground">
      <div className="w-full max-w-md border border-border bg-card p-8">
        <p className="eyebrow">World iPhones</p>
        <h1 className="mt-4 text-3xl font-light">
          {mode === "login" ? "Entrar no painel" : "Criar acesso"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Área restrita para atualizar produtos, preços e fotos.
        </p>

        <form onSubmit={submit} className="mt-8 flex flex-col gap-4">
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="field"
              autoComplete="email"
            />
          </label>
          <label className="flex flex-col gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Senha
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="field"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
            />
          </label>
          <button type="submit" className="button button-primary mt-2" disabled={loading}>
            {loading ? "Aguarde..." : mode === "login" ? "Entrar" : "Criar acesso"}
          </button>
        </form>

        <button type="button" className="button button-outline mt-3 w-full" onClick={google}>
          Continuar com Google
        </button>

        {message && <p className="mt-5 text-sm text-brand">{message}</p>}

        <button
          type="button"
          className="mt-6 text-xs text-muted-foreground underline"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
        >
          {mode === "login" ? "Ainda não tenho acesso" : "Já tenho acesso"}
        </button>
      </div>
    </main>
  );
}
