import { site } from "../data/site";
import { formatPrice } from "../data/products";

const link = (text) =>
  `https://wa.me/${site.phone}?text=${encodeURIComponent(text)}`;

// Opens WhatsApp with the order already written out.
export const orderLink = (product, size) =>
  link(
    [
      `Hi ${site.name}, I'd like to order:`,
      "",
      product.name,
      `Size: ${size}`,
      `Price: ${formatPrice(product.price)}`,
      "",
      "Please confirm availability and delivery details.",
    ].join("\n")
  );

// General question, no product.
export const chatLink = () =>
  link(`Hi ${site.name}, I have a question.`);