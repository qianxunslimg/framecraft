import React from "react";
import {
  AbsoluteFill,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { font } from "../../../tools/remotion/fonts";
import audioEnergy from "./audio-energy.json";
import { LYRIC_LINES } from "./lyrics";

export const C = {
  ink: "#262228",
  sub: "#6e6875",
  white: "#ffffff",
  cream: "#fffaf0",
  mint: "#17b890",
  mintSoft: "#ddf8ef",
  pink: "#ff6b9d",
  pinkSoft: "#ffe4ee",
  coral: "#ff6b57",
  coralSoft: "#ffe8e4",
  butter: "#ffb703",
  butterSoft: "#fff3cc",
  sky: "#4ea8de",
  skySoft: "#e2f3ff",
  lavender: "#9b72cf",
  lavenderSoft: "#f1e8ff",
};

export const useAudioBeat = (offset = 0) => {
  const frame = useCurrentFrame();
  const idx = Math.max(
    0,
    Math.min(audioEnergy.length - 1, Math.floor(frame + offset)),
  );
  return audioEnergy[idx] ?? { low: 0.4, onset: 0, rms: 0.4 };
};

export type StageTheme =
  | "cream"
  | "mint"
  | "peach"
  | "lavender"
  | "sunset"
  | "arcade";

const THEME_BG: Record<StageTheme, { bg: string; dot: string; accent: string }> =
  {
    cream: {
      bg: "radial-gradient(circle at 50% 42%, #fffdf8 0%, #fff6e5 62%, #fbead0 100%)",
      dot: "rgba(255, 107, 157, 0.14)",
      accent: C.mint,
    },
    mint: {
      bg: "radial-gradient(circle at 50% 42%, #f5fffb 0%, #e4faf2 60%, #cef3e6 100%)",
      dot: "rgba(23, 184, 144, 0.16)",
      accent: C.pink,
    },
    peach: {
      bg: "radial-gradient(circle at 50% 42%, #fffaf5 0%, #ffece2 62%, #ffd9c7 100%)",
      dot: "rgba(255, 107, 87, 0.15)",
      accent: C.sky,
    },
    lavender: {
      bg: "radial-gradient(circle at 50% 42%, #fbf9ff 0%, #f0e6ff 62%, #e1d1fc 100%)",
      dot: "rgba(155, 114, 207, 0.16)",
      accent: C.butter,
    },
    sunset: {
      bg: "linear-gradient(180deg, #ffd6c9 0%, #ffe6cc 48%, #fff7e6 100%)",
      dot: "rgba(255, 107, 87, 0.14)",
      accent: C.coral,
    },
    arcade: {
      bg: "radial-gradient(circle at 50% 40%, #2b2342 0%, #1c1730 65%, #120e21 100%)",
      dot: "rgba(78, 168, 222, 0.22)",
      accent: C.butter,
    },
  };

const FLOATING_STICKERS = [
  { x: 115, y: 140, glyph: "✦", color: C.pink, phase: 0.2, size: 32 },
  { x: 1775, y: 155, glyph: "♪", color: C.mint, phase: 1.1, size: 36 },
  { x: 155, y: 840, glyph: "♥", color: C.coral, phase: 2.3, size: 28 },
  { x: 1750, y: 830, glyph: "★", color: C.butter, phase: 3.1, size: 34 },
  { x: 350, y: 110, glyph: "✿", color: C.lavender, phase: 0.9, size: 28 },
  { x: 1560, y: 120, glyph: "♫", color: C.sky, phase: 1.8, size: 34 },
  { x: 90, y: 490, glyph: "◆", color: C.butter, phase: 2.6, size: 22 },
  { x: 1825, y: 500, glyph: "●", color: C.pink, phase: 0.5, size: 22 },
];

export const KawaiiStage: React.FC<{
  children: React.ReactNode;
  theme?: StageTheme;
  globalOffset?: number;
  shake?: number;
}> = ({ children, theme = "cream", globalOffset = 0, shake = 0 }) => {
  const frame = useCurrentFrame();
  const beat = useAudioBeat(globalOffset);
  const t = THEME_BG[theme];
  const dark = theme === "arcade";
  const sx = shake > 0 ? Math.sin(frame * 3.1) * shake : 0;
  const sy = shake > 0 ? Math.cos(frame * 3.9) * shake * 0.7 : 0;

  return (
    <AbsoluteFill
      style={{
        background: t.bg,
        fontFamily: font,
        color: dark ? C.white : C.ink,
        overflow: "hidden",
      }}
    >
      {/* Animated playful polka dot wallpaper */}
      <div
        style={{
          position: "absolute",
          inset: -60,
          backgroundImage: `radial-gradient(${t.dot} 4px, transparent 4px)`,
          backgroundSize: "52px 52px",
          transform: `translate(${(frame * 0.6) % 52}px, ${(frame * 0.35) % 52}px)`,
        }}
      />

      {/* Beat-pulsing floating stickers */}
      {FLOATING_STICKERS.map((s, i) => {
        const dy = Math.sin(frame * 0.08 + s.phase) * 14;
        const rot = Math.sin(frame * 0.05 + s.phase) * 16;
        const sc = 1 + beat.onset * 0.25 + beat.low * 0.1;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: s.x,
              top: s.y + dy,
              fontSize: s.size,
              color: s.color,
              opacity: dark ? 0.8 : 0.45 + beat.low * 0.22,
              transform: `rotate(${rot}deg) scale(${sc})`,
              pointerEvents: "none",
            }}
          >
            {s.glyph}
          </div>
        );
      })}

      {/* Main stage content */}
      <AbsoluteFill
        style={{
          transform: `translate(${sx}px, ${sy}px)`,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {children}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const CandyPill: React.FC<{
  text: string;
  bg?: string;
  color?: string;
  size?: number;
  delay?: number;
  beatOffset?: number;
  style?: React.CSSProperties;
}> = ({
  text,
  bg = C.mint,
  color = "#ffffff",
  size = 38,
  delay = 0,
  beatOffset = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(beatOffset);
  const pop = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 11, stiffness: 190 },
  });

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        color,
        fontSize: size,
        fontWeight: 700,
        padding: `${Math.round(size * 0.28)}px ${Math.round(size * 0.65)}px`,
        borderRadius: 999,
        border: "3px solid rgba(255,255,255,0.65)",
        boxShadow: `0 10px 0 rgba(38,34,40,0.12), 0 18px 34px ${bg}44`,
        transform: `scale(${pop * (1 + beat.onset * 0.045)})`,
        opacity: pop,
        lineHeight: 1.1,
        ...style,
      }}
    >
      {text}
    </div>
  );
};

