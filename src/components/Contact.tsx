"use client";

import { useState } from "react";
import { SITE } from "@/lib/site";
import SectionLabel from "@/components/ui/SectionLabel";
import Reveal from "@/components/ui/Reveal";
import MagneticButton from "@/components/ui/MagneticButton";

export default function Contact() {
  const [form, setForm] = useState({ name: "", channel: "", message: "" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(
      `New thumbnail enquiry from ${form.name || "a creator"}`
    );
    const body = encodeURIComponent(
      `Name: ${form.name}\nChannel: ${form.channel}\n\n${form.message}`
    );
    window.location.href = `mailto:${SITE.email}?subject=${subject}&body=${body}`;
  };

  const field =
    "w-full rounded-xl border border-white/12 bg-white/[0.02] px-5 py-4 text-[var(--color-bone)] placeholder:text-[var(--color-ash-dim)] outline-none transition-colors focus:border-[var(--color-red)]";

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
                Got a video that deserves a better thumbnail? Tell me about your
                channel — I usually reply within a few hours.
              </p>
            </Reveal>

            <Reveal i={3}>
              <div className="mt-9 flex flex-col gap-4">
                <a
                  href={`mailto:${SITE.email}`}
                  data-cursor="email"
                  className="group flex items-center gap-4 text-lg text-[var(--color-bone)]"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/12 transition-colors group-hover:border-[var(--color-red)] group-hover:text-[var(--color-red)]">
                    @
                  </span>
                  {SITE.email}
                </a>
                <div className="flex flex-wrap gap-3">
                  {SITE.socials.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/12 px-4 py-2 font-mono text-xs uppercase tracking-widest text-[var(--color-ash)] transition-colors hover:border-[var(--color-red)] hover:text-[var(--color-bone)]"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* form */}
          <Reveal i={2}>
            <form
              onSubmit={submit}
              className="rounded-2xl border border-white/10 bg-[var(--color-ink-2)] p-6 md:p-8"
            >
              <div className="flex flex-col gap-4">
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash)]">
                    Your Name
                  </label>
                  <input
                    required
                    className={field}
                    placeholder="e.g. Alex"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash)]">
                    Channel / Link
                  </label>
                  <input
                    className={field}
                    placeholder="youtube.com/@yourchannel"
                    value={form.channel}
                    onChange={(e) =>
                      setForm({ ...form, channel: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="mb-2 block font-mono text-[10px] uppercase tracking-widest text-[var(--color-ash)]">
                    The Project
                  </label>
                  <textarea
                    required
                    rows={4}
                    className={`${field} resize-none`}
                    placeholder="Tell me about the video, style and volume…"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
                <MagneticButton
                  as="button"
                  cursor="send"
                  className="group mt-2 w-full overflow-hidden rounded-xl bg-[var(--color-red)] px-6 py-4 text-sm font-bold uppercase tracking-wide text-white"
                >
                  <span className="relative z-10">Send Message →</span>
                </MagneticButton>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
