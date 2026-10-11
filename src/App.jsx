
import { lazy, Suspense, useCallback, useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Intro from "./components/Intro";
import Footer from "./components/Footer";
import WhatsAppButton from "./components/WhatsAppButton";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";
import useSmoothScroll from "./useSmoothScroll";
import "./styles/main.scss";
import "./styles/page.scss";

// These pages download only when someone opens them.
const Shop = lazy(() => import("./pages/Shop"));
const Product = lazy(() => import("./pages/Product"));
const NotFound = lazy(() => import("./pages/NotFound"));

const INTRO_KEY = "zanah-intro-seen";

export default function App() {
  const { pathname } = useLocation();

  // The intro plays once per visit, and only when the visitor lands on the home page.
 
  const [showIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(!showIntro);

  const finishIntro = useCallback(() => {
    sessionStorage.setItem(INTRO_KEY, "1");
    setIntroComplete(true);
  }, []);

  useSmoothScroll(introComplete);

  return (
    <>
      {showIntro && <Intro onComplete={finishIntro} />}

      <ScrollToTop />
      <Navbar />

      <main>
        <Suspense fallback={<div className="page-fallback" />}>
          <Routes>
            <Route path="/" element={<Home introComplete={introComplete} />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Footer />
      <WhatsAppButton />
    </>
  );
}