"use client";

import { useState, type FormEvent } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRight, ArrowUpRight, Clock3, Mail, MapPin, MessageCircle } from "lucide-react";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-contact", display: "swap" });

// TODO: fill these in. Rows with empty values show a placeholder.
const email: string = "";
const whatsapp: string = "";
const address: string = "";

const info = [
  { icon: Mail, title: "Email us", value: email, href: email ? `mailto:${email}` : "", empty: "Boutique email will be added soon." },
  { icon: MessageCircle, title: "WhatsApp", value: whatsapp, href: whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}` : "", empty: "Contact us for product and order enquiries." },
  { icon: MapPin, title: "Our boutique", value: address, href: "", empty: "Boutique address will be added soon." },
  { icon: Clock3, title: "Support hours", value: "Mon–Sat · 10:00 AM–7:00 PM IST", href: "", empty: "" },
];

const subjects = [
  { value: "product", label: "Product enquiry" },
  { value: "order", label: "Order assistance" },
  { value: "delivery", label: "Delivery enquiry" },
  { value: "other", label: "Other" },
];

const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.28em] sm:text-xs";
const labelCls = "mb-2 block text-[11px] font-semibold uppercase tracking-[0.14em]";
const inputCls = "w-full rounded-xl border border-[#E5DDD2] bg-[#FFFEFC] px-4 py-3.5 text-sm outline-none transition placeholder:text-stone-400 focus:border-[#D4AF69] focus:ring-4 focus:ring-[#D4AF69]/20";
const goldBtn = "group flex h-14 w-full items-center justify-between rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-8 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] shadow-[0_10px_30px_rgba(212,175,105,0.3)] transition-all duration-300 hover:-translate-y-0.5";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // TODO: send the form data to your email service or API here.
    setSubmitted(true);
  }

  return (
    <main className={`${bricolage.variable} bg-[#FAF7F2] font-[family-name:var(--font-contact)] text-[#380712]`}>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#380712] px-5 py-14 text-center text-white sm:py-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[#D4AF69]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -right-20 h-72 w-72 rounded-full bg-[#8B2635]/40 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />
        <div className="relative mx-auto max-w-2xl">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-[#D4AF69]" />
            <p className={`${eyebrow} text-[#E6C47A]`}>We&apos;d love to hear from you</p>
            <span className="h-px w-8 bg-[#D4AF69]" />
          </div>
          <h1 className="text-[clamp(2.2rem,5.5vw,4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">Get in <span className="text-[#E6C47A]">touch.</span></h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-light leading-7 text-white/75 sm:text-base">Have a question about a product, an order or your shopping experience? We are here to help.</p>
        </div>
      </section>

      <section className="px-4 pb-16 sm:px-6 sm:pb-24">
        <div className="relative z-10 mx-auto -mt-8 grid max-w-7xl gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-8">
          {/* Info */}
          <div className="rounded-3xl border border-[#E9DFD2] bg-white p-6 shadow-[0_24px_60px_rgba(56,7,18,0.08)] sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#A27B35]" />
              <p className={`${eyebrow} text-[#946C2D]`}>Contact information</p>
            </div>
            <h2 className="text-2xl font-semibold leading-tight tracking-[-0.03em] sm:text-3xl">Let&apos;s start a <span className="text-[#A27B35]">conversation.</span></h2>
            <p className="mt-3 text-sm font-light leading-7 text-stone-600">Whether you need help choosing a style or have a question about your order, feel free to reach out.</p>

            <ul className="mt-7 space-y-3">
              {info.map(({ icon: Icon, title, value, href, empty }) => (
                <li key={title} className="flex items-start gap-4 rounded-2xl border border-[#E9DFD2] bg-[#FAF7F2] p-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-[#9A6B35]"><Icon size={19} strokeWidth={1.5} /></span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    {href ? (
                      <a href={href} className="mt-0.5 block break-all text-sm text-[#9A6B35] transition hover:text-[#380712]">{value}</a>
                    ) : (
                      <p className="mt-0.5 text-sm font-light text-stone-500">{value || empty}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>

            <a href="https://www.instagram.com/mydhilicollections2010/" target="_blank" rel="noreferrer" className="group mt-6 inline-flex items-center gap-2 border-b border-[#B99A61] pb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] transition hover:text-[#9A6B35]">
              Follow us on Instagram
              <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </a>
          </div>

          {/* Form */}
          <div className="rounded-3xl border border-[#E9DFD2] bg-white p-6 shadow-[0_24px_60px_rgba(56,7,18,0.08)] sm:p-8">
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-8 bg-[#A27B35]" />
              <p className={`${eyebrow} text-[#946C2D]`}>Send an enquiry</p>
            </div>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">How can we <span className="text-[#A27B35]">help you?</span></h2>

            {submitted ? (
              <div className="mt-7 rounded-2xl border border-[#D4AF69]/40 bg-[#FAF3E8] p-6">
                <h3 className="text-xl font-semibold tracking-[-0.02em]">Thank you!</h3>
                <p className="mt-2 text-sm font-light leading-7 text-stone-600">Your form has been completed. The enquiry form still needs to be connected to an email service or backend before messages can be delivered to the boutique.</p>
                <button type="button" onClick={() => setSubmitted(false)} className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-[#9A6B35] underline underline-offset-4 hover:text-[#380712]">Send another enquiry</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className={labelCls}>Your name *</label>
                    <input id="name" required name="name" autoComplete="name" placeholder="Enter your name" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="email" className={labelCls}>Email address *</label>
                    <input id="email" required name="email" type="email" autoComplete="email" placeholder="you@example.com" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="phone" className={labelCls}>Phone number</label>
                    <input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="Enter your phone number" className={inputCls} />
                  </div>
                  <div>
                    <label htmlFor="subject" className={labelCls}>Subject *</label>
                    <select id="subject" required name="subject" defaultValue="" className={inputCls}>
                      <option value="" disabled>Select an enquiry type</option>
                      {subjects.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="message" className={labelCls}>Your message *</label>
                  <textarea id="message" required name="message" rows={5} placeholder="Write your message here..." className={`${inputCls} resize-none`} />
                </div>
                <button type="submit" className={goldBtn}>
                  Submit enquiry
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] transition-transform duration-300 group-hover:rotate-[-45deg]"><ArrowRight size={18} strokeWidth={2} /></span>
                </button>
              </form>
            )}
          </div>
        </div>

        <p className="mt-12 text-center text-lg font-medium tracking-[-0.02em]">Thank you for choosing Mydhili. <span className="block text-sm font-light text-stone-500">We look forward to being part of your style journey.</span></p>
      </section>
    </main>
  );
}