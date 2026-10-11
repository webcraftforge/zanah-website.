import { chatLink } from "../utils/whatsapp";

// Small floating button, visible on every page.
export default function WhatsAppButton() {
  return (
    <a
      className="wa-button"
      href={chatLink()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
    >
      Chat on WhatsApp
    </a>
  );
}