import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function BlogPostLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4">
        <Nav />
        <main className="py-8">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
