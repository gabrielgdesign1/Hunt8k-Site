"use client";

import { SITE } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import SocialIcon from "@/components/ui/SocialIcon";

export default function Contact() {
  return (
    <section id="contact" className="relative z-10 py-24 md:py-32">
      {/* glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,33,22,0.22),transparent_65%)] blur-3xl" />

      <div className="mx-auto max-w-[1400px] px-5 md:px-8">
        <div className="grid gap-14 md:grid-cols-2 md:gap-16">
          {/* left */}
          <div>
            <Reveal>
              <SectionLabel>Get in Touch</SectionLabel>
            </Reveal>
            <Reveal i={1}>
              <h2 className="mt-5 font-display text-balance text-[clamp(3rem,9vw,7rem)] leading-[0.85] uppercase">
                Let&apos;s make
                <br />
                <span className="text-gradient-red">them click.</span>
              </h2>
            </Reveal>
            <Reveal i={2}>
              <p className="mt-6 max-w-md text-[var(--color-ash)] leading-relaxed">
                Got a video that deserves a better thumbnail? Reach out on
                socials or drop an email — I usually reply within a few hours.
              </p>
            </Reveal>

            <Reveal i={3}>
              <a
                href={`mailto:${SITE.email}`}
                className="group mt-9 flex w-fit items-center gap-4 text-lg text-[var(--color-bone)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 transition-colors group-hover:border-[var(--color-red)] group-hover:text-[var(--color-red)]">
                  @
                </span>
                {SITE.email}
              </a>
            </Reveal>
          </div>

          {/* socials */}
          <Reveal i={2}>
            <div className="flex flex-col gap-4">
              {SITE.socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-[var(--color-ink-2)] px-6 py-5 transition-colors duration-300 hover:border-[var(--color-red)]/50"
                >
                  <span className="flex items-center gap-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/5 text-[var(--color-bone)] transition-colors duration-300 group-hover:bg-[var(--color-red)] group-hover:text-white">
                      <SocialIcon icon={s.icon} />
                    </span>
                    <span className="font-display text-2xl uppercase leading-none">
                      {s.label}
                    </span>
                  </span>
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-[var(--color-ash)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--color-red-bright)]"
                  >
                    <path d="M7 17L17 7M17 7H8M17 7V16" />
                  </svg>
                </a>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
