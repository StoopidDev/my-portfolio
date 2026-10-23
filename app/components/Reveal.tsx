"use client";

import { useEffect, useRef, useState } from "react";

// Slides its children up into view the first time they scroll on screen.
// Content is only hidden after JS has loaded, so it never stays invisible
// if scripts fail.
export default function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "hidden" | "shown">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Already on screen when the page loads: leave it visible.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setState("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${state === "static" ? "" : "reveal"} ${state === "shown" ? "is-shown" : ""} ${className}`}
    >
      {children}
    </div>
  );
}
