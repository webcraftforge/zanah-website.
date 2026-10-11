
import { Link } from "react-router-dom";
import ResponsiveImage from "./ResponsiveImage";
import { formatPrice } from "../data/products";
import {
  CARD_WIDTHS,
  CARD_SHOP_SIZES,
  MAIN_WIDTHS,
  MAIN_SIZES,
  prefetchImage,
} from "../utils/image";

// Used on the Shop page and in "You may also like".
export default function ProductCard({ product }) {
  // Start loading the product page's main photo as soon as someone shows interest.
  const warm = () => prefetchImage(product.images[0], MAIN_SIZES, MAIN_WIDTHS);

  return (
    <article className="collection-card collection-card--static">
      <Link
        className="collection-card__link"
        to={`/product/${product.slug}`}
        onPointerEnter={warm}
        onFocus={warm}
      >
        <div className="collection-card__media">
          <ResponsiveImage
            className="collection-card__image"
            src={product.images[0]}
            alt={product.name}
            widths={CARD_WIDTHS}
            sizes={CARD_SHOP_SIZES}
          />
        </div>

        <div className="collection-card__details">
          <h3>{product.name}</h3>
          <p>{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}