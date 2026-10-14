import { ImageResponse } from "next/og";

export const alt = "FixIt WA 03 — Fix it yourself, safely, or find someone local who can.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const signs = [
  { word: "SAFE TO FIX", band: "#007a53", text: "#ffffff", label: "Flat bike tire" },
  { word: "CAUTION", band: "#ffd100", text: "#1c2321", label: "Dripping faucet" },
  { word: "DANGER", band: "#c8102e", text: "#ffffff", label: "Microwave not heating" },
];

/**
 * Loads the display face for the card. Google Fonts serves TTF (which the
 * image renderer needs) when no browser user agent is sent. If the network
 * isn't available at build time, the card falls back to the default font.
 */
async function loadDisplayFont(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch("https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@800").then((r) => r.text());
    const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    const response = await fetch(url);
    return response.ok ? await response.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** The preview card shown when someone shares a link to the app. */
export default async function OpenGraphImage() {
  const displayFont = await loadDisplayFont();
  const display = displayFont ? "Barlow Condensed" : "sans-serif";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#eef0ec",
          padding: 64,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 640 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div
              style={{
                display: "flex",
                width: 56,
                height: 56,
                borderRadius: 12,
                background: "#1d4f91",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.106-3.105c.32-.322.863-.22.983.218a6 6 0 0 1-8.259 7.057l-7.91 7.91a1 1 0 0 1-2.999-3l7.91-7.91a6 6 0 0 1 7.057-8.259c.438.12.54.662.219.984z" />
              </svg>
            </div>
            <div style={{ display: "flex", fontFamily: display, fontSize: 48, fontWeight: 800, color: "#1c2321" }}>
              FixIt WA 03
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: display,
              fontSize: 84,
              fontWeight: 800,
              lineHeight: 0.95,
              letterSpacing: -1,
              color: "#1c2321",
            }}
          >
            Fix it yourself, safely — or find someone local who can.
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "#3d4743" }}>
            A repair assistant for Southwest Washington
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: 28, marginLeft: 48, width: 400 }}>
          {signs.map((sign) => (
            <div
              key={sign.word}
              style={{
                display: "flex",
                flexDirection: "column",
                border: "4px solid #1c2321",
                borderRadius: 12,
                background: "#ffffff",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  display: "flex",
                  background: sign.band,
                  color: sign.text,
                  fontFamily: display,
                  fontSize: 34,
                  fontWeight: 800,
                  letterSpacing: 4,
                  padding: "8px 20px",
                }}
              >
                {sign.word}
              </div>
              <div style={{ display: "flex", fontSize: 28, color: "#1c2321", padding: "12px 20px" }}>{sign.label}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: displayFont ? [{ name: "Barlow Condensed", data: displayFont, weight: 800, style: "normal" }] : undefined,
    },
  );
}
