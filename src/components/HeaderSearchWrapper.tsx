"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "./Header";

/**
 * Wrapper component that provides useSearchParams to Header
 * This allows Header to be wrapped in Suspense by the caller
 */
export function HeaderSearchWrapper() {
  const searchParams = useSearchParams();

  return <Header searchParams={searchParams} />;
}
