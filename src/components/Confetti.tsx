"use client";

/**
 * A burst of paper confetti, drawn on a canvas laid over the page for about two
 * seconds. Used when a guide is finished and when a repair is logged as fixed.
 * Does nothing for people who asked their device for less motion.
 */
export function confetti(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const canvas = document.createElement("canvas");
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:9999";
  const scale = Math.min(window.devicePixelRatio, 2);
  canvas.width = window.innerWidth * scale;
  canvas.height = window.innerHeight * scale;
  document.body.appendChild(canvas);
  const pen = canvas.getContext("2d");
  if (!pen) {
    canvas.remove();
    return;
  }
  pen.scale(scale, scale);

  const colours = ["#16a34a", "#facc15", "#1d4ed8", "#f97316", "#fafaf9", "#dc2626"];
  const pieces = Array.from({ length: 150 }, (_, i) => {
    // two cannons, one in each bottom corner, firing up and inwards
    const left = i % 2 === 0;
    const angle = (left ? -Math.PI / 3 : (-2 * Math.PI) / 3) + (Math.random() - 0.5) * 0.9;
    const speed = 9 + Math.random() * 11;
    return {
      x: left ? 0 : window.innerWidth,
      y: window.innerHeight * 0.85,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 6 + Math.random() * 7,
      turn: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.4,
      colour: colours[i % colours.length],
    };
  });

  const started = performance.now();
  const draw = (now: number) => {
    const age = now - started;
    pen.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of pieces) {
      p.vy += 0.32;
      p.vx *= 0.992;
      p.x += p.vx;
      p.y += p.vy;
      p.turn += p.spin;
      pen.save();
      pen.globalAlpha = Math.max(0, 1 - age / 2400);
      pen.translate(p.x, p.y);
      pen.rotate(p.turn);
      pen.fillStyle = p.colour;
      pen.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      pen.restore();
    }
    if (age < 2400) requestAnimationFrame(draw);
    else canvas.remove();
  };
  requestAnimationFrame(draw);
}
