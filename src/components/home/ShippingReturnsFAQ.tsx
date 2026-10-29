"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Bricolage_Grotesque } from "next/font/google";
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Headphones,
  Mail,
  Plus,
  Search,
  X,
} from "lucide-react";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-faq",
  display: "swap",
});

const supportEmail: string = ""; // TODO: Add Mydhili Collections support email
const supportPhone: string = ""; // TODO: Add Mydhili Collections contact number

type Topic = "Shipping" | "Returns" | "Sarees" | "Support";

type Faq = {
  topic: Topic;
  question: string;
  answer: string;
};

const topics: ("All" | Topic)[] = ["All", "Shipping", "Returns", "Sarees", "Support"];

const faqs: Faq[] = [
  // Shipping
  {
    topic: "Shipping",
    question: "Do you ship internationally?",
    answer:
      "We aim to offer international shipping to supported destinations. Shipping charges, delivery estimates, customs duties and import taxes depend on the destination. Please contact our support team to confirm availability before placing an international order.",
  },
  {
    topic: "Shipping",
    question: "How long will my order take to arrive?",
    answer:
      "Ready-to-dispatch orders are estimated to arrive within 1–4 days inside India. International deliveries may take up to 7 working days after dispatch, depending on the destination and customs clearance. These are estimates, not guaranteed delivery dates. Pre-order items may require 25–30 working days before dispatch.",
  },
  {
    topic: "Shipping",
    question: "How long do pre-order items take?",
    answer:
      "Pre-order products may require approximately 25–30 working days before dispatch. This is the estimated preparation period, not the total delivery time. Please also review any product-specific timeline shown at checkout or on the product page.",
  },
  {
    topic: "Shipping",
    question: "Will I get tracking information?",
    answer:
      "We use suitable courier partners depending on the destination and service availability. Where tracking is available, we will share the relevant tracking information after dispatch.",
  },
  {
    topic: "Shipping",
    question: "What can delay my delivery?",
    answer:
      "Delivery times are estimates and are not guaranteed. Remote locations, public holidays, weather, customs and courier delays may affect delivery.",
  },
  {
    topic: "Shipping",
    question: "Will I pay customs duties or extra shipping charges?",
    answer:
      "Shipping charges and applicable duties will be communicated where available before you complete your order. For international orders, customs duties and import taxes depend on the destination.",
  },

  // Returns
  {
    topic: "Returns",
    question: "Can I return a product if I change my mind?",
    answer:
      "Returns are assessed according to the product category and the conditions in our policy. For eligible non-saree items, contact us within 7 days of delivery. Items must generally be unworn, unused, unwashed and undamaged, with original tags and packaging. Sarees have a separate policy because of their traditional weave and finish. Please contact us before sending an item back.",
  },
  {
    topic: "Returns",
    question: "What if I receive a damaged or incorrect product?",
    answer:
      "Contact us within 48 hours of delivery, with your order number, clear photographs and, if available, a complete unboxing video showing the outer parcel and shipping label. Keep the packaging and product unused while we review your request. We will guide you through the next steps.",
  },
  {
    topic: "Returns",
    question: "Are discounted products eligible for returns?",
    answer:
      "Sale and discounted products are generally final sale unless they arrive damaged, defective or materially different from what you ordered, or applicable law requires otherwise. Please check the product listing and contact support if you need clarification before ordering.",
  },
  {
    topic: "Returns",
    question: "Who pays for return shipping?",
    answer:
      "For an eligible damaged, defective or incorrect item confirmed by our team, we will explain the return arrangements. For approved change-of-mind returns or exchanges, the customer may be responsible for return shipping. International return shipping and customs charges are generally the customer's responsibility unless applicable law or our written confirmation states otherwise.",
  },
  {
    topic: "Returns",
    question: "How do I start a return or exchange?",
    answer:
      "First, contact us with your order number, delivery date and the reason for your request. Then share photographs and, if available, an unboxing video. Wait for our team to review and confirm the next steps, and only then follow the approved return instructions. Please do not send anything back before we confirm.",
  },
  {
    topic: "Returns",
    question: "When are refunds or exchanges processed?",
    answer:
      "Refunds or exchanges are processed after the returned item has been received and reviewed. Our team will explain the applicable resolution, which may include a replacement, exchange or refund.",
  },

  // Sarees
  {
    topic: "Sarees",
    question: "How do saree returns work?",
    answer:
      "A saree may qualify for review if it has a material defect, such as a tear, an incorrect stated length or a missing blouse piece when one was included in the product description. Minor weave irregularities and natural variations described in our saree policy are not automatically defects. Contact us within 3 days of delivery.",
  },
  {
    topic: "Sarees",
    question: "What counts as a natural characteristic of a saree?",
    answer:
      "Small thread knots, slubs and minor weaving irregularities, minor thread variations around borders or motifs, slight colour differences caused by lighting, photography or screen settings, and loose tying threads in Bandhani sarees can be part of the traditional process. These examples are not an automatic rejection of a claim. The actual product, description and nature of the issue will be considered.",
  },
  {
    topic: "Sarees",
    question: "What counts as a material defect in a saree?",
    answer:
      "Examples include a tear or significant damage not disclosed in the listing, a material difference between the actual length and the stated specifications, or a missing blouse piece when one was explicitly included in the product description. Once a defect is verified, we will explain the appropriate resolution.",
  },

  // Support
  {
    topic: "Support",
    question: "How can I contact customer support?",
    answer:
      "You can reach us using the support contact details on this page. Our planned support hours are Monday to Saturday, 10:00 AM–7:00 PM IST. Please include your order number when contacting us about an existing order.",
  },
  {
    topic: "Support",
    question: "What should I include when I contact you?",
    answer:
      "Your order number, the reason for your request and, for damaged or incorrect items, clear photographs and an unboxing video if you have one. If video evidence is unavailable, contact support with the evidence you have.",
  },
];

