import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const footerLinks = [
    { label: "RSS", href: "/rss.xml", external: false },
    {
        label: "GITHUB",
        href: "https://github.com/s-bose",
        external: true,
    },
    {
        label: "SOURCE",
        href: "https://github.com/s-bose/s-bose.github.io",
        external: true,
    },
];

export function Footer() {
    return (
        <footer className="flex items-center justify-between py-8 border-t border-border mt-8">
            <p
                className="text-muted-foreground tracking-[0.15em] uppercase"
                style={{ fontSize: "10px" }}
            >
                © {new Date().getFullYear()} BINARY_MONOLITH
            </p>

            <div className="flex items-center gap-5">
                {footerLinks.map(({ label, href, external }) => (
                    <Link
                        key={label}
                        href={href}
                        {...(external
                            ? { target: "_blank", rel: "noopener noreferrer" }
                            : {})}
                        className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        style={{ fontSize: "10px" }}
                    >
                        <ArrowUpRight className="size-2.5" />
                        <span className="tracking-[0.15em] uppercase">
                            {label}
                        </span>
                    </Link>
                ))}
            </div>
        </footer>
    );
}
