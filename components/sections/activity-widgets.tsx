import { BookOpen, Gamepad2 } from "lucide-react";

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

const CONTENT_HEIGHT = 152;

export function ActivityWidgets() {
  return (
    <section className="py-8 border-t border-b border-border">
      <p className="text-[9px] tracking-[0.2em] text-muted-foreground mb-5 uppercase">
        Activities
      </p>
      <div className="grid grid-cols-3 gap-4">
        {/* ── Spotify ── */}
        <a
          href="https://open.spotify.com/track/5B8N5rPOmTVVGpuBMK2Vby"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border overflow-hidden flex flex-col hover:opacity-80 transition-opacity duration-200"
        >
          <div
            className="w-full shrink-0 overflow-hidden bg-muted"
            style={{ height: CONTENT_HEIGHT }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://i.discogs.com/9CpNNr6MFo9YBD6LqAV3I2Qb-ENkxMMNtkFkYHMNA3c/rs:fit/g:sm/q:90/h:600/w:596/czM6Ly9kaXNjb2dz/LWRhdGFiYXNlLWlt/YWdlcy9SLTM1NzMz/NDUtMTY5NDQwNjg5/NC0xOTgzLmpwZWc.jpeg"
              alt="Teen Idle"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-green-500 uppercase">
              <SpotifyIcon className="size-2.5 shrink-0" />
              Spotify
            </span>
            <p className="text-xs font-semibold text-foreground leading-snug line-clamp-1">
              Teen Idle
            </p>
            <p className="text-[10px] text-muted-foreground line-clamp-1">
              Marina
            </p>
          </div>
        </a>

        {/* ── Books ── */}
        <a
          href="https://www.goodreads.com/book/show/18143977-all-the-light-we-cannot-see"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border overflow-hidden flex flex-col hover:opacity-80 transition-opacity duration-200"
        >
          <div
            className="w-full shrink-0 overflow-hidden bg-muted"
            style={{ height: CONTENT_HEIGHT }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://covers.openlibrary.org/b/isbn/9781476746586-L.jpg"
              alt="All the Light We Cannot See"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-amber-500 uppercase">
              <BookOpen className="size-2.5 shrink-0" />
              Reading
            </span>
            <p className="text-xs font-semibold text-foreground leading-snug line-clamp-1">
              All the Light We Cannot See
            </p>
            <p className="text-[10px] text-muted-foreground line-clamp-1">
              Anthony Doerr
            </p>
          </div>
        </a>

        {/* ── Steam ── */}
        <a
          href="https://store.steampowered.com/app/1259420/Days_Gone/"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-border overflow-hidden flex flex-col hover:opacity-80 transition-opacity duration-200"
        >
          <div
            className="w-full shrink-0 overflow-hidden bg-muted"
            style={{ height: CONTENT_HEIGHT }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://cdn.akamai.steamstatic.com/steam/apps/1259420/header.jpg"
              alt="Days Gone"
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div className="flex flex-col gap-0.5 px-3 py-2.5">
            <span className="flex items-center gap-1.5 text-[9px] tracking-[0.2em] text-sky-400 uppercase">
              <Gamepad2 className="size-2.5 shrink-0" />
              Steam
            </span>
            <p className="text-xs font-semibold text-foreground leading-snug line-clamp-1">
              Days Gone
            </p>
            <p className="text-[10px] text-muted-foreground line-clamp-1">
              Bend Studio
            </p>
          </div>
        </a>
      </div>
    </section>
  );
}
