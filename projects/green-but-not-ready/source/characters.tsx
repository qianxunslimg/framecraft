import React from "react";
import { useCurrentFrame } from "remotion";
import { C, useAudioBeat } from "./stage";

export type CatMood =
  | "happy"
  | "sparkle"
  | "sweat"
  | "dizzy"
  | "cheer"
  | "shock"
  | "pout";

/** Illustrated gradient MochiCat developer mascot with animated arms, glowing headphones, and props */
export const MochiCat: React.FC<{
  size?: number;
  mood?: CatMood;
  beatOffset?: number;
  flip?: boolean;
  holding?: "none" | "coffee" | "magnifier" | "bag" | "typing";
  jump?: number;
}> = ({
  size = 240,
  mood = "happy",
  beatOffset = 0,
  flip = false,
  holding = "none",
  jump = 0,
}) => {
  const frame = useCurrentFrame();
  const beat = useAudioBeat(beatOffset);
  const blink = frame % 84 > 80 && mood === "happy";
  const squashX = 1 + beat.onset * 0.065 - beat.low * 0.02;
  const squashY = 1 - beat.onset * 0.055 + beat.low * 0.045;
  const bob = Math.sin(frame * 0.18) * 5 - jump;
  const tailWag = Math.sin(frame * 0.24) * 20;
  const earWiggle = Math.sin(frame * 0.22) * 3;
  const typingShift = holding === "typing" ? Math.sin(frame * 1.4) * 8 : 0;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `translateY(${bob}px) scaleX(${flip ? -squashX : squashX}) scaleY(${squashY})`,
        filter: "drop-shadow(0 14px 20px rgba(38,34,40,0.14))",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 240 240">
        <defs>
          <radialGradient id="catBodyGrad" cx="42%" cy="32%" r="72%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="72%" stopColor="#fffaf0" />
            <stop offset="100%" stopColor="#f3e7d3" />
          </radialGradient>
          <linearGradient id="headphoneGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#69c0ff" />
            <stop offset="100%" stopColor="#2f80ed" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="120" cy="218" rx={58 - Math.min(20, jump * 0.3)} ry="11" fill="rgba(38,34,40,0.14)" />

        {/* Wagging dual-tone tail */}
        <g transform={`rotate(${tailWag} 170 166)`}>
          <path d="M168 166 Q208 152 200 112" stroke={C.ink} strokeWidth="15" strokeLinecap="round" fill="none" />
          <path d="M168 166 Q208 152 200 112" stroke="#fff7e8" strokeWidth="8" strokeLinecap="round" fill="none" />
          <circle cx="200" cy="112" r="5" fill="#f0c38e" />
        </g>

        {/* Cute backpack */}
        {holding === "bag" && (
          <g transform="translate(158, 114)">
            <rect x="0" y="0" width="46" height="62" rx="18" fill={C.coral} stroke={C.ink} strokeWidth="5" />
            <rect x="8" y="28" width="30" height="22" rx="9" fill={C.butter} stroke={C.ink} strokeWidth="3.5" />
            <circle cx="23" cy="14" r="5" fill="#ffffff" opacity="0.6" />
          </g>
        )}

        {/* Chubby rounded cat silhouette with ear wiggle */}
        <g transform={`rotate(${earWiggle * 0.4} 120 120)`}>
          <path
            d="M60 92 L52 44 L90 66 Q120 56 150 66 L188 44 L180 92 Q194 120 186 160 Q180 202 120 202 Q60 202 54 160 Q46 120 60 92 Z"
            fill="url(#catBodyGrad)"
            stroke={C.ink}
            strokeWidth="5.5"
            strokeLinejoin="round"
          />
          {/* Soft white belly highlight */}
          <ellipse cx="120" cy="168" rx="34" ry="20" fill="#ffffff" opacity="0.85" />
          {/* Inner ears with soft sheen */}
          <polygon points="64,79 62,56 83,69" fill="#ff9eb8" />
          <polygon points="176,79 178,56 157,69" fill="#ff9eb8" />
          {/* Warm caramel forehead stripes */}
          <path d="M108 66 L108 77 M120 62 L120 79 M132 66 L132 77" stroke="#ebb97a" strokeWidth="5.5" strokeLinecap="round" />
        </g>

        {/* Glossy developer headphones with pulsing earcups */}
        <path
          d="M52 114 A68 68 0 0 1 188 114"
          stroke="url(#headphoneGrad)"
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M66 78 A62 62 0 0 1 110 56"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
          opacity="0.7"
        />
        <rect x="38" y="102" width="21" height="42" rx="10" fill="url(#headphoneGrad)" stroke={C.ink} strokeWidth="4.5" />
        <rect x="181" y="102" width="21" height="42" rx="10" fill="url(#headphoneGrad)" stroke={C.ink} strokeWidth="4.5" />
        {/* Headphone LED glow dot */}
        <circle cx="48" cy="123" r={4 + beat.onset * 2} fill={C.butter} />
        <circle cx="192" cy="123" r={4 + beat.onset * 2} fill={C.butter} />

        {/* Cute whiskers */}
        <g stroke={C.ink} strokeWidth="3" strokeLinecap="round" opacity="0.55">
          <line x1="48" y1="132" x2="66" y2="134" />
          <line x1="50" y1="142" x2="67" y2="140" />
          <line x1="174" y1="134" x2="192" y2="132" />
          <line x1="173" y1="140" x2="190" y2="142" />
        </g>

        {/* Rosy cheeks with kawaii shine lines */}
        <ellipse cx="80" cy="136" rx="13" ry="7.5" fill={C.pink} opacity="0.48" />
        <ellipse cx="160" cy="136" rx="13" ry="7.5" fill={C.pink} opacity="0.48" />

        {/* Expressive Eyes */}
        {mood === "sparkle" && (
          <>
            <text x="79" y="128" fontSize="29" fill={C.butter} fontWeight="700">★</text>
            <text x="132" y="128" fontSize="29" fill={C.butter} fontWeight="700">★</text>
          </>
        )}
        {mood === "dizzy" && (
          <>
            <circle cx="94" cy="119" r="12" fill="none" stroke={C.ink} strokeWidth="4" strokeDasharray="9 5" transform={`rotate(${frame * 14} 94 119)`} />
            <circle cx="146" cy="119" r="12" fill="none" stroke={C.ink} strokeWidth="4" strokeDasharray="9 5" transform={`rotate(${-frame * 14} 146 119)`} />
          </>
        )}
        {mood === "shock" && (
          <>
            <circle cx="94" cy="119" r="12.5" fill="#ffffff" stroke={C.ink} strokeWidth="4" />
            <circle cx="94" cy="119" r="4" fill={C.ink} />
            <circle cx="146" cy="119" r="12.5" fill="#ffffff" stroke={C.ink} strokeWidth="4" />
            <circle cx="146" cy="119" r="4" fill={C.ink} />
          </>
        )}
        {(mood === "cheer" || blink) && (
          <>
            <path d="M82 121 Q94 107 106 121" stroke={C.ink} strokeWidth="5.5" strokeLinecap="round" fill="none" />
            <path d="M134 121 Q146 107 158 121" stroke={C.ink} strokeWidth="5.5" strokeLinecap="round" fill="none" />
          </>
        )}
        {(mood === "happy" || mood === "sweat" || mood === "pout") && !blink && (
          <>
            <circle cx="94" cy="119" r="10" fill={C.ink} />
            <circle cx="97.5" cy="115" r="3.5" fill="#ffffff" />
            <circle cx="91" cy="123" r="1.8" fill="#ffffff" />
            <circle cx="146" cy="119" r="10" fill={C.ink} />
            <circle cx="149.5" cy="115" r="3.5" fill="#ffffff" />
            <circle cx="143" cy="123" r="1.8" fill="#ffffff" />
          </>
        )}

        {/* Cute pink nose + expressive mouth */}
        <polygon points="116,127 124,127 120,132" fill={C.pink} />
        {mood === "shock" ? (
          <ellipse cx="120" cy="144" rx="9" ry="12" fill={C.coral} stroke={C.ink} strokeWidth="3.5" />
        ) : mood === "pout" ? (
          <path d="M110 144 Q120 136 130 144" stroke={C.ink} strokeWidth="4.5" strokeLinecap="round" fill="none" />
        ) : (
          <path d="M107 137 Q113.5 145 120 138 Q126.5 145 133 137" stroke={C.ink} strokeWidth="4.2" strokeLinecap="round" fill="none" />
        )}

        {/* Animated sweat drop */}
        {(mood === "sweat" || mood === "shock") && (
          <path
            d="M168 88 Q178 104 168 112 Q158 104 168 88 Z"
            fill={C.sky}
            stroke={C.ink}
            strokeWidth="3"
            transform={`translate(0, ${Math.sin(frame * 0.35) * 5})`}
          />
        )}

        {/* Expressive Paws */}
        {mood === "cheer" ? (
          <>
            <ellipse cx="52" cy="140" rx="16" ry="12" fill="#ffffff" stroke={C.ink} strokeWidth="4.5" transform={`rotate(${-35 + Math.sin(frame * 0.4) * 14} 52 140)`} />
            <ellipse cx="188" cy="140" rx="16" ry="12" fill="#ffffff" stroke={C.ink} strokeWidth="4.5" transform={`rotate(${35 - Math.sin(frame * 0.4) * 14} 188 140)`} />
          </>
        ) : (
          <>
            <ellipse cx="86" cy={178 + typingShift} rx="15" ry="11" fill="#ffffff" stroke={C.ink} strokeWidth="4.5" />
            <ellipse cx="154" cy={178 - typingShift} rx="15" ry="11" fill="#ffffff" stroke={C.ink} strokeWidth="4.5" />
          </>
        )}

        {/* Props */}
        {holding === "coffee" && (
          <g transform="translate(158, 142)">
            <rect x="0" y="10" width="34" height="38" rx="8" fill={C.butter} stroke={C.ink} strokeWidth="4" />
            <path d="M34 19 Q45 19 45 29 Q45 39 34 39" fill="none" stroke={C.ink} strokeWidth="4" />
            <rect x="6" y="21" width="22" height="14" rx="4" fill="#ffffff" opacity="0.55" />
            <path
              d="M10 2 Q14 -7 10 -15 M22 2 Q26 -7 22 -15"
              stroke={C.sub}
              strokeWidth="3.2"
              strokeLinecap="round"
              fill="none"
              transform={`translate(0, ${Math.sin(frame * 0.2) * 3})`}
            />
          </g>
        )}
        {holding === "magnifier" && (
          <g transform={`translate(154, 122) rotate(${-18 + Math.sin(frame * 0.2) * 8})`}>
            <circle cx="20" cy="20" r="20" fill="rgba(78,168,222,0.32)" stroke={C.ink} strokeWidth="4.5" />
            <path d="M12 12 A12 12 0 0 1 24 8" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            <line x1="34" y1="34" x2="54" y2="54" stroke={C.coral} strokeWidth="9" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};

/** Illustrated gradient Codex ArmorBot with metallic sheen, thruster flame, gleaming glasses & 3 stackable armor layers */
export const ArmorBot: React.FC<{
  size?: number;
  armorLevel?: 0 | 1 | 2 | 3;
  glassesGlint?: boolean;
  tremble?: boolean;
  beatOffset?: number;
  jump?: number;
}> = ({
  size = 240,
  armorLevel = 0,
  glassesGlint = false,
  tremble = false,
  beatOffset = 0,
  jump = 0,
}) => {
  const frame = useCurrentFrame();
  const beat = useAudioBeat(beatOffset);
  const tx = tremble ? Math.sin(frame * 2.5) * 4.5 : 0;
  const bob = Math.sin(frame * 0.16 + 1.2) * 5 - jump;
  const scale = 1 + beat.onset * 0.055;
  const flameH = 14 + Math.sin(frame * 0.9) * 6 + beat.low * 10;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `translate(${tx}px, ${bob}px) scale(${scale})`,
        filter: "drop-shadow(0 14px 20px rgba(38,34,40,0.15))",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 240 240">
        <defs>
          <linearGradient id="botBodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#32d9ac" />
            <stop offset="55%" stopColor="#17b890" />
            <stop offset="100%" stopColor="#0d8a6c" />
          </linearGradient>
          <linearGradient id="helmetGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffe169" />
            <stop offset="100%" stopColor="#f59f00" />
          </linearGradient>
          <linearGradient id="shieldGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#e8f6ff" />
            <stop offset="100%" stopColor="#90cdf4" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="120" cy="222" rx="60" ry="11" fill="rgba(38,34,40,0.14)" />

        {/* Cute hover thruster flame at bottom */}
        <path
          d={`M108 190 Q120 ${192 + flameH} 132 190 Z`}
          fill={C.butter}
          opacity="0.85"
        />

        {/* Little bouncy antenna */}
        <line x1="120" y1="56" x2="120" y2="30" stroke={C.ink} strokeWidth="5.5" strokeLinecap="round" />
        <circle cx="120" cy="24" r={9 + beat.onset * 2.5} fill={C.butter} stroke={C.ink} strokeWidth="4" />

        {/* Cute floating side stubby arms */}
        <ellipse cx="42" cy="134" rx="13" ry="18" fill="url(#botBodyGrad)" stroke={C.ink} strokeWidth="4.5" transform={`rotate(${Math.sin(frame * 0.2) * 14} 42 134)`} />
        <ellipse cx="198" cy="134" rx="13" ry="18" fill="url(#botBodyGrad)" stroke={C.ink} strokeWidth="4.5" transform={`rotate(${-Math.sin(frame * 0.2) * 14} 198 134)`} />

        {/* Chubby mint glossy body */}
        <rect
          x="54"
          y="56"
          width="132"
          height="136"
          rx="58"
          fill="url(#botBodyGrad)"
          stroke={C.ink}
          strokeWidth="5.5"
        />
        {/* Top glossy reflection */}
        <path d="M78 70 Q120 60 162 70" stroke="#ffffff" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.45" />

        {/* Cream face visor */}
        <rect x="72" y="80" width="96" height="68" rx="32" fill="#fffdf8" stroke={C.ink} strokeWidth="4.5" />

        {/* Glasses */}
        <circle cx="98" cy="114" r="15.5" fill={glassesGlint ? "#fff3b0" : "#ffffff"} stroke={C.ink} strokeWidth="4" />
        <circle cx="142" cy="114" r="15.5" fill={glassesGlint ? "#fff3b0" : "#ffffff"} stroke={C.ink} strokeWidth="4" />
        <line x1="113.5" y1="114" x2="126.5" y2="114" stroke={C.ink} strokeWidth="4" />

        {/* Eyes / dramatic anime glasses glint */}
        {glassesGlint ? (
          <>
            <line x1="88" y1="106" x2="106" y2="122" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <line x1="132" y1="106" x2="150" y2="122" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            <text x="152" y="98" fontSize="22" fill={C.butter}>✦</text>
          </>
        ) : (
          <>
            <circle cx="98" cy="114" r="6" fill={C.ink} />
            <circle cx="100" cy="112" r="2" fill="#ffffff" />
            <circle cx="142" cy="114" r="6" fill={C.ink} />
            <circle cx="144" cy="112" r="2" fill="#ffffff" />
          </>
        )}

        {/* Blush + polite smile */}
        <ellipse cx="82" cy="130" rx="6.5" ry="4" fill={C.pink} opacity="0.5" />
        <ellipse cx="158" cy="130" rx="6.5" ry="4" fill={C.pink} opacity="0.5" />
        <path d="M113 132 Q120 138 127 132" stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" fill="none" />

        {/* Coral bow tie */}
        <g transform="translate(120, 167)">
          <polygon points="-19,-9 0,0 -19,9" fill={C.coral} stroke={C.ink} strokeWidth="3.5" strokeLinejoin="round" />
          <polygon points="19,-9 0,0 19,9" fill={C.coral} stroke={C.ink} strokeWidth="3.5" strokeLinejoin="round" />
          <circle cx="0" cy="0" r="5" fill={C.butter} stroke={C.ink} strokeWidth="3" />
        </g>

        {/* ARMOR LAYER 1: Glossy Safety Helmet cleanly above glasses with ChatGPT swirl badge */}
        {armorLevel >= 1 && (
          <g>
            <path d="M46 82 A74 62 0 0 1 194 82 Z" fill="url(#helmetGrad)" opacity="0.92" stroke={C.ink} strokeWidth="4.5" />
            <rect x="38" y="76" width="164" height="14" rx="7" fill={C.butter} stroke={C.ink} strokeWidth="4" />
            <circle cx="120" cy="54" r="15" fill={C.mint} stroke={C.ink} strokeWidth="3" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <path
                key={deg}
                d="M120 43 C125 43 128 47 125 52 L120 52 Z"
                fill="#ffffff"
                transform={`rotate(${deg} 120 54)`}
              />
            ))}
          </g>
        )}

        {/* ARMOR LAYER 2: Glossy Pastel Inflatable Ring */}
        {armorLevel >= 2 && (
          <g>
            <ellipse cx="120" cy="160" rx="86" ry="24" fill="rgba(255, 107, 157, 0.44)" stroke={C.pink} strokeWidth="6.5" />
            <path d="M56 156 Q80 144 106 146" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.75" />
          </g>
        )}

        {/* ARMOR LAYER 3: Gleaming Metallic Knight Shield with ChatGPT badge */}
        {armorLevel >= 3 && (
          <g transform="translate(148, 114)">
            <path
              d="M34 0 L68 12 L62 58 Q34 80 6 58 L0 12 Z"
              fill="url(#shieldGrad)"
              stroke={C.ink}
              strokeWidth="4.5"
              strokeLinejoin="round"
            />
            <path d="M16 14 L52 50" stroke="#ffffff" strokeWidth="8" opacity="0.55" strokeLinecap="round" />
            <text x="34" y="48" textAnchor="middle" fontSize="28" fontWeight="700" fill={C.ink}>
              免
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};

/** Iconic 6-petal ChatGPT/OpenAI swirl knot emblem (crisp pure SVG) */
export const ChatGPTKnot: React.FC<{
  size?: number;
  color?: string;
  bg?: string;
  spin?: number;
}> = ({ size = 64, color = "#ffffff", bg = "#10a37f", spin = 0 }) => (
  <div
    style={{
      width: size,
      height: size,
      borderRadius: Math.round(size * 0.28),
      background: bg,
      border: `3.5px solid ${C.ink}`,
      boxShadow: "0 6px 0 rgba(38,34,40,0.16)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    }}
  >
    <svg
      width={size * 0.68}
      height={size * 0.68}
      viewBox="0 0 64 64"
      style={{ transform: `rotate(${spin}deg)` }}
    >
      {[0, 60, 120, 180, 240, 300].map((deg) => (
        <path
          key={deg}
          d="M32 7 C43 7 50 16 45 27 L34 27 C34 20 29 16 22 19 C24 12 27 7 32 7 Z"
          fill={color}
          transform={`rotate(${deg} 32 32)`}
        />
      ))}
      <circle cx="32" cy="32" r="6" fill={bg} stroke={color} strokeWidth="3.5" />
    </svg>
  </div>
);

/** Recognizable ChatGPT top model bar + "Thought for Xs" pill */
export const ChatGPTHeaderPill: React.FC<{
  model?: string;
  thoughtSec?: number;
}> = ({ model = "ChatGPT · Codex", thoughtSec }) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        background: "#ffffff",
        border: `3.5px solid ${C.ink}`,
        borderRadius: 999,
        padding: "8px 24px 8px 10px",
        boxShadow: "0 8px 0 rgba(38,34,40,0.12)",
      }}
    >
      <ChatGPTKnot size={42} spin={frame * 1.8} />
      <span style={{ fontSize: 28, fontWeight: 700, color: C.ink }}>
        {model} ▾
      </span>
      {thoughtSec !== undefined && (
        <span
          style={{
            background: "#f2f0ea",
            color: C.sub,
            fontSize: 22,
            fontWeight: 700,
            padding: "5px 16px",
            borderRadius: 999,
          }}
        >
          💭 Thought for {thoughtSec}s ⌄
        </span>
      )}
    </div>
  );
};

