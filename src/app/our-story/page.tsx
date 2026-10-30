import Link from "next/link";
import { Bricolage_Grotesque } from "next/font/google";
import { ArrowRight, Gem, Heart, Sparkles } from "lucide-react";

const bricolage = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-story", display: "swap" });

// Replace with your own photos, e.g. "/story/boutique.jpg"
const heroImage = "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1800&q=85";
const introImage = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85";

const values = [
  { icon: Heart, title: "Chosen with care", text: "Every piece is selected with attention to style, detail and the experience it brings." },
  { icon: Sparkles, title: "Timeless elegance", text: "We believe great style goes beyond trends. It is about feeling confident and comfortable." },
  { icon: Gem, title: "A personal touch", text: "We want every visit to feel welcoming, personal and special." },
];

const paragraphs = [
  "At Mydhili Collections, we believe that what you wear is more than a choice of clothing. It is an expression of personality, confidence and individuality.",
  "Our boutique is built around the idea of bringing together beautiful styles and thoughtful selections for different moments in life. We want every customer to discover pieces that feel personal and make them feel their best.",
  "From everyday favourites to special-occasion looks, our focus is on making your shopping experience welcoming, enjoyable and memorable.",
];

const eyebrow = "text-[10px] font-semibold uppercase tracking-[0.28em] sm:text-xs";
const goldBtn = "group inline-flex h-14 items-center gap-4 rounded-full bg-gradient-to-r from-[#E6C47A] via-[#D4AF69] to-[#B8893F] py-1.5 pl-8 pr-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-[#380712] shadow-[0_10px_30px_rgba(212,175,105,0.35)] transition-all duration-300 hover:-translate-y-0.5";
const arrowCircle = "flex h-11 w-11 items-center justify-center rounded-full bg-[#380712] text-[#E6C47A] transition-transform duration-300 group-hover:rotate-[-45deg]";

function Eyebrow({ children, light }: { children: string; light?: boolean }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className={`h-px w-8 ${light ? "bg-[#D4AF69]" : "bg-[#A27B35]"}`} />
      <p className={`${eyebrow} ${light ? "text-[#E6C47A]" : "text-[#946C2D]"}`}>{children}</p>
    </div>
  );
}

export default function OurStoryPage() {
  return (
    <main className={`${bricolage.variable} bg-[#FAF7F2] font-[family-name:var(--font-story)] text-[#380712]`}>
      {/* Hero */}
      <section className="relative isolate flex min-h-[440px] items-center overflow-hidden bg-[#380712] px-5 py-20 text-white sm:min-h-[500px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImage} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-30" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#210309]/95 via-[#380712]/80 to-[#380712]/40" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/70 to-transparent" />

        <div className="mx-auto w-full max-w-7xl px-0 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <Eyebrow light>The story of Mydhili</Eyebrow>
            <h1 className="text-[clamp(2.4rem,6.2vw,5rem)] font-semibold leading-[1.04] tracking-[-0.035em]">
              Style is personal.
              <br />
              <span className="text-[#E6C47A]">So are we.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm font-light leading-7 text-white/75 sm:text-base sm:leading-8">
              Discover the story behind Mydhili Collections, a boutique built around individuality, thoughtful style and the joy of finding something that feels just right.
            </p>
          </div>
        </div>
      </section>

      {/* Who we are + philosophy */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:py-24">
        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="pointer-events-none absolute inset-0 translate-x-4 translate-y-4 rounded-t-[999px] border border-[#D4AF69]/60" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={introImage} alt="Fashion collection" className="relative aspect-[4/5] w-full rounded-t-[999px] bg-[#380712] object-cover shadow-[0_30px_80px_rgba(56,7,18,0.25)]" />
        </div>

        <div className="max-w-xl">
          <Eyebrow>Who we are</Eyebrow>
          <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
            More than fashion. <span className="text-[#A27B35]">A feeling.</span>
          </h2>
          <div className="mt-6 space-y-4 text-sm font-light leading-8 text-stone-600">
            {paragraphs.map((p) => <p key={p}>{p}</p>)}
          </div>

          <blockquote className="mt-7 rounded-2xl border border-[#D4AF69]/40 bg-[#FAF3E8] p-5">
            <p className="text-lg font-semibold leading-snug tracking-[-0.02em]">Elegance in every detail. Confidence in every choice.</p>
            <p className="mt-2 text-sm font-light leading-7 text-stone-600">
              We believe personal style should feel effortless, centred on thoughtful selections and individual expression.
            </p>
          </blockquote>

          <Link href="/shop" className={`${goldBtn} mt-8`}>
            Explore our collection
            <span className={arrowCircle}><ArrowRight size={17} strokeWidth={2} /></span>
          </Link>
        </div>
      </section>

      {/* Values */}
      <section className="relative overflow-hidden bg-[#380712] px-5 py-16 text-white sm:px-8 lg:py-24">
        <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-[#D4AF69]/10 blur-3xl" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF69]/60 to-transparent" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mb-10 sm:mb-12">
            <Eyebrow light>What matters to us</Eyebrow>
            <h2 className="text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
              The Mydhili <span className="text-[#E6C47A]">experience.</span>
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3 md:gap-5">
            {values.map(({ icon: Icon, title, text }, index) => (
              <div key={title} className="group rounded-3xl border border-[#D4AF69]/20 bg-white/[0.04] p-7 transition-all duration-500 hover:-translate-y-1 hover:border-[#D4AF69]/60 hover:bg-white/[0.08]">
                <div className="flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full border border-[#D4AF69]/40 text-[#E6C47A] transition-colors duration-300 group-hover:bg-[#D4AF69] group-hover:text-[#380712]">
                    <Icon size={21} strokeWidth={1.5} />
                  </span>
                  <span className="text-xs font-medium tracking-[0.2em] text-[#D4AF69]/70">0{index + 1}</span>
                </div>
                <h3 className="mt-8 text-xl font-semibold tracking-[-0.02em]">{title}</h3>
                <p className="mt-3 text-sm font-light leading-7 text-white/70">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="px-5 py-16 text-center sm:py-20">
        <Eyebrow>Your style, your story</Eyebrow>
        <h2 className="mx-auto max-w-2xl text-[clamp(2rem,4.4vw,3.4rem)] font-semibold leading-[1.05] tracking-[-0.035em]">
          Find something that <span className="text-[#A27B35]">feels like you.</span>
        </h2>
        <Link href="/shop" className={`${goldBtn} mt-8`}>
          Shop the collection
          <span className={arrowCircle}><ArrowRight size={17} strokeWidth={2} /></span>
        </Link>
      </section>
    </main>
  );
}