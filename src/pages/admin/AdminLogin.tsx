import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogoMark } from "../../components/icons";
import { usePageTitle } from "../../components/ui";

export default function AdminLogin() {
  usePageTitle("Login — BiolNexo Admin");
  const [email, setEmail] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim().toLowerCase() !== "biolnexo@gmail.com") {
      setErr("Solo biolnexo@gmail.com puede entrar (editor único).");
      return;
    }
    localStorage.setItem("biolnexo_admin", "biolnexo@gmail.com");
    navigate("/admin", { replace: true });
  };

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-line rounded-2xl p-8 shadow-xl">
        <Link to="/" className="flex items-center gap-2 justify-center">
          <LogoMark className="w-8 h-8" />
          <span className="font-display font-bold">Biol<span className="text-primary">Nexo</span> Admin</span>
        </Link>
        <h1 className="mt-6 font-display font-bold text-2xl text-center text-ink">Acceso editor</h1>
        <p className="mt-2 font-mono text-[12px] text-muted text-center">Solo editor autorizado</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted">Email</label>
            <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="biolnexo@gmail.com" className="mt-2 w-full bg-white border border-line rounded-xl px-4 py-3 text-[14px] outline-none focus:border-primary" />
            {err && <p className="mt-2 font-mono text-[11px] text-warn">{err}</p>}
          </div>
          <button type="submit" className="w-full bg-navy text-white rounded-full py-3 font-semibold hover:bg-primary transition-colors">Entrar</button>
          <p className="font-mono text-[11px] text-muted text-center">Fase 5 real usará magic-link Supabase, este es mock local.</p>
        </form>
        <Link to="/" className="mt-4 block text-center font-mono text-[11px] text-primary hover:underline">← Volver a la web</Link>
      </div>
    </main>
  );
}
