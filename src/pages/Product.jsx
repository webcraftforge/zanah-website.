
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SizeChart from "../components/SizeChart";
import ResponsiveImage from "../components/ResponsiveImage";
import {
  MAIN_WIDTHS,
  MAIN_SIZES,
  THUMB_WIDTHS,
  THUMB_SIZES,
} from "../utils/image";
import NotFound from "./NotFound";
import { products, formatPrice } from "../data/products";
import { orderLink } from "../utils/whatsapp";

export default function Product() {
  const { slug } = useParams();
  const product = products.find((p) => p.slug === slug);

  const [active, setActive] = useState(0);
  const [size, setSize] = useState(null);
  const [needSize, setNeedSize] = useState(false);
  const [chartOpen, setChartOpen] = useState(false);

  // New product => start fresh.
  useEffect(() => {
    setActive(0);
    setSize(null);
    setNeedSize(false);
    setChartOpen(false);
  }, [slug]);

  if (!product) return <NotFound />;

  const related = [
    ...products.filter((p) => p.slug !== slug && p.category === product.category),
    ...products.filter((p) => p.slug !== slug && p.category !== product.category),
  ].slice(0, 3);

  const onOrder = (e) => {
    if (!size) {
      e.preventDefault();
      setNeedSize(true);
    }
  };

  return (
    <div className="page product section-shell">
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link to="/shop">Shop</Link>
        <span>/</span>
        <span>{product.name}</span>
      </nav>

      <div className="product__layout">
        <div className="product__gallery">
          <div className="product__main">
            <ResponsiveImage
              key={product.images[active]}
              src={product.images[active]}
              alt={product.name}
              widths={MAIN_WIDTHS}
              sizes={MAIN_SIZES}
              priority
            />
          </div>

          <div className="product__thumbs">
            {product.images.map((src, i) => (
              <button
                key={src + i}
                className={`product__thumb ${i === active ? "is-active" : ""}`}
                onClick={() => setActive(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === active}
              >
                <ResponsiveImage src={src} widths={THUMB_WIDTHS} sizes={THUMB_SIZES} />
              </button>
            ))}
          </div>
        </div>

        <div className="product__info">
          <p className="product__category">{product.category}</p>
          <h1 className="product__name">{product.name}</h1>
          <p className="product__price">{formatPrice(product.price)}</p>

          <p className="product__description">{product.description}</p>

          <div className="product__block">
            <div className="product__label">
              <span className="product__label-left">
                Size
                {needSize && !size && (
                  <span className="product__hint" role="alert">
                    Please choose a size
                  </span>
                )}
              </span>
              <button
                type="button"
                className="product__guide"
                onClick={() => setChartOpen(true)}
              >
                Size guide
              </button>
            </div>

            <div className="sizes" role="radiogroup" aria-label="Size">
              {product.sizes.map((s) => (
                <button
                  key={s}
                  role="radio"
                  aria-checked={size === s}
                  className={`sizes__item ${size === s ? "is-active" : ""}`}
                  onClick={() => {
                    setSize(s);
                    setNeedSize(false);
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <a
            className="button-solid"
            href={size ? orderLink(product, size) : "#"}
            target="_blank"
            rel="noreferrer"
            onClick={onOrder}
          >
            Order on WhatsApp
          </a>

          <dl className="product__details">
            <div>
              <dt>Fabric</dt>
              <dd>{product.fabric}</dd>
            </div>
            <div>
              <dt>Care</dt>
              <dd>{product.care}</dd>
            </div>
            <div>
              <dt>Delivery</dt>
              <dd>3–5 working days across Pakistan</dd>
            </div>
          </dl>
        </div>
      </div>

      <section className="related">
        <h2 className="related__title">
          You may also <em>like.</em>
        </h2>
        <div className="shop__grid shop__grid--related">
          {related.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      </section>

      {chartOpen && (
        <SizeChart highlight={size} onClose={() => setChartOpen(false)} />
      )}
    </div>
  );
}