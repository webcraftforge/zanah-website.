import { useState } from "react";
import ProductCard from "../components/ProductCard";
import { products, categories } from "../data/products";
export default function Shop() {
  const [active, setActive] = useState("All");

  const visible =
    active === "All" ? products : products.filter((p) => p.category === active);

  return (
    <div className="page shop section-shell">
      <header className="page-head">
        <h1 className="page-title">
          The <em>collection.</em>
        </h1>

        <div className="filters" role="tablist" aria-label="Filter by category">
          {categories.map((category) => (
            <button
              key={category}
              role="tab"
              aria-selected={active === category}
              className={`filters__item ${active === category ? "is-active" : ""}`}
              onClick={() => setActive(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <div className="shop__grid" key={active}>
        {visible.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  );
}