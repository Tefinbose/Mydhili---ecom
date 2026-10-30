"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Eye, EyeOff, ArrowRight, Sparkles, ExternalLink } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Invalid email or password.");
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-[#380712]">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand Showcase Panel */}
        <section className="relative hidden overflow-hidden bg-[#210309] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
          {/* Subtle luxury ambient glows */}
          <div className="pointer-events-none absolute -right-32 -top-32 h-[30rem] w-[30rem] rounded-full bg-[#D4AF69]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-24 h-[32rem] w-[32rem] rounded-full bg-[#8B2635]/40 blur-3xl" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />

          <div className="relative z-10 flex items-center justify-between">
            <Link href="/" className="group flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-[#D4AF69]/40 bg-[#150105] p-1 shadow-lg transition-transform group-hover:scale-105">
                <Image
                  src="/logo/logo.png"
                  alt="Mydhili Logo"
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <div>
                <span className="font-serif text-lg font-bold tracking-wide text-[#F5DFC0]">
                  Mydhili
                </span>
                <span className="block text-[9px] font-semibold uppercase tracking-[0.28em] text-[#D4AF69]">
                  Boutique Portal
                </span>
              </div>
            </Link>

            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs text-[#F5DFC0] backdrop-blur-sm transition hover:bg-white/20"
            >
              <span>Visit store</span>
              <ExternalLink size={13} />
            </Link>
          </div>

          <div className="relative z-10 max-w-lg">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#D4AF69]/40 bg-white/10 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#E6C47A] backdrop-blur-sm">
              <Sparkles size={12} className="text-[#D4AF69]" />
              Artisan Heritage &amp; Elegance
            </div>

            <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight sm:text-5xl xl:text-6xl text-[#FAF7F2]">
              Elegance in every single thread.
            </h1>

            <p className="mt-5 max-w-md text-sm font-light leading-relaxed text-white/75 sm:text-base">
              Securely oversee store orders, curate seasonal saree collections, monitor inventory, and delight your patrons across India.
            </p>

            <div className="mt-8 h-px w-24 bg-gradient-to-r from-[#D4AF69] to-transparent" />
          </div>

          <p className="relative z-10 text-xs tracking-wide text-white/45">
            © {currentYear ?? ""} Mydhili Collections · All rights reserved.
          </p>
        </section>

        {/* Login Form Panel */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="mb-8 flex items-center justify-between lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-[#D4AF69]/40 bg-[#380712] p-1">
                  <Image
                    src="/logo/logo.png"
                    alt="Mydhili Logo"
                    width={36}
                    height={36}
                    className="object-contain"
                  />
                </div>
                <div>
                  <span className="font-serif text-base font-bold text-[#380712]">
                    Mydhili
                  </span>
                  <span className="block text-[8px] font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
                    Admin
                  </span>
                </div>
              </Link>

              <Link
                href="/"
                className="text-xs font-semibold text-[#9A6B35] hover:underline"
              >
                Storefront ↗
              </Link>
            </div>

            <div className="mb-8">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF69]/40 bg-white p-2.5 shadow-sm">
                <LockKeyhole className="h-6 w-6 text-[#9A6B35]" />
              </div>

              <div className="flex items-center gap-2">
                <span className="h-px w-6 bg-[#A27B35]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#9A6B35]">
                  Secure Access
                </p>
              </div>

              <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-[#380712] sm:text-4xl">
                Boutique Sign In
              </h2>

              <p className="mt-2 text-xs text-stone-500 sm:text-sm">
                Enter your administrator credentials to access your store control center.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold text-[#380712]"
                >
                  Email Address
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#E9DFD2] bg-white px-4 transition focus-within:border-[#9A6B35] focus-within:ring-2 focus-within:ring-[#D4AF69]/20">
                  <Mail className="h-4 w-4 shrink-0 text-[#9A6B35]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@mydhili.com"
                    className="h-12 w-full bg-transparent text-sm text-[#380712] outline-none placeholder:text-stone-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold text-[#380712]"
                >
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-[#E9DFD2] bg-white px-4 transition focus-within:border-[#9A6B35] focus-within:ring-2 focus-within:ring-[#D4AF69]/20">
                  <LockKeyhole className="h-4 w-4 shrink-0 text-[#9A6B35]" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your security password"
                    className="h-12 w-full bg-transparent text-sm text-[#380712] outline-none placeholder:text-stone-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-stone-400 hover:text-[#380712]"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs font-medium text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-[#380712] px-6 text-sm font-semibold text-[#F5DFC0] shadow-md transition hover:bg-[#520A1A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Authenticating..." : "Sign In to Admin"}
                {!loading && <ArrowRight className="h-4 w-4 text-[#D4AF69]" />}
              </button>
            </form>

            <p className="mt-8 text-center text-[11px] leading-relaxed text-stone-400">
              Mydhili Collections boutique administration system.
              <br />
              Authorized store managers and personnel only.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
