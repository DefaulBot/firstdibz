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
    <header className="fixed top-[44px] left-0 right-0 z-[1000] bg-[#0f2f63] shadow-lg h-24" />
  );
}

export function ClientShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthProvider>
      <div className="min-h-dvh bg-zinc-50">
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
            className="mx-auto max-w-7xl px-4 pb-16"
          >
            {children}
          </motion.main>
        </AnimatePresence>

        {/* Footer */}
        <footer className="bg-gradient-to-r from-[#0a1f4d] to-[#0f2f63] border-t-4 border-transparent border-image-to-r border-image-from-[#87ef61] border-image-to-[#ff3b6d]">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
              {/* Column 1 */}
              <div>
                <h3 className="font-montserrat font-bold text-white text-lg mb-4 pb-2 border-b-2 border-[#87ef61] w-fit">
                  About Us
                </h3>
                <ul className="space-y-2 text-zinc-200 text-sm">
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      About Firs' Dibs BZ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Our Story
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Press
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Careers
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 2 */}
              <div>
                <h3 className="font-montserrat font-bold text-white text-lg mb-4 pb-2 border-b-2 border-[#87ef61] w-fit">
                  Support
                </h3>
                <ul className="space-y-2 text-zinc-200 text-sm">
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Contact Us
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      FAQ
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Shipping Info
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Returns
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 3 */}
              <div>
                <h3 className="font-montserrat font-bold text-white text-lg mb-4 pb-2 border-b-2 border-[#87ef61] w-fit">
                  Legal
                </h3>
                <ul className="space-y-2 text-zinc-200 text-sm">
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Terms & Conditions
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Cookie Policy
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Disclaimer
                    </a>
                  </li>
                </ul>
              </div>

              {/* Column 4 */}
              <div>
                <h3 className="font-montserrat font-bold text-white text-lg mb-4 pb-2 border-b-2 border-[#87ef61] w-fit">
                  Connect
                </h3>
                <ul className="space-y-2 text-zinc-200 text-sm">
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Instagram
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      WhatsApp
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      Facebook
                    </a>
                  </li>
                  <li>
                    <a
                      href="/"
                      className="hover:text-[#87ef61] transition-colors"
                    >
                      TikTok
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Copyright */}
            <div className="mt-12 pt-8 border-t border-zinc-700 text-center">
              <p className="text-zinc-400 text-sm">
                &copy; 2024 Firs' Dibs BZ. All rights reserved. | Made with ❤️
                for Belize
              </p>
              <p className="text-zinc-500 text-xs mt-2">
                Pay half now. Pay the rest later.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AuthProvider>
  );
}
