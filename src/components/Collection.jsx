
import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ResponsiveImage from "./ResponsiveImage";
import { products, formatPrice } from "../data/products";
import {
  CARD_WIDTHS,
  CARD_HOME_SIZES,
  MAIN_WIDTHS,
  MAIN_SIZES,
  prefetchImage,
} from "../utils/image";

gsap.registerPlugin(ScrollTrigger);

const featured = products.slice(0, 3);

export default function Collection() {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: "(prefers-reduced-motion: no-preference)",
        parallax: "(prefers-reduced-motion: no-preference) and (min-width: 601px)",
      },
      (context) => {
        const { motion, parallax } = context.conditions;
        if (!motion) return;

        const ctx = gsap.context(() => {
          gsap.from(".collection__intro > *", {
            y: 28,
            opacity: 0,
            duration: 0.9,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".collection__intro",
              start: "top 88%",
              once: true,
            },
          });

          const cards = gsap.utils.toArray(".collection-card");
          gsap.set(cards, { opacity: 0, y: 60 });
          ScrollTrigger.batch(cards, {
            start: "top 92%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                duration: 1,
                stagger: 0.14,
                ease: "power3.out",
              }),
          });

          if (parallax) {
            cards.forEach((card) => {
              gsap.fromTo(
                card.querySelector(".collection-card__image"),
                { yPercent: -5 },
                {
                  yPercent: 5,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: true,
                  },
                }
              );
            });
          }
        }, section);

        return () => ctx.revert();
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <section className="collection section-shell" id="collection" ref={sectionRef}>
      <div className="collection__intro">
        <h2 className="collection__title">
          Pieces to
          <br />
          <em>live in.</em>
        </h2>

        <p className="collection__description">
          Considered silhouettes. Quiet details.
          <br />
          Everyday clothing, seen differently.
        </p>
      </div>

      <div className="collection__grid">
        {featured.map((product, index) => (
          <article
            className={`collection-card collection-card--${index + 1}`}
            key={product.slug}
          >
            <Link
              className="collection-card__link"
              to={`/product/${product.slug}`}
              onPointerEnter={() => prefetchImage(product.images[0], MAIN_SIZES, MAIN_WIDTHS)}
            >
              <div className="collection-card__media">
                <ResponsiveImage
                  className="collection-card__image"
                  src={product.images[0]}
                  alt={product.name}
                  widths={CARD_WIDTHS}
                  sizes={CARD_HOME_SIZES}
                />
              </div>

              <div className="collection-card__details">
                <h3>{product.name}</h3>
                <p>{formatPrice(product.price)}</p>
              </div>
            </Link>
          </article>
        ))}
      </div>

      <Link className="text-link collection__all" to="/shop">
        View all pieces
      </Link>
    </section>
  );
}