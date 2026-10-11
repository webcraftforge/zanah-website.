import { site } from "../data/site";

export default function Footer() {
  return (
    <footer className="footer" id="contact">
      <div className="footer__grid">
        <div className="footer__brand">
          <p className="footer__logo">
            ZANAH<span>.</span>
          </p>
          <p className="footer__text">
            Thoughtful everyday wear.
            <br />
            Order directly on WhatsApp.
          </p>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <a href={`https://wa.me/${site.phone}`} target="_blank" rel="noreferrer">
            WhatsApp {site.phoneDisplay}
          </a>
          <a
            href={`https://instagram.com/${site.instagram}`}
            target="_blank"
            rel="noreferrer"
          >
            Instagram @{site.instagram}
          </a>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </div>

        <div className="footer__col">
          <h4>Delivery</h4>
          {site.delivery.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
      </div>

      <p className="footer__legal">© {new Date().getFullYear()} {site.name}</p>
    </footer>
  );
}