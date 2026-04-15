import type { Metadata } from "next";
import PaymentMethodsClient from "./PaymentMethodsClient";

export const metadata: Metadata = {
  title: "Payment Methods | Firs' Dibs BZ",
  description:
    "Multiple convenient ways to pay for your orders — bank transfer, digital wallets, and more.",
};

export default function PaymentMethodsPage() {
  return <PaymentMethodsClient />;
}
