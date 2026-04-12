export function FeaturedImage() {
  return (
    <section className="py-4">
      <div
        className="relative overflow-hidden rounded border border-border"
        style={{ aspectRatio: "16/7" }}
      >
        {/* Circuit board grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "oklch(0.08 0 0)",
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Radial glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 90%, rgba(200,200,200,0.13) 0%, transparent 60%)",
          }}
        />
        {/* Dot intersections */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.35) 1px, transparent 1px)`,
            backgroundSize: "32px 32px",
          }}
        />
        {/* Horizontal signal lines */}
        <div className="absolute inset-0 flex flex-col justify-around opacity-10 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="w-full border-t border-white/60"
              style={{ marginLeft: `${i * 7}%`, width: `${60 + i * 8}%` }}
            />
          ))}
        </div>
        {/* Central glow orb */}
        <div
          className="absolute"
          style={{
            left: "50%",
            bottom: "10%",
            transform: "translateX(-50%)",
            width: "180px",
            height: "180px",
            background:
              "radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
      </div>
      <p className="text-right mt-2 text-muted-foreground uppercase tracking-[0.15em]" style={{ fontSize: "9px" }}>
        Ref: IMU_4X43 // Monolith_Static
      </p>
    </section>
  );
}
