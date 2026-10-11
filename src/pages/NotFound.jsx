import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="page section-shell not-found">
      <h1 className="page-title">
        Page not <em>found.</em>
      </h1>
      <p className="not-found__text">
        The page you are looking for does not exist or has moved.
      </p>
      <Link className="text-link" to="/shop">
        Back to the shop
      </Link>
    </div>
  );
}