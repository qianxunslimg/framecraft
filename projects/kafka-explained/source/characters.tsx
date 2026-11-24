import React from "react";
import { useCurrentFrame } from "remotion";
import { C, usePulse } from "./stage";

export type NiumaMood = "tired" | "panic" | "happy" | "chill" | "wow";

/** Signature recurring mascot: 「运维小牛马」 */
export const NiumaMascot: React.FC<{
  size?: number;
  mood?: NiumaMood;
  prop?: "none" | "coffee" | "bag";
  jump?: number;
}> = ({ size = 240, mood = "happy", prop = "none", jump = 0 }) => {
  const frame = useCurrentFrame();
  const { beat } = usePulse();
  const bob = Math.sin(frame * 0.18) * 5 - jump;
  const shakeX = mood === "panic" ? Math.sin(frame * 2.4) * 4 : 0;
  const earWig = Math.sin(frame * 0.22) * 5;
  const tailSwish = Math.sin(frame * 0.25) * 18;
  const blink = frame % 90 > 86 && (mood === "happy" || mood === "chill");

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `translate(${shakeX}px, ${bob}px) scaleX(${1 + beat * 0.03}) scaleY(${1 - beat * 0.025})`,
        filter: "drop-shadow(0 14px 20px rgba(28,32,48,0.16))",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 260 260">
        <defs>
          <radialGradient id="kfNiumaBody" cx="42%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#fff8ee" />
            <stop offset="68%" stopColor="#f8e3c4" />
            <stop offset="100%" stopColor="#e8c396" />
          </radialGradient>
          <linearGradient id="kfHoodie" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4338ca" />
          </linearGradient>
        </defs>

        <ellipse cx="130" cy="238" rx="64" ry="12" fill="rgba(28,32,48,0.15)" />

        <g transform={`rotate(${tailSwish} 192 178)`}>
          <path d="M188 176 Q226 164 222 132" stroke="#7c4a2d" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M188 176 Q226 164 222 132" stroke="#9a5d3a" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>

        {prop === "bag" && (
          <g transform="translate(174, 134)">
            <rect x="0" y="0" width="44" height="58" rx="16" fill={C.coral} stroke={C.ink} strokeWidth="4.5" />
            <rect x="8" y="26" width="28" height="20" rx="8" fill={C.amber} stroke={C.ink} strokeWidth="3.5" />
          </g>
        )}

        <g transform={`rotate(${earWig} 70 86)`}>
          <ellipse cx="56" cy="84" rx="22" ry="12" transform="rotate(-24 56 84)" fill="#f3cfa2" stroke={C.ink} strokeWidth="4.5" />
          <ellipse cx="56" cy="84" rx="12" ry="6" transform="rotate(-24 56 84)" fill="#fda4af" />
        </g>
        <g transform={`rotate(${-earWig} 190 86)`}>
          <ellipse cx="204" cy="84" rx="22" ry="12" transform="rotate(24 204 84)" fill="#f3cfa2" stroke={C.ink} strokeWidth="4.5" />
          <ellipse cx="204" cy="84" rx="12" ry="6" transform="rotate(24 204 84)" fill="#fda4af" />
        </g>

        <path d="M84 62 Q68 34 88 26 Q98 42 104 54 Z" fill="#fde68a" stroke={C.ink} strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M176 62 Q192 34 172 26 Q162 42 156 54 Z" fill="#fde68a" stroke={C.ink} strokeWidth="4.5" strokeLinejoin="round" />

        <rect x="64" y="54" width="132" height="162" rx="64" fill="url(#kfNiumaBody)" stroke={C.ink} strokeWidth="5.5" />
        <path d="M104 56 Q116 32 132 48 Q144 30 156 56 Q142 66 130 62 Q116 68 104 56 Z" fill="#8b4d2b" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />

        <path d="M67 158 Q130 146 193 158 L192 178 Q190 216 130 216 Q70 216 68 178 Z" fill="url(#kfHoodie)" stroke={C.ink} strokeWidth="5" />
        <path d="M106 154 L130 182 L154 154" stroke="#f59e0b" strokeWidth="4.5" fill="none" />
        <rect x="114" y="178" width="32" height="24" rx="6" fill="#ffffff" stroke={C.ink} strokeWidth="3.5" />
        <text x="130" y="195" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>牛马</text>

        <ellipse cx="130" cy="134" rx="34" ry="20" fill="#fffaf2" stroke={C.ink} strokeWidth="4" />
        <circle cx="118" cy="130" r="3.2" fill="#8b5e3c" />
        <circle cx="142" cy="130" r="3.2" fill="#8b5e3c" />

        {mood === "panic" || mood === "wow" ? (
          <ellipse cx="130" cy="144" rx="8" ry="9" fill={C.coral} stroke={C.ink} strokeWidth="3" />
        ) : (
          <path d="M118 140 Q130 150 142 140" stroke={C.ink} strokeWidth="3.8" strokeLinecap="round" fill="none" />
        )}

        <ellipse cx="86" cy="126" rx="11" ry="6.5" fill="#ec4899" opacity="0.45" />
        <ellipse cx="174" cy="126" rx="11" ry="6.5" fill="#ec4899" opacity="0.45" />

        {mood === "chill" || blink ? (
          <>
            <path d="M92 106 Q103 94 114 106" stroke={C.ink} strokeWidth="4.8" strokeLinecap="round" fill="none" />
            <path d="M146 106 Q157 94 168 106" stroke={C.ink} strokeWidth="4.8" strokeLinecap="round" fill="none" />
          </>
        ) : mood === "wow" ? (
          <>
            <text x="90" y="114" fontSize="26" fill={C.amber} fontWeight="700">★</text>
            <text x="144" y="114" fontSize="26" fill={C.amber} fontWeight="700">★</text>
          </>
        ) : mood === "panic" ? (
          <>
            <circle cx="103" cy="102" r="11" fill="#ffffff" stroke={C.ink} strokeWidth="3.5" />
            <circle cx="103" cy="102" r="3.5" fill={C.ink} />
            <circle cx="157" cy="102" r="11" fill="#ffffff" stroke={C.ink} strokeWidth="3.5" />
            <circle cx="157" cy="102" r="3.5" fill={C.ink} />
          </>
        ) : (
          <>
            <circle cx="103" cy="102" r="8.5" fill={C.ink} />
            <circle cx="106" cy="99" r="3" fill="#ffffff" />
            <circle cx="157" cy="102" r="8.5" fill={C.ink} />
            <circle cx="160" cy="99" r="3" fill="#ffffff" />
          </>
        )}

        <g stroke={C.ink} strokeWidth="3.8" fill="rgba(255,255,255,0.18)">
          <circle cx="103" cy="102" r="16" />
          <circle cx="157" cy="102" r="16" />
          <line x1="119" y1="102" x2="141" y2="102" />
        </g>

        {(mood === "panic" || mood === "tired") && (
          <path
            d="M180 76 Q189 92 180 100 Q171 92 180 76 Z"
            fill={C.cyan}
            stroke={C.ink}
            strokeWidth="3"
            transform={`translate(0, ${Math.sin(frame * 0.35) * 4})`}
          />
        )}

        <ellipse cx="80" cy="192" rx="14" ry="11" fill="#7c4a2d" stroke={C.ink} strokeWidth="4" />
        <ellipse cx="180" cy="192" rx="14" ry="11" fill="#7c4a2d" stroke={C.ink} strokeWidth="4" />

        {prop === "coffee" && (
          <g transform="translate(182, 152)">
            <polygon points="4,10 34,10 30,48 8,48" fill="#fef3c7" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
            <polygon points="6,22 32,22 30,46 8,46" fill="#6f4e37" />
            <line x1="22" y1="10" x2="26" y2="-6" stroke={C.mint} strokeWidth="4.5" strokeLinecap="round" />
            <text x="19" y="39" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">续命</text>
          </g>
        )}
      </svg>
    </div>
  );
};

