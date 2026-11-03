import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: 72,
        background: "#f5f5f7",
        color: "#1d1d1f",
        fontFamily: "system-ui",
      }}
    >
      <div style={{ fontSize: 88, fontWeight: 600, letterSpacing: -2 }}>
        Bohemia Health
      </div>
      <div style={{ fontSize: 34, color: "#6e6e73", marginTop: 12 }}>
        Lab Reports
      </div>
    </div>,
    size,
  );
}
