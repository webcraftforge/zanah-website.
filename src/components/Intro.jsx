
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./Intro.scss";

const letters = [..."ZANAH"];


export default function Intro({ onComplete }) {
  const introRef = useRef(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    const ctx = gsap.context(() => {
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      const timeline = gsap.timeline({
        onComplete: () => {
          setVisible(false);
          onComplete();
        }   ,
      });

      if (reducedMotion) {
        timeline.to(intro, {
          opacity: 0,
          duration: 0.3,
          delay: 0.4,
          ease: "power1.out",
        });
        return;
      }

      timeline
        .from(".zanah-intro__eyebrow", {
          opacity: 0,
          y: 8,
          duration: 0.5,
          ease: "power2.out",
        })
        .from(
          ".zanah-intro__letter",
          {
            opacity: 0,
            y: 35,
            filter: "blur(8px)",
            duration: 0.8,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=0.1"
        )
        .from(
          ".zanah-intro__line",
          {
            scaleX: 0,
            duration: 0.6,
            ease: "power2.inOut",
          },
          "-=0.25"
        )
        .from(
          ".zanah-intro__caption",
          {
            opacity: 0,
            y: 6,
            duration: 0.45,
          },
          "-=0.2"
        )
        .to({}, { duration: 0.35 })
        .to(intro, {
          yPercent: -100,
          duration: 0.9,
          ease: "power4.inOut",
        });
    }, intro);

    return () => ctx.revert();
  }, []);

  if (!visible) return null;

  return (
    <div
      className="zanah-intro"
      ref={introRef}
      role="status"
      aria-label="ZANAH womenswear"
    >
      <div className="zanah-intro__center">
        <p className="zanah-intro__eyebrow">
          AN EXPRESSION OF EVERYDAY ELEGANCE
        </p>

        <div className="zanah-intro__wordmark" aria-hidden="true">
          {letters.map((letter, index) => (
            <span
              className="zanah-intro__letter"
              key={`${letter}-${index}`}
            >
              {letter}
            </span>
          ))}
        </div>

        <div className="zanah-intro__line" />

        <p className="zanah-intro__caption">
          CONTEMPORARY WOMENSWEAR
        </p>
      </div>

      {/* <span className="zanah-intro__index">EST. ZANAH STUDIO</span>
      <span className="zanah-intro__corner">01 — 01</span> */}
    </div>
  );
}