/** 「Kafka 极速传送带精灵」Inspired by Apache Kafka's iconic connected-node graph + lightning belt! */
export const KafkaBeltBot: React.FC<{
  size?: number;
  jump?: number;
}> = ({ size = 230, jump = 0 }) => {
  const frame = useCurrentFrame();
  const { beat } = usePulse();
  const bob = Math.sin(frame * 0.17 + 1) * 6 - jump;
  const orbit = Math.sin(frame * 0.14) * 5;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `translateY(${bob}px) scale(${1 + beat * 0.035})`,
        filter: "drop-shadow(0 14px 24px rgba(79,70,229,0.32))",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 240 240">
        <defs>
          <linearGradient id="kfBodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="55%" stopColor="#4f46e5" />
            <stop offset="100%" stopColor="#312e81" />
          </linearGradient>
        </defs>

        <ellipse cx="120" cy="224" rx="56" ry="10" fill="rgba(79,70,229,0.22)" />

        {/* Iconic Kafka connected satellite nodes */}
        <g stroke={C.ink} strokeWidth="5">
          <line x1="120" y1="74" x2="120" y2="34" />
          <line x1="168" y1="92" x2="202" y2="68" />
          <line x1="168" y1="158" x2="202" y2="180" />
          <line x1="72" y1="92" x2="38" y2="68" />
          <line x1="72" y1="158" x2="38" y2="180" />
        </g>
        {[
          { cx: 120, cy: 28 + orbit * 0.5, col: C.cyan },
          { cx: 206, cy: 64 - orbit * 0.5, col: C.mint },
          { cx: 206, cy: 184 + orbit * 0.5, col: C.amber },
          { cx: 34, cy: 64 + orbit * 0.5, col: C.amber },
          { cx: 34, cy: 184 - orbit * 0.5, col: C.mint },
        ].map((n, i) => (
          <circle key={i} cx={n.cx} cy={n.cy} r="13" fill={n.col} stroke={C.ink} strokeWidth="4.5" />
        ))}

        {/* Sleek rounded-hex main Kafka core */}
        <circle cx="120" cy="126" r="68" fill="url(#kfBodyGrad)" stroke={C.ink} strokeWidth="5.5" />

        {/* Friendly dark digital visor */}
        <rect x="74" y="96" width="92" height="58" rx="26" fill="#0f172a" stroke="#ffffff" strokeWidth="4" />
        <circle cx="102" cy="122" r="9.5" fill={C.cyan} />
        <circle cx="105" cy="119" r="3" fill="#ffffff" />
        <circle cx="138" cy="122" r="9.5" fill={C.cyan} />
        <circle cx="141" cy="119" r="3" fill="#ffffff" />
        <path d="M110 138 Q120 146 130 138" stroke={C.mint} strokeWidth="4.2" strokeLinecap="round" fill="none" />

        {/* Lightning throughput emblem on chest */}
        <polygon points="122,160 112,174 120,174 117,186 129,171 121,171" fill={C.amber} stroke={C.ink} strokeWidth="2" />
      </svg>
    </div>
  );
};
