"use client";

import { useEffect, useRef } from "react";

type Floater = {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  spin: number;
  angle: number;
  maxAlpha: number;
  life: number;
  age: number;
};

function newFloater(randomAge: boolean): Floater {
  const life = 6000 + Math.random() * 8000;
  return {
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    size: 30 + Math.random() * 70,
    vx: (Math.random() - 0.5) * 0.3,
    vy: -(Math.random() * 0.3 + 0.1),
    spin: (Math.random() - 0.5) * 0.004,
    angle: Math.random() * Math.PI * 2,
    maxAlpha: 0.12 + Math.random() * 0.2,
    life,
    age: randomAge ? Math.random() * life : 0,
  };
}

// Canvas background of the profile photo floating and fading in/out.
export default function FloatingBackground({ src }: { src: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const photo = new Image();
    photo.src = src;
    let floaters: Floater[] = [];
    let lastTime = 0;
    let frame = 0;

    function resize() {
      canvas!.width = window.innerWidth * devicePixelRatio;
      canvas!.height = window.innerHeight * devicePixelRatio;
      ctx!.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);

      const count = Math.max(12, Math.floor((window.innerWidth * window.innerHeight) / 40000));
      floaters = Array.from({ length: count }, () => newFloater(true));
    }

    function draw(time: number) {
      const dt = lastTime ? Math.min(time - lastTime, 50) : 16;
      lastTime = time;
      ctx!.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (let i = 0; i < floaters.length; i++) {
        const f = floaters[i];
        if (!reduceMotion) {
          f.x += (f.vx * dt) / 16;
          f.y += (f.vy * dt) / 16;
          f.angle += (f.spin * dt) / 16;
          f.age += dt;
          if (f.age > f.life) {
            floaters[i] = newFloater(false);
            continue;
          }
        }

        const fade = Math.sin(Math.PI * (f.age / f.life));
        ctx!.save();
        ctx!.globalAlpha = f.maxAlpha * (reduceMotion ? 1 : fade);
        ctx!.translate(f.x, f.y);
        ctx!.rotate(f.angle);
        ctx!.beginPath();
        ctx!.arc(0, 0, f.size / 2, 0, Math.PI * 2);
        ctx!.clip();
        const side = Math.min(photo.naturalWidth, photo.naturalHeight);
        const sx = (photo.naturalWidth - side) / 2;
        const sy = (photo.naturalHeight - side) / 2;
        ctx!.drawImage(photo, sx, sy, side, side, -f.size / 2, -f.size / 2, f.size, f.size);
        ctx!.restore();
      }
      if (!reduceMotion) frame = requestAnimationFrame(draw);
    }

    function onResize() {
      resize();
      if (reduceMotion && photo.complete) draw(0);
    }

    resize();
    window.addEventListener("resize", onResize);
    photo.onload = () => {
      frame = requestAnimationFrame(draw);
    };

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(frame);
    };
  }, [src]);

  return <canvas id="bg" ref={canvasRef} aria-hidden="true" />;
}
