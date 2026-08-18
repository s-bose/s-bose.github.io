"use client";

import { useForm, ValidationError } from "@formspree/react";
import { Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { personal } from "@/lib/personal";
import { IconBrandGithub } from "@/components/icons/brand-github";

const FORMSPREE_FORM_ID = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;

export function ContactSection() {
  const [state, handleSubmit] = useForm(FORMSPREE_FORM_ID || "unconfigured");

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
        {state.succeeded ? (
          <p className="text-sm text-foreground/80 leading-relaxed self-start">
            Thanks for reaching out — I&apos;ll get back to you soon.
          </p>
        ) : (
          <form
            onSubmit={(e) => {
              if (!FORMSPREE_FORM_ID) {
                e.preventDefault();
                return;
              }
              handleSubmit(e);
            }}
            className="space-y-4"
          >
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
                placeholder="Your name"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
              />
              <ValidationError
                prefix="Name"
                field="name"
                errors={state.errors}
                className="text-xs text-destructive"
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
                placeholder="you@example.com"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition"
              />
              <ValidationError
                prefix="Email"
                field="email"
                errors={state.errors}
                className="text-xs text-destructive"
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
                placeholder="What's on your mind?"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition resize-none"
              />
              <ValidationError
                prefix="Message"
                field="message"
                errors={state.errors}
                className="text-xs text-destructive"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={state.submitting}
              className="gap-2"
            >
              <Send className="size-3.5" />
              {state.submitting ? "Sending…" : "Send Message"}
            </Button>

            {!FORMSPREE_FORM_ID && (
              <p className="text-xs text-destructive mt-1">
                Contact form is not configured yet.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
