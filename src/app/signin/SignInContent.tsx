"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, Mail, User2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";

export function SignInContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { supabase, supabaseConfigured } = useAuth();

  const redirect = useMemo(
    () => searchParams.get("redirect") || "/account",
    [searchParams],
  );

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("Belize");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    if (!supabase) {
      setError(
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
      return;
    }

    if (mode === "signin") {
      if (!email || !password) {
        setError("Please fill in all fields");
        return;
      }

      setBusy(true);
      setError(null);
      setMessage(null);

      try {
        const { data, error: authError } =
          await supabase.auth.signInWithPassword({
            email: email.trim(),
            password: password.trim(),
          });

        if (authError) {
          setError(authError.message);
          setBusy(false);
          return;
        }

        if (data?.session) {
          setMessage("Signing in...");
          router.push(redirect);
        }
      } catch (err: any) {
        setError(err?.message || "An error occurred");
        setBusy(false);
      }
    } else {
      // Signup mode
      if (
        !email ||
        !password ||
        !firstName ||
        !lastName ||
        !phoneNumber ||
        !streetAddress ||
        !city
      ) {
        setError("Please fill in all required fields");
        return;
      }

      setBusy(true);
      setError(null);
      setMessage(null);

      try {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (authError) {
          setError(authError.message);
          setBusy(false);
          return;
        }

        if (data.user) {
          const { error: updateError } = await supabase
            .from("profiles")
            .update({
              first_name: firstName,
              last_name: lastName,
              phone_number: phoneNumber,
              street_address: streetAddress,
              city,
              state_province: stateProvince,
              postal_code: postalCode,
              country,
            })
            .eq("id", data.user.id);

          if (updateError) {
            setError(updateError.message);
            setBusy(false);
            return;
          }

          setMessage(
            "Account created! Check your email to confirm your account.",
          );
        }
      } catch (err: any) {
        setError(err?.message || "An error occurred");
        setBusy(false);
      }
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-16">
      {/* Left Sidebar */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 py-8">
        <div className="max-w-md">
          <h1 className="text-5xl font-black font-montserrat text-[#0f2f63] mb-6">
            {mode === "signin" ? "Welcome Back" : "Join Us"}
          </h1>
          <p className="text-lg text-zinc-700 mb-8 leading-relaxed">
            {mode === "signin"
              ? "Sign in to your account to manage orders and preorder your favorite items."
              : "Create an account to start preordering exclusive items at Firs' Dibs BZ."}
          </p>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#87ef61] flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#0f2f63] font-bold text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-[#0f2f63]">
                  Pay in Installments
                </p>
                <p className="text-sm text-zinc-600">
                  Pay 50% now and 50% later when your item arrives
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#87ef61] flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#0f2f63] font-bold text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-[#0f2f63]">Exclusive Access</p>
                <p className="text-sm text-zinc-600">
                  Get early access to new products and special offers
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#87ef61] flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-[#0f2f63] font-bold text-sm">✓</span>
              </div>
              <div>
                <p className="font-semibold text-[#0f2f63]">Earn Rewards</p>
                <p className="text-sm text-zinc-600">
                  Earn points on every purchase to redeem for discounts
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form */}
      <div className="w-full lg:w-1/2 px-4 py-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          {/* Form Header */}
          <div className="mb-8">
            <h2 className="text-3xl font-black font-montserrat text-[#0f2f63] mb-2">
              {mode === "signin" ? "Sign In" : "Create Account"}
            </h2>
            <p className="text-sm text-zinc-600">
              {mode === "signin"
                ? "Enter your credentials to sign in"
                : "Fill in your details to get started"}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
            >
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm"
            >
              {message}
            </motion.div>
          )}

          {/* Form Fields */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit();
            }}
            className="space-y-4"
          >
            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                  disabled={busy}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-zinc-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                  disabled={busy}
                />
              </div>
            </div>

            {/* Sign Up Only Fields */}
            {mode === "signup" && (
              <>
                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                      First Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      placeholder="Doe"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                      disabled={busy}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    placeholder="+501 XXX XXXX"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                    disabled={busy}
                  />
                </div>

                {/* Street Address */}
                <div>
                  <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    placeholder="123 Main St"
                    value={streetAddress}
                    onChange={(e) => setStreetAddress(e.target.value)}
                    className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                    disabled={busy}
                  />
                </div>

                {/* City & State */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                      City *
                    </label>
                    <input
                      type="text"
                      placeholder="Belize City"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                      State/Province
                    </label>
                    <input
                      type="text"
                      placeholder="BZ"
                      value={stateProvince}
                      onChange={(e) => setStateProvince(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                      disabled={busy}
                    />
                  </div>
                </div>

                {/* Postal Code & Country */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                      Postal Code
                    </label>
                    <input
                      type="text"
                      placeholder="12345"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                      disabled={busy}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-700 mb-2 uppercase tracking-wide">
                      Country
                    </label>
                    <input
                      type="text"
                      placeholder="Belize"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0f2f63] focus:border-transparent text-sm"
                      disabled={busy}
                    />
                  </div>
                </div>
              </>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={busy}
              className="w-full mt-6 bg-[#0f2f63] hover:bg-[#1f2661] text-white font-bold py-3 rounded-lg transition-all"
            >
              {busy ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Processing...
                </>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          {/* Toggle Mode */}
          <div className="mt-6 pt-6 border-t border-zinc-200 text-center text-sm">
            {mode === "signin" ? (
              <p className="text-zinc-600">
                Don't have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signup");
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-[#0f2f63] font-bold hover:underline"
                >
                  Sign up here
                </button>
              </p>
            ) : (
              <p className="text-zinc-600">
                Already have an account?{" "}
                <button
                  onClick={() => {
                    setMode("signin");
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-[#0f2f63] font-bold hover:underline"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