/** Crisp monochrome ChatGPT response footer action bar (Copy / Like / Dislike / Regenerate / Read Aloud) */
export const ChatGPTActionBar: React.FC<{ color?: string; size?: number }> = ({
  color = "#7c7585",
  size = 24,
}) => (
  <div style={{ display: "inline-flex", alignItems: "center", gap: 18, opacity: 0.9 }}>
    {/* Copy */}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="11" height="11" rx="2.5" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
    {/* Thumbs Up */}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10v11" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
    {/* Thumbs Down */}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 14V3" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
    {/* Regenerate */}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
    {/* Read Aloud */}
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.5 8.5a5 5 0 0 1 0 7" />
      <path d="M19 5a9 9 0 0 1 0 14" />
    </svg>
  </div>
);

/** Crisp vector glossy badge for arcade juggling props (replaces blurry scaled emojis) */
export const CandyIconBadge: React.FC<{
  kind: "shield" | "heart" | "coffee" | "check" | "chatgpt" | "note";
  size?: number;
}> = ({ kind, size = 62 }) => {
  const palette = {
    shield: C.sky,
    heart: C.pink,
    coffee: C.butter,
    check: C.mint,
    chatgpt: "#10a37f",
    note: C.lavender,
  };
  const bg = palette[kind];
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        background: bg,
        border: "3.5px solid #ffffff",
        boxShadow: `0 0 24px ${bg}aa, 0 6px 0 rgba(0,0,0,0.28)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width={size * 0.58} height={size * 0.58} viewBox="0 0 32 32" fill="none">
        {kind === "shield" && (
          <path d="M16 3 L27 7 L25 19 Q16 28 7 19 L5 7 Z" fill="#ffffff" stroke={C.ink} strokeWidth="2.5" strokeLinejoin="round" />
        )}
        {kind === "heart" && (
          <path d="M16 27 C16 27 4 19 4 11 C4 7 7.5 4 11.5 4 C14 4 16 6 16 6 C16 6 18 4 20.5 4 C24.5 4 28 7 28 11 C28 19 16 27 16 27 Z" fill="#ffffff" />
        )}
        {kind === "coffee" && (
          <>
            <rect x="6" y="10" width="15" height="16" rx="4" fill="#ffffff" stroke={C.ink} strokeWidth="2.4" />
            <path d="M21 13 Q27 13 27 18 Q27 23 21 23" stroke="#ffffff" strokeWidth="3" fill="none" />
          </>
        )}
        {kind === "check" && (
          <path d="M6 17 L13 24 L26 9" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {kind === "note" && (
          <path d="M12 23 V8 L25 5 V19 M12 23 A3.5 3.5 0 1 1 8.5 19.5 A3.5 3.5 0 0 1 12 23 Z M25 19 A3.5 3.5 0 1 1 21.5 15.5 A3.5 3.5 0 0 1 25 19 Z" stroke="#ffffff" strokeWidth="3" fill="#ffffff" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {kind === "chatgpt" && (
          <>
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <path
                key={deg}
                d="M16 3 C22 3 25 8 22.5 13.5 L17 13.5 C17 10 14.5 8 11 9.5 C12 6 13.5 3 16 3 Z"
                fill="#ffffff"
                transform={`rotate(${deg} 16 16)`}
              />
            ))}
            <circle cx="16" cy="16" r="3.2" fill={bg} stroke="#ffffff" strokeWidth="2" />
          </>
        )}
      </svg>
    </div>
  );
};

/** Cute Cozy Developer Desk Scenery (Dual monitors + scrolling code + plant + mug + soft floor shadow) */
export const CozyDesk: React.FC<{ width?: number; screenText?: string }> = ({
  width = 520,
  screenText = "BUILD: PASS ✓",
}) => {
  const frame = useCurrentFrame();
  return (
    <svg width={width} height={width * 0.56} viewBox="0 0 520 292">
      {/* Soft pastel floor shadow under desk */}
      <ellipse cx="260" cy="276" rx="236" ry="13" fill="rgba(38,34,40,0.11)" />

      {/* Warm wooden desk surface */}
      <rect x="20" y="210" width="480" height="32" rx="14" fill="#e6b88a" stroke={C.ink} strokeWidth="5" />
      <rect x="44" y="242" width="24" height="34" rx="8" fill="#c99564" stroke={C.ink} strokeWidth="4" />
      <rect x="452" y="242" width="24" height="34" rx="8" fill="#c99564" stroke={C.ink} strokeWidth="4" />

      {/* Cute potted succulent plant on left */}
      <rect x="46" y="168" width="46" height="42" rx="10" fill={C.coral} stroke={C.ink} strokeWidth="4" />
      <ellipse cx="69" cy="156" rx="22" ry="18" fill={C.mint} stroke={C.ink} strokeWidth="4" />
      <ellipse cx="56" cy="148" rx="12" ry="10" fill="#52e3be" stroke={C.ink} strokeWidth="3.5" />
      <ellipse cx="82" cy="148" rx="12" ry="10" fill="#52e3be" stroke={C.ink} strokeWidth="3.5" />

      {/* Rounded glossy monitor */}
      <rect x="135" y="28" width="260" height="154" rx="22" fill="#2b2638" stroke={C.ink} strokeWidth="5.5" />
      <rect x="150" y="43" width="230" height="122" rx="12" fill="#181524" />
      {/* Tiny emerald ChatGPT status dot on bezel */}
      <circle cx="378" cy="173" r="4" fill="#10a37f" />
      {/* Scrolling code bars inside monitor */}
      {[0, 1, 2, 3].map((i) => (
        <rect
          key={i}
          x="166"
          y={58 + i * 20}
          width={70 + ((i * 47 + Math.floor(frame / 4) * 19) % 120)}
          height="10"
          rx="5"
          fill={[C.mint, C.pink, C.sky, C.butter][i]}
          opacity="0.85"
        />
      ))}
      <text x="265" y="152" textAnchor="middle" fontSize="20" fontWeight="700" fill={C.mint}>
        {screenText}
      </text>
      {/* Stand */}
      <rect x="246" y="182" width="38" height="28" fill="#9ea3b0" stroke={C.ink} strokeWidth="4" />

      {/* Mechanical pastel keyboard */}
      <rect x="172" y="198" width="188" height="22" rx="8" fill="#ffffff" stroke={C.ink} strokeWidth="4" />

      {/* Cute sticky note on right */}
      <g transform="translate(418, 128) rotate(8)">
        <rect x="0" y="0" width="66" height="64" rx="10" fill={C.butterSoft} stroke={C.ink} strokeWidth="4" />
        <line x1="12" y1="22" x2="54" y2="22" stroke={C.coral} strokeWidth="4" strokeLinecap="round" />
        <line x1="12" y1="38" x2="46" y2="38" stroke={C.ink} strokeWidth="3.5" strokeLinecap="round" />
      </g>
    </svg>
  );
};

/** Cute Autonomous Mini-Truck with spinning lidar scan cone & exhaust puff! */
export const CuteTruck: React.FC<{
  size?: number;
  wobble?: boolean;
}> = ({ size = 260, wobble = false }) => {
  const frame = useCurrentFrame();
  const bounce = wobble ? Math.sin(frame * 1.4) * 5 : Math.sin(frame * 0.4) * 2;
  const tilt = wobble ? Math.sin(frame * 0.9) * 5 : 0;

  return (
    <svg
      width={size}
      height={size * 0.68}
      viewBox="0 0 320 200"
      style={{
        transform: `translateY(${bounce}px) rotate(${tilt}deg)`,
        filter: "drop-shadow(0 12px 16px rgba(38,34,40,0.16))",
      }}
    >
      {/* Glowing Lidar scan cone in front of truck */}
      <path
        d="M178 44 L315 88 L315 150 Z"
        fill="rgba(23, 184, 144, 0.22)"
        stroke={C.mint}
        strokeWidth="2.5"
        strokeDasharray="8 6"
      />

      {/* Cute exhaust puffs behind truck */}
      {[0, 1].map((i) => (
        <circle
          key={i}
          cx={12 - ((frame * 2 + i * 16) % 28)}
          cy={138 - i * 8}
          r={8 + i * 4}
          fill="#ffffff"
          opacity={0.7 - ((frame * 2 + i * 16) % 28) / 40}
        />
      ))}

      {/* Spinning lidar dome */}
      <rect x="158" y="28" width="32" height="18" rx="9" fill={C.ink} />
      <rect x={164 + Math.sin(frame * 0.5) * 7} y="34" width="11" height="6" rx="3" fill={C.mint} />
      <line x1="174" y1="46" x2="174" y2="60" stroke={C.ink} strokeWidth="5" />

      {/* Cargo box */}
      <rect x="28" y="58" width="136" height="86" rx="20" fill="#ffffff" stroke={C.ink} strokeWidth="5.5" />
      <rect x="40" y="76" width="112" height="46" rx="12" fill={C.mintSoft} />
      <text x="96" y="107" textAnchor="middle" fontSize="23" fontWeight="700" fill={C.mint}>
        实车测试
      </text>

      {/* Rounded cab */}
      <path
        d="M164 66 L220 66 Q248 66 252 96 L254 144 L164 144 Z"
        fill={C.sky}
        stroke={C.ink}
        strokeWidth="5.5"
        strokeLinejoin="round"
      />
      <path d="M180 80 L218 80 Q234 80 236 104 L180 104 Z" fill="#e6f7ff" stroke={C.ink} strokeWidth="4" />
      {/* Tiny adorable MochiCat driver peeking in the cab window */}
      <circle cx="204" cy="95" r="9.5" fill="#fffaf0" stroke={C.ink} strokeWidth="2.2" />
      <polygon points="196,89 195,82 201,86" fill="#fffaf0" stroke={C.ink} strokeWidth="1.8" />
      <polygon points="212,89 213,82 207,86" fill="#fffaf0" stroke={C.ink} strokeWidth="1.8" />
      <circle cx="201" cy="94" r="1.5" fill={C.ink} />
      <circle cx="207" cy="94" r="1.5" fill={C.ink} />
      <circle cx="248" cy="124" r="9" fill={C.butter} stroke={C.ink} strokeWidth="3.5" />

      {/* Spinning Wheels */}
      {[78, 210].map((cx) => (
        <g key={cx} transform={`rotate(${frame * 14} ${cx} 148)`}>
          <circle cx={cx} cy="148" r="25" fill={C.ink} />
          <circle cx={cx} cy="148" r="11" fill={C.butter} />
          <line x1={cx - 11} y1="148" x2={cx + 11} y2="148" stroke={C.ink} strokeWidth="3.5" />
        </g>
      ))}
    </svg>
  );
};

/** 24-Bar Mirrored Glossy Neon 8-Bit Equalizer */
export const EqualizerBars: React.FC<{
  beatOffset?: number;
  width?: number;
  height?: number;
}> = ({ beatOffset = 0, width = 1360, height = 180 }) => {
  const frame = useCurrentFrame();
  const beat = useAudioBeat(beatOffset);
  const colors = [C.pink, C.coral, C.butter, C.mint, C.sky, C.lavender];

  return (
    <div
      style={{
        width,
        height,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 10,
      }}
    >
      {Array.from({ length: 24 }).map((_, i) => {
        const distCenter = Math.abs(i - 11.5) / 11.5;
        const wave = 0.35 + 0.65 * Math.abs(Math.sin(frame * 0.24 + i * 0.55));
        const h = Math.max(
          22,
          Math.min(
            height,
            height * ((1 - distCenter * 0.35) * (0.22 + beat.low * 0.56 * wave + beat.onset * 0.38)),
          ),
        );
        const col = colors[i % colors.length];
        return (
          <div
            key={i}
            style={{
              flex: 1,
              height: h,
              borderRadius: "14px 14px 6px 6px",
              background: `linear-gradient(180deg, #ffffff 0%, ${col} 22%, ${col} 100%)`,
              border: "2.5px solid rgba(255,255,255,0.7)",
              boxShadow: `0 0 24px ${col}88`,
            }}
          />
        );
      })}
    </div>
  );
};
