"use client";

import { useEffect, useMemo, useState } from "react";
import type { ItemDetail } from "@/lib/types";

const CART_KEY = "firs-dibs-cart";
const CART_EVENT = "firs-dibs-cart-updated";

export type CartItem = {
  product_id: ItemDetail["id"];
  title: string;
  image: string;
  price: number;
  quantity: number;
  out_of_stock: boolean;
  points_earned?: number | null;
};

function isBrowser() {
  return typeof window !== "undefined";
}

function sameId(a: string | number, b: string | number) {
  return String(a) === String(b);
}

export function readCart(): CartItem[] {
  if (!isBrowser()) return [];

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (!isBrowser()) return;

  if (!items.length) {
    window.localStorage.removeItem(CART_KEY);
  } else {
    window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  window.dispatchEvent(new Event(CART_EVENT));
}

export function addCartItem(item: Omit<CartItem, "quantity">, quantity = 1) {
  const items = readCart();
  const existing = items.find((x) => sameId(x.product_id, item.product_id));

  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ ...item, quantity });
  }

  writeCart(items);
  return items;
}

export function updateCartQuantity(
  productId: CartItem["product_id"],
  quantity: number,
) {
  const items = readCart();

  if (quantity <= 0) {
    writeCart(items.filter((x) => !sameId(x.product_id, productId)));
    return;
  }

  writeCart(
    items.map((x) =>
      sameId(x.product_id, productId) ? { ...x, quantity } : x,
    ),
  );
}

export function removeCartItem(productId: CartItem["product_id"]) {
  writeCart(readCart().filter((x) => !sameId(x.product_id, productId)));
}

export function clearCart() {
  writeCart([]);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    if (!isBrowser()) return;

    const sync = () => setItems(readCart());

    sync();
    window.addEventListener(CART_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(CART_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const count = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  );

  return {
    items,
    count,
    subtotal,
    addItem: addCartItem,
    setQuantity: updateCartQuantity,
    removeItem: removeCartItem,
    clearAll: clearCart,
  };
}

export function useCartCount() {
  return useCart().count;
}
