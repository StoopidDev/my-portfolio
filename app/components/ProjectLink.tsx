"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const DURATION = 2800; // ms for the bar to fill

// Each log line appears once progress passes its threshold (0–100).
function logLines(host: string) {
  return [
    { at: 0, text: `$ open ${host}`, tone: "text-emerald-400" },
    { at: 12, text: `> resolving ${host} ...` },
    { at: 30, text: "> GET / 200 OK" },
    { at: 48, text: "> loading bundle.js" },
    { at: 66, text: "> hydrating components" },
    { at: 84, text: "> warming up the cache" },
    { at: 100, text: "✓ ready — redirecting", tone: "text-emerald-400" },
  ];
}

// A link that plays a fake "loading" terminal before navigating.
export default function ProjectLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [progress, setProgress] = useState(0);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const host = new URL(href).host;

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Let ctrl/cmd/shift/middle clicks open normally in a new tab.
    if (e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setProgress(0);
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return;
    cancelRef.current?.focus();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduceMotion ? 600 : DURATION;
    let start = 0;
    let frame = 0;
    let redirect: ReturnType<typeof setTimeout>;

    function tick(time: number) {
      if (!start) start = time;
      const t = Math.min((time - start) / duration, 1);
      // ease-out with a little stall in the middle so it feels like real loading
      const eased = 1 - Math.pow(1 - t, 2.2);
      setProgress(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
      else redirect = setTimeout(() => window.location.assign(href), 450);
    }
    frame = requestAnimationFrame(tick);

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(redirect);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, href]);

  // Coming back with the browser's Back button can restore the page with the
  // overlay still open — close it.
  useEffect(() => {
    function onShow(e: PageTransitionEvent) {
      if (e.persisted) setOpen(false);
    }
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  const filled = Math.round(progress / 5);
  const asciiBar = "█".repeat(filled) + "░".repeat(20 - filled);

  return (
    <>
      <a href={href} onClick={handleClick} className={className}>
        {children}
      </a>

      {/* Portal to <body>: the card sits inside a backdrop-blur panel, which
          would otherwise trap position:fixed inside that panel. */}
      {open &&
        createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Opening ${host}`}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
        >
          <div className="pop-in w-full max-w-lg overflow-hidden rounded-xl border border-white/10 bg-[#141414] shadow-2xl">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <span className="size-3 rounded-full bg-[#ff5f57]" />
              <span className="size-3 rounded-full bg-[#febc2e]" />
              <span className="size-3 rounded-full bg-emerald-500" />
              <span className="ml-3 font-mono text-xs text-zinc-500">launch.sh — {host}</span>
            </div>

            <div className="p-5 font-mono text-[13px] leading-6">
              <div className="min-h-[10.5rem]" aria-live="polite">
                {logLines(host)
                  .filter((line) => progress >= line.at)
                  .map((line) => (
                    <p key={line.text} className={`type-in ${line.tone ?? "text-zinc-400"}`}>
                      {line.text}
                    </p>
                  ))}
                {progress < 100 && <span className="caret inline-block h-4 w-2 translate-y-0.5 bg-zinc-300" />}
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-500 shadow-[0_0_12px] shadow-emerald-500/70"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-xs">
                <span className="text-zinc-500">
                  [<span className="text-emerald-400">{asciiBar}</span>]
                </span>
                <span className="tabular-nums text-zinc-300">{progress}%</span>
              </div>

              <button
                ref={cancelRef}
                onClick={() => setOpen(false)}
                className="mt-5 text-xs text-zinc-500 underline-offset-4 hover:text-zinc-200 hover:underline"
              >
                ^C cancel
              </button>
            </div>
          </div>
        </div>,
          document.body,
        )}
    </>
  );
}
