"use client";

import { useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRight, Check, Mail } from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-newsletter",
  display: "swap",
});

const perks = ["New arrivals first", "Styling ideas", "Members-only offers"];

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setIsError(true);
      setMessage("Please enter your email address.");
      return;
    }

    // TODO: send `email` to your subscription API here.
    setIsError(false);
    setMessage(
      "Thank you for your interest! Email subscriptions will be available soon."
    );
  }

  return (
    <section
      className={`${bricolage.variable} bg-[#FAF7F2] px-5 py-8 font-[family-name:var(--font-newsletter)] sm:px-8 sm:py-10 lg:px-10 lg:py-12`}
    >
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#F8E9CF] via-[#F1D9A8] to-[#E6C47A] px-6 py-10 shadow-[0_24px_60px_rgba(56,7,18,0.1)] sm:px-10 sm:py-12 lg:px-16 lg:py-14">
        {/* Decorative rings */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full border border-[#380712]/10 sm:h-[26rem] sm:w-[26rem]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-[#380712]/10 sm:h-80 sm:w-80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border border-[#380712]/10"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/70 to-transparent"
        />

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Text */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-px w-8 bg-[#380712]" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#380712] sm:text-xs">
                A note from Mydhili
              </p>
            </div>

            <h2 className="text-[clamp(2rem,4.8vw,3.8rem)] font-semibold leading-[1.05] tracking-[-0.035em] text-[#380712]">
              A little elegance,
              <br />
              <span className="text-[#8B2635]">delivered to you.</span>
            </h2>

            <p className="mt-5 max-w-lg text-sm font-normal leading-7 text-[#380712]/75 sm:text-base sm:leading-8">
              Be the first to discover new collections, seasonal inspiration,
              thoughtful styling ideas, and special offers from Mydhili
              Collections.
            </p>

            <ul className="mt-7 flex flex-wrap gap-2.5">
              {perks.map((perk) => (
                <li
                  key={perk}
                  className="inline-flex items-center gap-2 rounded-full border border-[#380712]/15 bg-white/50 px-4 py-2 text-xs font-medium text-[#380712] backdrop-blur-sm"
                >
                  <Check size={14} strokeWidth={2.2} className="text-[#8B2635]" />
                  {perk}
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <div className="rounded-3xl bg-[#380712] p-6 text-white shadow-[0_24px_60px_rgba(56,7,18,0.3)] sm:p-8">
            <p className="text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
              Join the Mydhili list
            </p>
            <p className="mt-1.5 text-sm font-light text-white/65">
              One thoughtful email at a time. No spam.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>

              <div className="flex items-center gap-3 rounded-full border border-white/20 bg-white px-5 transition focus-within:border-[#D4AF69] focus-within:ring-4 focus-within:ring-[#D4AF69]/25">
                <Mail
                  size={18}
                  strokeWidth={1.5}
                  className="shrink-0 text-[#9A6B35]"
                />
                <input
                  id="newsletter-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setMessage("");
                  }}
                  aria-invalid={isError}
                  placeholder="Your email address"
                  className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[#380712] outline-none placeholder:text-stone-400"
                />
              </div>

              <button
                type="submit"
                className="group relative mt-3 inline-flex h-14 w-full items-center justify-between overflow-hidden rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-8 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] shadow-[0_10px_30px_rgba(212,175,105,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_36px_rgba(212,175,105,0.4)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF69]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-white/40 opacity-0 blur-[2px] transition-all duration-700 group-hover:left-[120%] group-hover:opacity-100"
                />
                <span className="relative">Subscribe</span>
                <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] transition-transform duration-300 group-hover:rotate-[-45deg]">
                  <ArrowRight size={16} strokeWidth={2} />
                </span>
              </button>
            </form>

            <div className="min-h-[1.5rem]">
              {message && (
                <p
                  role="status"
                  aria-live="polite"
                  className={`mt-4 text-sm ${
                    isError ? "text-[#FFB4B4]" : "text-[#E6C47A]"
                  }`}
                >
                  {message}
                </p>
              )}
            </div>

            <p className="mt-2 text-xs font-light text-white/50">
              Only beautiful updates. Unsubscribe whenever you like.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}