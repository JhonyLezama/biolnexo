import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { CienciaHub, TemaPage } from "./pages/Category";
import ArticlePage from "./pages/Article";
import SearchPage from "./pages/Search";
import { DatosPage, ExperimentosPage, InvestigacionPage } from "./pages/Platforms";
import SoftwarePage from "./pages/Software";
import { ContactoPage, NotFoundPage, PrivacidadPage, SobrePage } from "./pages/Static";
import AdminDrafts from "./pages/AdminDrafts";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/Dashboard";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminArticles from "./pages/admin/Articles";
import Placeholder from "./pages/admin/Placeholder";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

function PublicLayout() {
  return (
    <>
      <Header />
      <div id="contenido">
        <Outlet />
      </div>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md font-display font-semibold text-sm"
      >
        Saltar al contenido
      </a>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/ciencia" element={<CienciaHub />} />
          <Route path="/tema/:slug" element={<TemaPage />} />
          <Route path="/articulo/:slug" element={<ArticlePage />} />
          <Route path="/busqueda" element={<SearchPage />} />
          <Route path="/experimentos" element={<ExperimentosPage />} />
          <Route path="/software" element={<SoftwarePage />} />
          <Route path="/datos" element={<DatosPage />} />
          <Route path="/investigacion" element={<InvestigacionPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
        </Route>

        <Route path="/admin/*" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="borradores" element={<AdminDrafts />} />
          <Route path="articulos" element={<AdminArticles />} />
          <Route path="software" element={<Placeholder title="Software" desc="CRUD SoftwareProject con imagen/video + links descarga/repo — Fase 4" />} />
          <Route path="experimentos" element={<Placeholder title="Experimentos" desc="CRUD Experiment con videoUrl — Fase 4" />} />
          <Route path="categorias" element={<Placeholder title="Categorías" desc="4 slugs + LEGACY_SLUG_MAP — Fase 4" />} />
          <Route path="medios" element={<Placeholder title="Medios" desc="URL o archivo a Supabase Storage — Fase 4" />} />
          <Route path="ajustes" element={<Placeholder title="Ajustes" desc="LLM, cron, Supabase, biolnexo@gmail.com — Fase 5" />} />
          <Route path="login" element={<AdminLogin />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
