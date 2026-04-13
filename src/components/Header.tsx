"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";
import logo from "@/public/logo.jpeg";
import {
  Search,
  ShoppingCart,
  Heart,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useCartCount } from "@/lib/cart";

interface HeaderProps {
  searchParams?: ReadonlyURLSearchParams;
}

export function Header({ searchParams: propsSearchParams }: HeaderProps = {}) {
  const { user, loading, signOut, supabase } = useAuth();
  const router = useRouter();
  const hooksSearchParams = useSearchParams();
  const searchParams = propsSearchParams || hooksSearchParams;

  const [isAdmin, setIsAdmin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const sideNavRef = useRef<HTMLDivElement>(null);
  const cartCount = useCartCount();

  const currentQ = useMemo(() => searchParams.get("q") ?? "", [searchParams]);
  const [q, setQ] = useState(currentQ);

  useEffect(() => {
    setQ(currentQ);
  }, [currentQ]);

  useEffect(() => {
    if (user && supabase) {
      supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle()
        .then(({ data }) => {
          setIsAdmin(data?.is_admin ?? false);
        });
    }
  }, [user?.id, supabase]);

  function submit(nextQ?: string) {
    const value = (nextQ ?? q).trim();
    router.push(value ? `/search?q=${encodeURIComponent(value)}` : "/search");
  }

  const toggleSideNav = () => {
    setShowMobileMenu(!showMobileMenu);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-[44px] z-[1000] bg-[#1F2661] shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between gap-3 py-4">
            <Link href="/" className="flex shrink-0 items-center gap-2">
              <Image
                src={logo}
                alt="Firs' Dibs BZ Logo"
                width={50}
                height={50}
                className="h-12 w-auto rounded-lg"
              />
              <div className="hidden flex-col sm:flex">
                <div className="font-montserrat text-lg font-black leading-tight text-white">
                  Firs' Dibs BZ
                </div>
                <div className="text-xs font-semibold tracking-wider text-[#7FF46A]">
                  PAY HALF NOW. PAY OTHER HALF LATER.
                </div>
              </div>
            </Link>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex flex-1"
            >
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full rounded-full border-0 bg-white px-5 py-3 pr-12 text-sm text-[#1F2661] placeholder-[#8C9FAE] focus:outline-none focus:ring-2 focus:ring-[#7FF46A]"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center p-2 text-[#1F2661] transition-colors hover:text-[#7FF46A]"
                >
                  <Search size={20} />
                </button>
              </div>
            </form>

            <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex md:mx-4">
              <Link
                href="/"
                className="text-sm font-medium text-white transition-colors hover:text-[#7FF46A]"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-sm font-medium text-white transition-colors hover:text-[#7FF46A]"
              >
                Shop
              </Link>
              <Link
                href="/account"
                className="text-sm font-medium text-white transition-colors hover:text-[#7FF46A]"
              >
                My Account
              </Link>
              {!loading && isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-medium text-white transition-colors hover:text-[#7FF46A]"
                >
                  Admin
                </Link>
              )}
            </nav>

            <div className="flex shrink-0 items-center gap-4">
              <Link
                href="/cart"
                className="relative hidden p-2 text-white transition-colors hover:text-[#7FF46A] sm:block"
              >
                <ShoppingCart size={24} />
                {cartCount > 0 ? (
                  <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-[#7FF46A] px-1 text-xs font-black text-[#1F2661]">
                    {cartCount}
                  </span>
                ) : null}
              </Link>

              <Link
                href="/search"
                className="hidden p-2 text-white transition-colors hover:text-[#7FF46A] sm:block"
              >
                <Heart size={24} />
              </Link>

              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden p-2 text-white transition-colors hover:text-[#7FF46A] sm:block"
              >
                <MessageCircle size={24} />
              </a>

              <button
                onClick={toggleSideNav}
                className="p-2 text-white transition-colors hover:text-[#7FF46A] lg:hidden"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {showMobileMenu && (
        <div
          className="fixed inset-0 z-[999] bg-black/50"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      <div
        ref={sideNavRef}
        className={`fixed right-0 top-0 z-[1001] h-screen w-72 overflow-y-auto bg-white shadow-2xl transition-transform duration-300 ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          <button
            onClick={() => setShowMobileMenu(false)}
            className="absolute right-4 top-4 text-[#1F2661]"
          >
            <X size={28} />
          </button>

          <div className="mb-8 mt-8 text-center">
            <div className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#1F2661] to-[#7FF46A] text-3xl font-bold text-white">
              👤
            </div>
            <h3 className="font-montserrat text-lg font-bold text-[#1F2661]">
              {user?.email ? user.email.split("@")[0] : "Guest User"}
            </h3>
            <p className="text-sm text-[#8C9FAE]">Welcome to Firs' Dibs BZ</p>
          </div>

          <nav className="space-y-4">
            <SideNavLink
              href="/"
              label="Home"
              onClick={() => setShowMobileMenu(false)}
            />
            <SideNavLink
              href="/search"
              label="Shop"
              onClick={() => setShowMobileMenu(false)}
            />
            <SideNavLink
              href="/cart"
              label={cartCount > 0 ? `Cart (${cartCount})` : "Cart"}
              onClick={() => setShowMobileMenu(false)}
            />
            <SideNavLink
              href="/account"
              label="My Account"
              onClick={() => setShowMobileMenu(false)}
            />
            <SideNavLink
              href="/search"
              label="Browse All"
              onClick={() => setShowMobileMenu(false)}
            />
            {!loading && isAdmin && (
              <SideNavLink
                href="/admin"
                label="Admin Dashboard"
                onClick={() => setShowMobileMenu(false)}
              />
            )}
          </nav>

          <div className="mt-8 border-t border-zinc-200 pt-6">
            {!loading && !user ? (
              <Link
                href="/signin"
                onClick={() => setShowMobileMenu(false)}
                className="block w-full rounded-lg bg-[#1F2661] py-3 text-center font-semibold text-white transition-all hover:shadow-lg"
              >
                Sign In
              </Link>
            ) : !loading && user ? (
              <button
                onClick={async () => {
                  await signOut();
                  setShowMobileMenu(false);
                  router.push("/");
                }}
                className="block w-full rounded-lg bg-red-500 py-3 font-semibold text-white transition-colors hover:bg-red-600"
              >
                Sign Out
              </button>
            ) : null}
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-6">
            <div className="space-y-3 text-sm">
              <a
                href="/search"
                className="block text-[#8C9FAE] transition-colors hover:text-[#1F2661]"
              >
                Browse Products
              </a>
              <a
                href="/"
                className="block text-[#8C9FAE] transition-colors hover:text-[#1F2661]"
              >
                About Us
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-[#8C9FAE] transition-colors hover:text-[#1F2661]"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[84px] md:h-[120px]" />
    </>
  );
}

function SideNavLink({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block rounded-lg px-4 py-3 font-medium text-[#1F2661] transition-all hover:bg-[#D9EBDD]"
    >
      {label}
    </Link>
  );
}
