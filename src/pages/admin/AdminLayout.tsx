import { useState, useEffect } from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { LogoMark, IconHelix, IconChart, IconFlask, IconTerminal, IconBook, IconGear, IconSearch, IconClose, IconMenu } from "../../components/icons";
import { supabase, isSupabaseConfigured } from "../../lib/supabase";

const nav = [
  { to: "/admin", label: "Dashboard", icon: IconChart, end: true },
  { to: "/admin/borradores", label: "Borradores", icon: IconBook },
  { to: "/admin/articulos", label: "Artículos", icon: IconHelix },
  { to: "/admin/software", label: "Software", icon: IconTerminal },
  { to: "/admin/experimentos", label: "Experimentos", icon: IconFlask },
  { to: "/admin/categorias", label: "Categorías", icon: IconGear },
  { to: "/admin/medios", label: "Medios", icon: IconSearch },
  { to: "/admin/ajustes", label: "Ajustes", icon: IconGear },
];

export default function AdminLayout() {
  const [drawer, setDrawer] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.pathname === "/admin/login";

  useEffect(() => {
    let unsub: (() => void) | undefined;
    const check = async () => {
      if (isLogin) { setChecking(false); return; }
      if (!isSupabaseConfigured || !supabase) {
        const auth = localStorage.getItem("biolnexo_admin");
        if (auth !== "biolnexo@gmail.com") navigate("/admin/login", { replace: true });
        else setEmail(auth);
        setChecking(false);
        return;
      }
      const { data } = await supabase.auth.getSession();
      const sessEmail = data.session?.user?.email?.toLowerCase() || null;
      if (sessEmail === "biolnexo@gmail.com") {
        setEmail(sessEmail);
      } else {
        navigate("/admin/login", { replace: true });
      }
      setChecking(false);
      const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => {
        const em = sess?.user?.email?.toLowerCase() || null;
        if (em === "biolnexo@gmail.com") setEmail(em);
        else if (!isLogin) navigate("/admin/login", { replace: true });
      });
      unsub = () => sub.subscription.unsubscribe();
    };
    check();
    return () => unsub?.();
  }, [location.pathname, isLogin, navigate]);

  if (isLogin) return <Outlet />;
  if (checking) return <div className="min-h-screen bg-paper flex items-center justify-center font-mono text-[12px] text-muted">Verificando acceso...</div>;
  if (!email) return null;

  const logout = async () => {
    if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
    localStorage.removeItem("biolnexo_admin");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-paper flex">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex w-[260px] bg-navy text-white flex-col shrink-0 sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 grid-dots-dark opacity-40" aria-hidden />
        <div className="relative flex flex-col h-full">
          <Link to="/admin" className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
            <LogoMark className="w-8 h-8" />
            <span className="font-display font-bold tracking-tight">Biol<span className="text-aqua">Nexo</span> <span className="font-mono text-[10px] text-aqua/60 ml-1">ADMIN</span></span>
          </Link>
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-hide">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end as boolean}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-display font-medium text-[13.5px] transition-colors ${isActive ? "bg-white text-navy" : "text-[#9db4ca] hover:bg-white/10 hover:text-white"}`
                }
              >
                <Icon className="w-4.5 h-4.5" style={{ width: 18, height: 18 }} />
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-aqua text-navy font-mono font-bold flex items-center justify-center text-[12px]">BL</span>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold truncate">{email}</p>
                <p className="font-mono text-[11px] text-[#7e9ab5]">Editor único</p>
              </div>
            </div>
            <button onClick={logout} className="mt-3 w-full py-2 rounded-full bg-white/10 hover:bg-white hover:text-navy border border-white/15 text-[12px] font-semibold transition-colors">Cerrar sesión</button>
            <Link to="/" className="mt-2 block text-center font-mono text-[11px] text-[#7e9ab5] hover:text-aqua">← Volver a la web</Link>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      <div className={`lg:hidden fixed inset-0 z-40 ${drawer ? "visible" : "invisible"}`} aria-hidden={!drawer}>
        <button className={`absolute inset-0 bg-navy/60 backdrop-blur-sm transition-opacity ${drawer ? "opacity-100" : "opacity-0"}`} onClick={() => setDrawer(false)} aria-label="Cerrar menú" />
        <aside className={`absolute left-0 top-0 bottom-0 w-[280px] bg-navy text-white flex flex-col transition-transform duration-300 ${drawer ? "translate-x-0" : "-translate-x-full"}`}>
          <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
            <span className="font-display font-bold flex items-center gap-2"><LogoMark className="w-7 h-7" />BiolNexo</span>
            <button onClick={() => setDrawer(false)} className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><IconClose className="w-4 h-4" /></button>
          </div>
          <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
            {nav.map(({ to, label, icon: Icon, end }) => (
              <NavLink key={to} to={to} end={end as boolean} onClick={() => setDrawer(false)} className={({ isActive }) => `flex items-center gap-3 px-3 py-3 rounded-xl font-medium ${isActive ? "bg-white text-navy" : "text-[#9db4ca]"}` }>
                <Icon className="w-5 h-5" />{label}
              </NavLink>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="lg:hidden sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-line flex items-center justify-between px-4 py-3">
          <button onClick={() => setDrawer(true)} className="w-9 h-9 rounded-xl border border-line flex items-center justify-center"><IconMenu className="w-5 h-5" /></button>
          <span className="font-display font-bold flex items-center gap-2"><LogoMark className="w-7 h-7" />BiolNexo Admin</span>
          <span className="w-9 h-9" />
        </header>
        <div className="flex-1 bg-paper">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
