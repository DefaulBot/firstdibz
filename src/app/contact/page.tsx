import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | Firs' Dibs BZ",
  description:
    "Get in touch with our team. We'd love to hear from you — reach out by form, WhatsApp, or email.",
};

export default function ContactPage() {
  return <ContactClient />;
}
