
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ResponsiveImage from "./ResponsiveImage";
import { HERO_WIDTHS, HERO_SIZES } from "../utils/image";
import "./Hero.scss";

gsap.registerPlugin(ScrollTrigger);
// Ignore mobile address-bar resizes (prevents jumps while scrolling on phones).
ScrollTrigger.config({ ignoreMobileResize: true });

// Replace with your own brand photo: a base path like "/images/hero" (see scripts/optimize-images.mjs).
const MAIN_IMAGE = "/images/hero";;

/**
 * Photo box rectangles, in % of the hero.
 * start  = where the photo first appears (centered)
 * settle = where it rests beside the text
 * Keep these in sync with the CSS "settle" values in Hero.scss.
 */
const LAYOUTS = {
  desktop: {
    start: { l: 29.5, r: 29.5, t: 4, b: 5 },
    settle: { l: 55, r: 4, t: 4, b: 5 },
  },
  tablet: {
    start: { l: 30.5, r: 30.5, t: 4, b: 5 },
    settle: { l: 58, r: 3, t: 4, b: 5 },
  },
  mobile: {
    start: { l: 14, r: 14, t: 26, b: 26 },
    settle: { l: 14, r: 14, t: 48, b: 4 },
  },
};

const ARCH = 400; // big radius => the top always becomes a clean arch
const clip = ({ t, r, b, l }, radius = ARCH) =>
  `inset(${t}% ${r}% ${b}% ${l}% round ${radius}px ${radius}px 0px 0px)`;
const FULL = { t: 0, r: 0, b: 0, l: 0 };

const reducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function Hero({ introComplete = true }) {
  const heroRef = useRef(null);

  /* ---------- 1. Scroll story (built on mount, so nothing jumps after the intro) ---------- */
  useLayoutEffect(() => {
    const section = heroRef.current;
    if (!section || reducedMotion()) return;

    const q = (s) => section.querySelector(s);
    const qa = (s) => section.querySelectorAll(s);
    const navbar = document.querySelector(".navbar");

    const mm = gsap.matchMedia();

    mm.add(
      {
        desktop: "(min-width: 901px)",
        tablet: "(min-width: 601px) and (max-width: 900px)",
        mobile: "(max-width: 600px)",
        // Phones held sideways are too short for a pinned story: show the plain layout.
        short: "(max-height: 520px) and (orientation: landscape)",
      },
      (context) => {
        const { mobile, tablet, short } = context.conditions;
        if (short) return;
        const { start, settle } =
          LAYOUTS[mobile ? "mobile" : tablet ? "tablet" : "desktop"];

        const frame = q(".zanah-hero__frame");
        const photo = q(".zanah-hero__photo");

        const W = () => section.offsetWidth;
        const H = () => section.offsetHeight;

        // Photo box starts centered (CSS holds the settled layout as the fallback).
        gsap.set(photo, {
          top: `${start.t}%`,
          bottom: `${start.b}%`,
          left: `${start.l}%`,
          right: `${start.r}%`,
        });
        gsap.set(frame, { opacity: 0, y: 50 }); // revealed by the entrance below

        // Slide distance, and the move/scale that makes the photo cover the whole hero.
        const dx = () => ((settle.l - start.l) / 100) * W();
        const dy = () => ((settle.t - start.t) / 100) * H();
        const boxW = () => ((100 - start.l - start.r) / 100) * W();
        const boxH = () => ((100 - start.t - start.b) / 100) * H();
        const endX = () => W() / 2 - ((start.l + 100 - start.r) / 200) * W();
        const endY = () => H() / 2 - ((start.t + 100 - start.b) / 200) * H();
        const cover = () => Math.max(W() / boxW(), H() / boxH());

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: section,
            start: () => `top top+=${navbar?.offsetHeight ?? 82}`,
            end: "+=220%",
            pin: true,
            scrub: true, // Lenis already smooths; extra scrub lag feels floaty
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        const move = { duration: 1, ease: "power2.inOut" };

        // Phase 1 (0 → 1.4): photo slides aside, text reveals.
        // The clip window and the photo move by the exact same amount, so they stay in sync.
        tl.to(q(".zanah-hero__cue"), { autoAlpha: 0, duration: 0.15 }, 0)
          .fromTo(
            frame,
            { clipPath: clip(start) },
            { clipPath: clip(settle), ...move },
            0
          )
          .to(photo, { x: dx, y: dy, ...move }, 0)
          .fromTo(
            qa(".zanah-hero__line-inner"),
            { yPercent: 115 },
            { yPercent: 0, duration: 0.5, stagger: 0.12, ease: "power3.out" },
            0.55
          )
          .fromTo(
            q(".zanah-hero__description"),
            { autoAlpha: 0, y: 18 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
            0.95
          )
          .fromTo(
            q(".zanah-hero__actions"),
            { autoAlpha: 0, y: 14 },
            { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" },
            1.1
          )
          // Phase 2 (1.9 → 2.75): text leaves, photo grows to full-bleed.
          .to(
            q(".zanah-hero__content"),
            { y: -70, autoAlpha: 0, duration: 0.5 },
            1.9
          )
          .fromTo(
            frame,
            { clipPath: clip(settle) },
            {
              clipPath: clip(FULL, 0),
              duration: 0.85,
              ease: "power2.inOut",
              immediateRender: false,
            },
            1.9
          )
          .fromTo(
            photo,
            { x: dx, y: dy, scale: 1 },
            {
              x: endX,
              y: endY,
              scale: cover,
              duration: 0.85,
              ease: "power2.inOut",
              immediateRender: false,
            },
            1.9
          );
      }
    );

    // Everything below the hero depends on this pin; recalculate once things settle.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      mm.revert();
    };
  }, []);

  /* ---------- 2. Entrance: after the intro, only the photo appears ---------- */
  useLayoutEffect(() => {
    const section = heroRef.current;
    if (!section || !introComplete || reducedMotion()) return;

    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(".zanah-hero__frame", { opacity: 1, y: 0, duration: 1.4 })
        .fromTo(
          ".zanah-hero__img",
          { scale: 1.2 },
          { scale: 1, duration: 2 },
          0
        )
        .fromTo(
          ".zanah-hero__cue",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.6"
        );
    }, section);

    return () => ctx.revert();
  }, [introComplete]);

  return (
    <section className="zanah-hero" id="home" ref={heroRef}>
      <div className="zanah-hero__content">
        <h1 className="zanah-hero__title">
          <span className="zanah-hero__line">
            <span className="zanah-hero__line-inner">Style that</span>
          </span>
          <span className="zanah-hero__line">
            <span className="zanah-hero__line-inner">
              feels <em>like you.</em>
            </span>
          </span>
        </h1>

        <p className="zanah-hero__description">
          Thoughtful everyday wear.
          <br />
          Made to feel effortlessly your own.
        </p>

        <div className="zanah-hero__actions">
          <a className="zanah-hero__button" href="#collection">
            Explore the collection
          </a>
        </div>
      </div>

      <div className="zanah-hero__frame">
        <div className="zanah-hero__photo">
          <ResponsiveImage
            className="zanah-hero__img"
            src={MAIN_IMAGE}
            alt="ZANAH everyday womenswear"
            widths={HERO_WIDTHS}
            sizes={HERO_SIZES}
            priority
            fade={false}
          />
        </div>
      </div>

      <span className="zanah-hero__cue" aria-hidden="true" />
    </section>
  );
}