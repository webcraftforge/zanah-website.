
import { useEffect, useRef } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let instance = null;

/** Scroll to the top of the page (works with or without smooth scrolling). */
export const scrollToTop = (immediate = false) => {
  if (instance) instance.scrollTo(0, { immediate, duration: 1.2 });
  else window.scrollTo({ top: 0, behavior: immediate ? "auto" : "smooth" });
};

/** Freeze / release page scrolling (used by pop-ups). */
export const lockScroll = () => {
  if (instance) instance.stop();
  else document.documentElement.style.overflow = "hidden";
};
export const unlockScroll = () => {
  if (instance) instance.start();
  else document.documentElement.style.overflow = "";
};

/**
 * Inertia scrolling synced with GSAP ScrollTrigger.
 * Call once in App: useSmoothScroll(introComplete)
 * Needs: npm i lenis
 */
export default function useSmoothScroll(ready = true) {
  const lenisRef = useRef(null);

  useEffect(() => {
    // Always start at the top; a restored mid-page scroll would break the pinned hero.
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenisRef.current = lenis;
    instance = lenis;
    lenis.stop(); // held until the intro finishes

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // In-page anchor links (e.g. #contact) scroll smoothly and clear the sticky navbar.
    const onClick = (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const hash = link.getAttribute("href");
      if (hash === "#home") {
        e.preventDefault();
        lenis.scrollTo(0, { duration: 1.4 });
        return;
      }
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const navH = document.querySelector(".navbar")?.offsetHeight ?? 0;
      lenis.scrollTo(target, { offset: -navH, duration: 1.4 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisRef.current = null;
      instance = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (ready) lenis.start();
    else lenis.stop();
  }, [ready]);
}