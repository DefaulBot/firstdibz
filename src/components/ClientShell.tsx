"use client";

import { Suspense } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { AnnouncementBar } from "./AnnouncementBar";
import { Header } from "./Header";
import { HeaderSearchWrapper } from "./HeaderSearchWrapper";
import { AuthProvider } from "./AuthProvider";

function HeaderSkeleton() {
  return (
    <header className="fixed top-[44px] left-0 right-0 z-[1000] bg-[#1F2661] shadow-lg h-24" />
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <div className="min-h-dvh bg-white">
        <AnnouncementBar />
        <Suspense fallback={<HeaderSkeleton />}>
          <HeaderSearchWrapper />
        </Suspense>

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="mx-auto max-w-7xl px-4 py-8 pb-16"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <footer className="bg-[#1F2661] border-t-4 border-[#7FF46A]">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
              {/* Column 1 */}
              <div>
                <h3 className="font-montserrat font-bold text-white text-lg mb-4 pb-2 border-b-2 border-[#7FF46A] w-fit">
                  About Us
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      About Firs' Dibs BZ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Our Story
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Press
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <h3 className="font-montserrat font-bold text-white text-lg mb-4 pb-2 border-b-2 border-[#7FF46A] w-fit">
                  Support
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Shipping Info
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Returns
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3 */}
              <div>
                <h3 className="font-montserrat font-bold text-white text-lg mb-4 pb-2 border-b-2 border-[#7FF46A] w-fit">
                  Legal
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Disclaimer
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4 */}
              <div>
                <h3 className="font-montserrat font-bold text-white text-lg mb-4 pb-2 border-b-2 border-[#7FF46A] w-fit">
                  Connect
                </h3>
                <ul className="space-y-2 text-white/80 text-sm">
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#7FF46A] transition-colors"
                    >
                      TikTok
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-white/20 text-center">
              <p className="text-white/70 text-sm">
                &copy; 2024 Firs' Dibs BZ. All rights reserved. | Made with ❤️
                for Belize
              </p>
              <p className="text-white/60 text-xs mt-2">
                Pay half now. Pay the rest later.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
