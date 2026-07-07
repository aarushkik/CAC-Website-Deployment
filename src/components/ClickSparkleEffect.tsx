"use client";

import { useEffect } from "react";

export function ClickSparkleEffect() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      // Subtle yet highly satisfying mechanical target-lock click animation
      const size = 60; // Sleek, small size
      const x = e.clientX - size / 2;
      const y = e.clientY - size / 2;

      const container = document.createElement("div");
      container.style.position = "fixed";
      container.style.left = `${x}px`;
      container.style.top = `${y}px`;
      container.style.width = `${size}px`;
      container.style.height = `${size}px`;
      container.style.pointerEvents = "none";
      container.style.zIndex = "99999";

      container.innerHTML = `
        <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" style="overflow: visible;">
          <!-- Central crosshair -->
          <path d="M 27,30 L 33,30 M 30,27 L 30,33" stroke="#FF7A00" stroke-width="1.2" class="click-cross" />
          
          <!-- Radial radar circle -->
          <circle cx="30" cy="30" r="2" fill="none" stroke="#1A2B4C" stroke-width="1" class="click-ring" />
          
          <!-- 4 tiny dots that shoot outward -->
          <circle cx="30" cy="15" r="1.2" fill="#FF7A00" class="click-dot click-dot-u" />
          <circle cx="45" cy="30" r="1.2" fill="#FF7A00" class="click-dot click-dot-r" />
          <circle cx="30" cy="45" r="1.2" fill="#FF7A00" class="click-dot click-dot-d" />
          <circle cx="15" cy="30" r="1.2" fill="#FF7A00" class="click-dot click-dot-l" />
        </svg>
      `;

      document.body.appendChild(container);

      const svg = container.querySelector("svg")!;
      const cross = svg.querySelector(".click-cross")!;
      const ring = svg.querySelector(".click-ring")!;
      const dotU = svg.querySelector(".click-dot-u")!;
      const dotR = svg.querySelector(".click-dot-r")!;
      const dotD = svg.querySelector(".click-dot-d")!;
      const dotL = svg.querySelector(".click-dot-l")!;

      // 1. Radar Ring expanding fast and fading out
      ring.animate([
        { r: "2px", opacity: 1, stroke: "#FF7A00" },
        { r: "26px", opacity: 0, stroke: "#1A2B4C" }
      ], {
        duration: 350,
        easing: "cubic-bezier(0.1, 0.8, 0.3, 1)",
        fill: "forwards"
      });

      // 2. Crosshair rotates and shrinks rapidly
      cross.animate([
        { transform: "rotate(0deg) scale(1.2)", opacity: 1 },
        { transform: "rotate(45deg) scale(0)", opacity: 0 }
      ], {
        duration: 300,
        easing: "ease-out",
        fill: "forwards"
      });

      // 3. Dots shoot out radially
      dotU.animate([
        { transform: "translateY(0px)", opacity: 1 },
        { transform: "translateY(-12px)", opacity: 0 }
      ], { duration: 320, easing: "ease-out", fill: "forwards" });

      dotR.animate([
        { transform: "translateX(0px)", opacity: 1 },
        { transform: "translateX(12px)", opacity: 0 }
      ], { duration: 320, easing: "ease-out", fill: "forwards" });

      dotD.animate([
        { transform: "translateY(0px)", opacity: 1 },
        { transform: "translateY(12px)", opacity: 0 }
      ], { duration: 320, easing: "ease-out", fill: "forwards" });

      dotL.animate([
        { transform: "translateX(0px)", opacity: 1 },
        { transform: "translateX(-12px)", opacity: 0 }
      ], { duration: 320, easing: "ease-out", fill: "forwards" });

      setTimeout(() => {
        container.remove();
      }, 400);
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return null;
}
