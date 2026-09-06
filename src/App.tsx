import { useEffect } from "react";
import { HashRouter, Route, Routes, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import { CienciaHub, TemaPage } from "./pages/Category";
import ArticlePage from "./pages/Article";
import SearchPage from "./pages/Search";
import { DatosPage, ExperimentosPage, InvestigacionPage } from "./pages/Platforms";
import { ContactoPage, NotFoundPage, PrivacidadPage, SobrePage } from "./pages/Static";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-md font-display font-semibold text-sm"
      >
        Saltar al contenido
      </a>
      <Header />
      <div id="contenido">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ciencia" element={<CienciaHub />} />
          <Route path="/tema/:slug" element={<TemaPage />} />
          <Route path="/articulo/:slug" element={<ArticlePage />} />
          <Route path="/busqueda" element={<SearchPage />} />
          <Route path="/experimentos" element={<ExperimentosPage />} />
          <Route path="/datos" element={<DatosPage />} />
          <Route path="/investigacion" element={<InvestigacionPage />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/privacidad" element={<PrivacidadPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
      <Footer />
    </HashRouter>
  );
}
