"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useRef } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";
import logo from "@/public/logo.jpeg";
import {
  Search,
  UserCircle2,
  BarChart3,
  ShoppingCart,
  Heart,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { cn } from "@/lib/utils";
import { useAuth } from "./AuthProvider";

interface HeaderProps {
  searchParams?: ReadonlyURLSearchParams;
}

export function Header({ searchParams: propsSearchParams }: HeaderProps = {}) {
  const { user, loading, signOut, supabase } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const hooksSearchParams = useSearchParams();
  // Use prop if provided, otherwise fall back to hook (for backward compatibility)
  const searchParams = propsSearchParams || hooksSearchParams;
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const sideNavRef = useRef<HTMLDivElement>(null);

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
      {/* Main Header */}
      <header className="fixed top-[44px] left-0 right-0 z-[1000] bg-[#0f2f63] shadow-lg">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <Image
                src={logo}
                alt="Firs' Dibs BZ Logo"
                width={50}
                height={50}
                className="rounded-lg h-12 w-auto"
              />
              <div className="hidden sm:flex flex-col">
                <div className="text-white font-black font-montserrat text-lg leading-tight">
                  Firs' Dibs BZ
                </div>
                <div className="text-[#87ef61] text-xs font-semibold tracking-wider">
                  PAY HALF NOW. PAY OTHER HALF LATER.
                </div>
              </div>
            </Link>

            {/* Search Bar - Hidden on Mobile, smaller on desktop */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="hidden md:flex mx-4 max-w-sm flex-1"
            >
              <div className="w-full relative">
                <input
                  type="text"
                  placeholder="Search for products, brands, and more..."
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  className="w-full bg-white text-[#0f2f63] placeholder-zinc-400 px-5 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#87ef61] text-sm"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-[#0f2f63] pr-4 hover:text-[#87ef61] transition-colors"
                >
                  <Search size={18} />
                </button>
              </div>
            </form>

            {/* Desktop Navigation Menu */}
            <nav className="hidden lg:flex items-center gap-8 flex-1 justify-center">
              <Link
                href="/"
                className="text-white hover:text-[#87ef61] transition-colors font-medium text-sm"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="text-white hover:text-[#87ef61] transition-colors font-medium text-sm"
              >
                Shop
              </Link>
              <Link
                href="/account"
                className="text-white hover:text-[#87ef61] transition-colors font-medium text-sm"
              >
                My Account
              </Link>
              {!loading && isAdmin && (
                <Link
                  href="/admin"
                  className="text-white hover:text-[#87ef61] transition-colors font-medium text-sm"
                >
                  Admin
                </Link>
              )}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* Cart Icon */}
              <Link
                href="/search"
                className="relative text-white hover:text-[#87ef61] transition-colors p-2 hidden sm:block"
              >
                <ShoppingCart size={24} />
              </Link>

              {/* Heart Icon */}
              <Link
                href="/search"
                className="text-white hover:text-[#87ef61] transition-colors p-2 hidden sm:block"
              >
                <Heart size={24} />
              </Link>

              {/* WhatsApp Icon */}
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-[#87ef61] transition-colors p-2 hidden sm:block"
              >
                <MessageCircle size={24} />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleSideNav}
                className="text-white hover:text-[#87ef61] transition-colors p-2 lg:hidden"
              >
                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="md:hidden pb-4"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands, and more..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full bg-white text-[#0f2f63] placeholder-zinc-400 px-5 py-3 rounded-full border-0 focus:outline-none focus:ring-2 focus:ring-[#87ef61] text-sm"
              />
              <button
                type="submit"
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#0f2f63] pr-4"
              >
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* Side Navigation Overlay */}
      {showMobileMenu && (
        <div
          className="fixed inset-0 bg-black/50 z-[999]"
          onClick={() => setShowMobileMenu(false)}
        />
      )}

      {/* Side Navigation Menu */}
      <div
        ref={sideNavRef}
        className={`fixed right-0 top-0 h-screen w-72 bg-white shadow-2xl z-[1001] transition-transform duration-300 overflow-y-auto ${
          showMobileMenu ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Close Button */}
          <button
            onClick={() => setShowMobileMenu(false)}
            className="absolute top-4 right-4 text-[#0f2f63]"
          >
            <X size={28} />
          </button>

          {/* User Avatar Section */}
          <div className="mt-8 mb-8 text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-gradient-to-br from-[#0f2f63] to-[#87ef61] flex items-center justify-center text-white text-3xl font-bold mb-3">
              👤
            </div>
            <h3 className="font-montserrat font-bold text-[#0f2f63] text-lg">
              {user?.email ? user.email.split("@")[0] : "Guest User"}
            </h3>
            <p className="text-zinc-600 text-sm">Welcome to Firs' Dibs BZ</p>
          </div>

          {/* Navigation Links */}
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

          {/* Auth Section */}
          <div className="mt-8 pt-6 border-t border-zinc-200">
            {!loading && !user ? (
              <Link
                href="/signin"
                onClick={() => setShowMobileMenu(false)}
                className="block w-full bg-gradient-to-r from-[#0f2f63] to-[#1a3f7a] text-white font-semibold py-3 rounded-lg text-center hover:shadow-lg transition-all"
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
                className="block w-full bg-red-500 text-white font-semibold py-3 rounded-lg hover:bg-red-600 transition-colors"
              >
                Sign Out
              </button>
            ) : null}
          </div>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-zinc-200">
            <div className="space-y-3 text-sm">
              <a
                href="/search"
                className="block text-zinc-600 hover:text-[#0f2f63] transition-colors"
              >
                Browse Products
              </a>
              <a
                href="/"
                className="block text-zinc-600 hover:text-[#0f2f63] transition-colors"
              >
                About Us
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="block text-zinc-600 hover:text-[#0f2f63] transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Add padding to page content for fixed header */}
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
      className="block px-4 py-3 rounded-lg text-[#0f2f63] font-medium hover:bg-gradient-to-r hover:from-[#0f2f63] hover:to-[#1a3f7a] hover:text-white transition-all"
    >
      {label}
    </Link>
  );
}
