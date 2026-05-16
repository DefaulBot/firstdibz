"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";
import logo from "@/public/logo.jpeg";
import {
  CircleUserRound,
  Facebook,
  House,
  Instagram,
  Heart,
  Menu,
  Search,
  Shield,
  ShoppingCart,
  Store,
  X,
} from "lucide-react";
import { useAuth } from "./AuthProvider";
import { useCartCount } from "@/lib/cart";
import { COMPANY } from "@/lib/company";

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
              className="flex min-w-0 max-w-xl flex-1"
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

            <nav className="hidden flex-1 items-center justify-center gap-3 lg:flex md:mx-4">
              <div className="flex items-center gap-1 rounded-full border border-white/25 bg-white/10 p-1 shadow-sm backdrop-blur-sm">
                <Link
                  href="/"
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-[#7FF46A] hover:text-[#1F2661]"
                >
                  <House size={14} />
                  Home
                </Link>
                <Link
                  href="/search"
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-[#7FF46A] hover:text-[#1F2661]"
                >
                  <Store size={14} />
                  Shop
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-[#7FF46A] hover:text-[#1F2661]"
                >
                  <CircleUserRound size={14} />
                  My Account
                </Link>
                {!loading && isAdmin && (
                  <Link
                    href="/admin"
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold text-white transition-all hover:bg-[#7FF46A] hover:text-[#1F2661]"
                  >
                    <Shield size={14} />
                    Admin
                  </Link>
                )}
              </div>

              <div className="flex items-center gap-2 border-l border-white/30 pl-2">
                <a
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="rounded-full border border-white/30 bg-white/10 p-2 text-white transition-all hover:border-[#7FF46A] hover:bg-[#7FF46A] hover:text-[#1F2661]"
                >
                  <Facebook size={15} />
                </a>
                <a
                  href={COMPANY.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="rounded-full border border-white/30 bg-white/10 p-2 text-white transition-all hover:border-[#7FF46A] hover:bg-[#7FF46A] hover:text-[#1F2661]"
                >
                  <Instagram size={15} />
                </a>
                <a
                  href={COMPANY.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="rounded-full border border-white/30 bg-white/10 p-2 text-white transition-all hover:border-[#7FF46A] hover:bg-[#7FF46A] hover:text-[#1F2661]"
                >
                  <WhatsAppIcon size={15} />
                </a>
              </div>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
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
                href="/about"
                className="block text-[#8C9FAE] transition-colors hover:text-[#1F2661]"
              >
                About Us
              </a>
              <a
                href="/rewards"
                className="block text-[#8C9FAE] transition-colors hover:text-[#1F2661]"
              >
                Rewards & Points
              </a>
              <a
                href="/faq"
                className="block text-[#8C9FAE] transition-colors hover:text-[#1F2661]"
              >
                FAQ
              </a>
              <a
                href="/contact"
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

function WhatsAppIcon({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
    </svg>
  );
}
