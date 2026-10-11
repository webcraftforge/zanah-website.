import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { sizeChart } from "../data/sizes";
import { lockScroll, unlockScroll } from "../useSmoothScroll";

const toCm = (inches) => Math.round(inches * 2.54);

export default function SizeChart({ onClose, highlight }) {
  const [unit, setUnit] = useState("in");
  const closeRef = useRef(null);

  useEffect(() => {
    const previous = document.activeElement;
    lockScroll();
    closeRef.current?.focus();

    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      unlockScroll();
      previous?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <div className="size-chart" onClick={onClose}>
      <div
        className="size-chart__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="size-chart-title"
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
      >
        <div className="size-chart__head">
          <h2 id="size-chart-title" className="size-chart__title">
            Size <em>guide.</em>
          </h2>
          <button className="size-chart__close" onClick={onClose} ref={closeRef}>
            Close
          </button>
        </div>

        <div className="size-chart__units" role="group" aria-label="Units">
          {["in", "cm"].map((u) => (
            <button
              key={u}
              className={unit === u ? "is-active" : ""}
              aria-pressed={unit === u}
              onClick={() => setUnit(u)}
            >
              {u === "in" ? "Inches" : "Centimetres"}
            </button>
          ))}
        </div>

        <div className="size-chart__table-wrap">
          <table className="size-chart__table">
            <thead>
              <tr>
                <th scope="col">Size</th>
                {sizeChart.columns.map((c) => (
                  <th scope="col" key={c}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sizeChart.rows.map((row) => (
                <tr key={row.size} className={row.size === highlight ? "is-selected" : ""}>
                  <th scope="row">{row.size}</th>
                  {row.values.map((v, i) => (
                    <td key={i}>{unit === "in" ? v : toCm(v)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <dl className="size-chart__measure">
          {sizeChart.howToMeasure.map((item) => (
            <div key={item.label}>
              <dt>{item.label}</dt>
              <dd>{item.text}</dd>
            </div>
          ))}
        </dl>

        <p className="size-chart__note">{sizeChart.note}</p>
      </div>
    </div>,
    document.body
  );
}