export const SpeechBubble: React.FC<{
  children: React.ReactNode;
  bg?: string;
  borderColor?: string;
  delay?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  bg = "#ffffff",
  borderColor = C.ink,
  delay = 0,
  style,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({
    frame: Math.max(0, frame - delay),
    fps,
    config: { damping: 12, stiffness: 190 },
  });

  return (
    <div
      style={{
        background: bg,
        border: `4px solid ${borderColor}`,
        borderRadius: 34,
        padding: "24px 36px",
        boxShadow: `0 10px 0 rgba(38,34,40,0.12)`,
        transform: `scale(${pop})`,
        opacity: pop,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/** Global bottom karaoke-style synced lyric pill */
export const GlobalLyricBar: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const beat = useAudioBeat(0);

  const active = LYRIC_LINES.find((l) => frame >= l.from && frame < l.to);
  if (!active) return null;

  const enter = spring({
    frame: frame - active.from,
    fps,
    config: { damping: 11, stiffness: 230 },
  });

  // Render highlighted substring in bright candy color
  const renderText = () => {
    if (!active.highlight || !active.text.includes(active.highlight)) {
      return active.text;
    }
    const parts = active.text.split(active.highlight);
    return (
      <>
        {parts[0]}
        <span style={{ color: C.butter }}>{active.highlight}</span>
        {parts.slice(1).join(active.highlight)}
      </>
    );
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 34,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 80,
      }}
    >
      <div
        style={{
          fontFamily: font,
          display: "inline-flex",
          alignItems: "center",
          gap: 18,
          background: "rgba(38, 34, 40, 0.92)",
          color: "#ffffff",
          fontSize: 42,
          fontWeight: 700,
          padding: "16px 42px",
          borderRadius: 999,
          border: `3.5px solid ${C.mint}`,
          boxShadow: "0 14px 36px rgba(38,34,40,0.24)",
          transform: `translateY(${(1 - enter) * 24}px) scale(${0.92 + enter * 0.08 + beat.onset * 0.025})`,
          opacity: enter,
          letterSpacing: 1.5,
        }}
      >
        <span
          style={{
            color: C.pink,
            display: "inline-block",
            transform: `rotate(${Math.sin(frame * 0.3) * 18}deg)`,
          }}
        >
          ♪
        </span>
        <span>{renderText()}</span>
      </div>
    </div>
  );
};
