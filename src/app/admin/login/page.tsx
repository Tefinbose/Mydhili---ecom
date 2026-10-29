
"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, Eye, EyeOff, ArrowRight } from "lucide-react";

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

      router.replace("/admin/orders");
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
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-[#380712] p-12 text-white lg:flex lg:flex-col lg:justify-between xl:p-20">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-[#D4AF69]/20" />
          <div className="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full border border-[#D4AF69]/20" />

          <div className="relative z-10">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-[#D4AF69]">
              Mydhili Collections
            </p>
          </div>

          <div className="relative z-10 max-w-xl">
            <p className="mb-5 text-xs uppercase tracking-[0.35em] text-[#D4AF69]">
              Boutique Administration
            </p>

            <h1 className="font-serif text-5xl leading-tight xl:text-6xl">
              Elegance in every detail.
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-white/70">
              Manage orders and keep your boutique running smoothly from one
              secure workspace.
            </p>

            <div className="mt-10 h-px w-20 bg-[#D4AF69]" />
          </div>

          <p className="relative z-10 text-xs tracking-wide text-white/50">
            © {currentYear ?? ""} Mydhili Collections
          </p>
        </section>

        {/* Login form */}
        <section className="flex min-h-screen items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <p className="text-sm font-semibold uppercase tracking-[0.25em]">
                Mydhili Collections
              </p>
              <div className="mt-4 h-px w-16 bg-[#D4AF69]" />
            </div>

            <div className="mb-8">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#D4AF69]/50 bg-white">
                <LockKeyhole className="h-6 w-6 text-[#9A6B35]" />
              </div>

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#9A6B35]">
                Admin Portal
              </p>

              <h2 className="font-serif text-4xl sm:text-5xl">
                Welcome back
              </h2>

              <p className="mt-4 text-sm leading-6 text-neutral-600">
                Sign in with your administrator credentials to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium"
                >
                  Email address
                </label>

                <div className="flex items-center gap-3 border border-[#E5DCD0] bg-white px-4 transition focus-within:border-[#9A6B35]">
                  <Mail className="h-4 w-4 shrink-0 text-[#9A6B35]" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="username"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="admin@example.com"
                    className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium"
                >
                  Password
                </label>

                <div className="flex items-center gap-3 border border-[#E5DCD0] bg-white px-4 transition focus-within:border-[#9A6B35]">
                  <LockKeyhole className="h-4 w-4 shrink-0 text-[#9A6B35]" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter your password"
                    className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-neutral-400"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="shrink-0 text-neutral-500 hover:text-[#380712]"
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
                  className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-3 bg-[#380712] px-5 text-sm font-medium text-white transition hover:bg-[#520D1D] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to dashboard"}

                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>

            <p className="mt-8 text-center text-xs leading-6 text-neutral-500">
              Authorized administrators only. Keep your login credentials
              confidential.
            </p>

            <p className="mt-8 text-center text-xs text-neutral-400 lg:hidden">
              © {currentYear ?? ""} Mydhili Collections
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
