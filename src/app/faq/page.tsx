import type { Metadata } from "next";
import { FaqClient } from "./FaqClient";

export const metadata: Metadata = {
  title: "FAQ | Firs' Dibs BZ",
  description:
    "Everything you need to know about Firs' Dibs BZ — payments, loyalty points, shipping, and more.",
};

export default function FaqPage() {
  return <FaqClient />;
}
