import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogoMark } from "../../components/icons";
import { usePageTitle } from "../../components/ui";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

export default function AdminLogin() {
  usePageTitle("Login — BiolNexo Admin");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user?.email?.toLowerCase() === "biolnexo@gmail.com") navigate("/admin", { replace: true });
    });
  }, [navigate]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim().toLowerCase();
    if (clean !== "biolnexo@gmail.com") {
      setErr("Solo biolnexo@gmail.com puede entrar (editor único).");
      return;
    }
    if (!isSupabaseConfigured || !supabase) {
      localStorage.setItem("biolnexo_admin", "biolnexo@gmail.com");
      navigate("/admin", { replace: true });
      return;
    }
    setLoading(true);
    setErr("");
    const siteUrl = (import.meta as unknown as { env: Record<string, string | undefined> }).env.VITE_SITE_URL || "https://biolnexo.vercel.app";
    const redirectTo = siteUrl.endsWith("/admin") ? siteUrl : `${siteUrl.replace(/\/$/, "")}/admin`;
    const { error } = await supabase.auth.signInWithOtp({
      email: clean,
      options: { emailRedirectTo: redirectTo },
    });
    setLoading(false);
    if (error) setErr(error.message);
    else setSent(true);
  };

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-line rounded-2xl p-8 shadow-xl">
        <Link to="/" className="flex items-center gap-2 justify-center">
          <LogoMark className="w-8 h-8" />
          <span className="font-display font-bold">Biol<span className="text-primary">Nexo</span> Admin</span>
        </Link>
        <h1 className="mt-6 font-display font-bold text-2xl text-center text-ink">Acceso editor</h1>
        <p className="mt-2 font-mono text-[12px] text-muted text-center">Solo editor autorizado — magic-link</p>
        {sent ? (
          <div className="mt-6 rounded-xl bg-bio-soft border border-bio/20 p-4 text-center">
            <p className="font-display font-semibold text-bio">Revisa tu correo</p>
            <p className="font-mono text-[12px] text-inksoft mt-1">Te enviamos un magic-link a <span className="font-bold">biolnexo@gmail.com</span>. Ábrelo en este mismo navegador.</p>
            <p className="font-mono text-[11px] text-muted mt-3">Si no llega, revisa spam o usa el mock local sin Supabase.</p>
            <button onClick={() => setSent(false)} className="mt-3 font-mono text-[11px] text-primary hover:underline">Volver</button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="biolnexo@gmail.com" className="mt-2 w-full bg-white border border-line rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary" />
              {err && <p className="mt-2 font-mono text-[11px] text-warn">{err}</p>}
            </div>
            <button type="submit" disabled={loading} className="w-full bg-navy text-white rounded-full py-3 font-semibold hover:bg-primary transition-colors disabled:opacity-50">
              {loading ? "Enviando..." : isSupabaseConfigured ? "Enviar magic-link" : "Entrar (mock local)"}
            </button>
            <p className="font-mono text-[11px] text-muted text-center">{isSupabaseConfigured ? "Supabase Auth: recibirás un link por email." : "Sin Supabase: entra directo (dev). Configura VITE_SUPABASE_* para magic-link real."}</p>
          </form>
        )}
        <Link to="/" className="mt-4 block text-center font-mono text-[11px] text-primary hover:underline">← Volver a la web</Link>
      </div>
    </main>
  );
}
