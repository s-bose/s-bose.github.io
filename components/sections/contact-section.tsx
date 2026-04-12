"use client";

import { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { personal } from "@/lib/personal";
import { IconBrandGithub } from "@/components/icons/brand-github";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch(`https://formspree.io/f/placeholder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-12">
      <p className="text-xs tracking-[0.25em] text-muted-foreground mb-8 uppercase font-semibold">
        Contact
      </p>

      <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
        {/* ── Contact details ──────────────────────────── */}
        <div className="space-y-5">
          <p className="text-sm text-foreground/80 leading-relaxed">
            Feel free to reach out — whether it&apos;s a project idea,
            collaboration, or just to say hello.
          </p>

          <div className="space-y-3">
            <a
              href={`mailto:${personal.email}`}
              className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
            >
              <Mail className="size-4 shrink-0 group-hover:text-foreground" />
              {personal.email}
            </a>

            {personal.phone && (
              <a
                href={`tel:${personal.phone}`}
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                <Phone className="size-4 shrink-0 group-hover:text-foreground" />
                {personal.phone}
              </a>
            )}

            {personal.links?.github && (
              <a
                href={personal.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors duration-200 group"
              >
                <IconBrandGithub className="size-4 shrink-0 group-hover:text-foreground" />
                {personal.links.github.replace("https://", "")}
              </a>
            )}
          </div>
        </div>

        {/* ── Contact form ─────────────────────────────── */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label
              htmlFor="name"
              className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground"
            >
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="Your name"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="email"
              className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="message"
              className="text-[10px] tracking-[0.18em] uppercase text-muted-foreground"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={4}
              value={form.message}
              onChange={handleChange}
              placeholder="What's on your mind?"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition resize-none"
            />
          </div>

          <Button
            type="submit"
            size="sm"
            disabled={status === "sending" || status === "sent"}
            className="gap-2"
          >
            <Send className="size-3.5" />
            {status === "sending"
              ? "Sending…"
              : status === "sent"
                ? "Sent!"
                : "Send Message"}
          </Button>

          {status === "error" && (
            <p className="text-xs text-destructive mt-1">
              Something went wrong. Please try again or email directly.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