export default function FaqPage() {
  const [topic, setTopic] = useState<"All" | Topic>("All");
  const [query, setQuery] = useState("");
  const [openId, setOpenId] = useState<string | null>(faqs[0].question);
  const listRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const map: Record<string, number> = { All: faqs.length };
    faqs.forEach((f) => (map[f.topic] = (map[f.topic] ?? 0) + 1));
    return map;
  }, []);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return faqs.filter(
      (f) =>
        (topic === "All" || f.topic === topic) &&
        (!q ||
          f.question.toLowerCase().includes(q) ||
          f.answer.toLowerCase().includes(q))
    );
  }, [topic, query]);

  // Jump back to the top of the list when the filter changes
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [topic, query]);

  // Structured data so search engines can show these as FAQ results
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }).replace(/</g, "\\u003c");

  return (
    <section
      className={`${bricolage.variable} bg-[#FAF7F2] px-4 py-8 font-[family-name:var(--font-faq)] text-[#380712] sm:px-6 sm:py-10 lg:px-8 lg:py-14`}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }}
      />

      <div className="mx-auto grid max-w-[1320px] gap-5 lg:grid-cols-[380px_1fr]">
        {/* LEFT: title, search, topics, contact */}
        <aside className="relative flex min-h-[460px] flex-col justify-between overflow-hidden rounded-3xl bg-[#380712] p-6 text-white shadow-[0_24px_60px_rgba(56,7,18,0.2)] sm:p-7">
            <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-[#D4AF69]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-28 -right-20 h-64 w-64 rounded-full bg-[#8B2635]/40 blur-3xl" />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />

            <div className="relative flex min-h-0 flex-1 flex-col lg:overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-8 bg-[#D4AF69]" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[#E6C47A]">
                  Customer Care
                </p>
              </div>

              <h1 className="text-[clamp(1.9rem,3vw,2.6rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
                Frequently asked <span className="text-[#E6C47A]">questions.</span>
              </h1>

              <p className="mt-3 hidden text-sm font-light leading-6 text-white/70 [@media(min-height:780px)]:block">
                Quick answers about shipping, returns, sarees and your order.
              </p>

              {/* Search */}
              <div className="mt-5 flex items-center gap-3 rounded-full border border-white/20 bg-white px-4 transition focus-within:border-[#D4AF69] focus-within:ring-4 focus-within:ring-[#D4AF69]/25">
                <Search size={17} strokeWidth={1.6} className="shrink-0 text-[#9A6B35]" />
                <label htmlFor="faq-search" className="sr-only">
                  Search questions
                </label>
                <input
                  id="faq-search"
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search refund, saree, delivery"
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm text-[#380712] outline-none placeholder:text-stone-400 [&::-webkit-search-cancel-button]:hidden"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    aria-label="Clear search"
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-stone-500 transition hover:bg-stone-100 hover:text-[#380712]"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              {/* Topics: chips on mobile, vertical list on desktop */}
              <div
                role="tablist"
                aria-label="FAQ topics"
                className="-mx-1 mt-5 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:mx-0 lg:flex-col lg:gap-1.5 lg:overflow-visible lg:px-0 lg:pb-0"
              >
                {topics.map((t) => {
                  const active = topic === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setTopic(t)}
                      className={`flex shrink-0 items-center justify-between gap-3 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 lg:w-full ${
                        active
                          ? "bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] text-[#380712]"
                          : "border border-white/15 text-white/80 hover:border-[#D4AF69]/60 hover:text-white lg:border-transparent lg:hover:bg-white/5"
                      }`}
                    >
                      {t}
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] tabular-nums ${
                          active ? "bg-[#380712]/15" : "bg-white/10 text-[#E6C47A]"
                        }`}
                      >
                        {counts[t]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Contact */}
              <div className="mt-6 border-t border-white/10 pt-5 lg:mt-auto">
                <p className="text-sm font-semibold tracking-[-0.01em]">Still need help?</p>
                <p className="mt-1 inline-flex items-center gap-2 text-xs font-light text-[#E6C47A]">
                  <Clock3 size={13} />
                  Mon–Sat · 10:00 AM–7:00 PM IST
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  {supportEmail ? (
                    <a
                      href={`mailto:${supportEmail}`}
                      className="group inline-flex h-11 items-center gap-2.5 rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-[#380712] transition-all duration-300 hover:-translate-y-0.5"
                    >
                      <Mail size={15} />
                      Email us
                    </a>
                  ) : null}

                  {supportPhone ? (
                    <a
                      href={`tel:${supportPhone.replace(/[^\d+]/g, "")}`}
                      className="inline-flex h-11 items-center gap-2.5 rounded-full border border-white/30 px-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition-all duration-300 hover:border-[#E6C47A] hover:text-[#E6C47A]"
                    >
                      <Headphones size={15} />
                      Call us
                      <ArrowUpRight size={14} />
                    </a>
                  ) : null}
                </div>

                {(!supportEmail || !supportPhone) && (
                  <p className="mt-2 text-xs font-light leading-5 text-white/50">
                    {!supportEmail && !supportPhone
                      ? "Support email and phone will be added soon."
                      : !supportEmail
                      ? "Support email will be added soon."
                      : "Phone support will be added soon."}
                  </p>
                )}
              </div>
            </div>
          </aside>

          {/* RIGHT: scrollable questions */}
          <div className="flex min-h-[460px] max-h-[640px] flex-col overflow-hidden rounded-3xl border border-[#E9DFD2] bg-white shadow-[0_16px_50px_rgba(56,7,18,0.06)]">
            <div className="flex items-center justify-between gap-4 border-b border-[#E9DFD2] px-5 py-4 sm:px-7">
              <p className="text-sm font-semibold tracking-[-0.01em]">
                {topic === "All" ? "All questions" : topic}
                <span className="ml-2 text-xs font-medium text-[#9A6B35]">
                  {visible.length}
                </span>
              </p>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9A6B35] transition hover:text-[#380712]"
              >
                Continue shopping
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
            </div>

            <div
              ref={listRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 sm:px-7 [scrollbar-color:#D4AF69_transparent] [scrollbar-width:thin]"
            >
              {visible.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-10 text-center">
                  <h2 className="text-xl font-semibold tracking-[-0.02em]">
                    No matching questions
                  </h2>
                  <p className="mt-2 text-sm font-light text-stone-500">
                    Try a different word, or contact our team.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setTopic("All");
                    }}
                    className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#9A6B35] transition hover:text-[#380712]"
                  >
                    Show all questions
                    <ArrowRight size={14} />
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-[#E9DFD2]">
                  {visible.map((faq, index) => {
                    const isOpen = openId === faq.question;
                    const panelId = `faq-panel-${faqs.indexOf(faq)}`;

                    return (
                      <div key={faq.question}>
                        <h3>
                          <button
                            type="button"
                            onClick={() => setOpenId(isOpen ? null : faq.question)}
                            aria-expanded={isOpen}
                            aria-controls={panelId}
                            className="group flex w-full items-center justify-between gap-4 py-4 text-left"
                          >
                            <span className="flex min-w-0 items-start gap-4">
                              <span className="mt-0.5 text-xs font-semibold tabular-nums tracking-[0.15em] text-[#9A6B35]">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <span
                                className={`text-[15px] font-medium leading-6 tracking-[-0.01em] transition-colors sm:text-base ${
                                  isOpen ? "text-[#380712]" : "group-hover:text-[#9A6B35]"
                                }`}
                              >
                                {faq.question}
                              </span>
                            </span>

                            <span
                              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-300 ${
                                isOpen
                                  ? "rotate-45 bg-[#380712] text-[#E6C47A]"
                                  : "bg-[#FAF3E8] text-[#380712]"
                              }`}
                            >
                              <Plus size={16} strokeWidth={1.8} />
                            </span>
                          </button>
                        </h3>

                        <div
                          id={panelId}
                          role="region"
                          className={`grid transition-all duration-300 ease-out ${
                            isOpen
                              ? "grid-rows-[1fr] opacity-100"
                              : "grid-rows-[0fr] opacity-0"
                          }`}
                        >
                          <div className="overflow-hidden">
                            <p className="pb-5 pl-9 pr-2 text-sm font-light leading-7 text-stone-600 sm:pl-10">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <p className="border-t border-[#E9DFD2] px-5 py-3 text-center text-[11px] font-light leading-5 text-stone-500 sm:px-7">
              Delivery times are estimates and are not guaranteed. Policies may
              vary by product, destination and applicable law.
            </p>
          </div>
        </div>
    </section>
  );
}