import React from "react";
import { useCurrentFrame } from "remotion";
import { C, usePulse } from "./stage";

export type NiumaMood = "tired" | "panic" | "happy" | "chill" | "sleep" | "wow";

/**
 * 「运维小牛马」Original Adorable Programmer Mascot!
 * Chubby caramel-cream ox-pony with cute curved horns, fluffy pony mane tuft,
 * round programmer glasses, staff lanyard badge, and expressive hooves & props.
 */
export const NiumaMascot: React.FC<{
  size?: number;
  mood?: NiumaMood;
  prop?: "none" | "coffee" | "laptop" | "yaml" | "pillow" | "bag";
  flip?: boolean;
  jump?: number;
}> = ({ size = 250, mood = "happy", prop = "none", flip = false, jump = 0 }) => {
  const frame = useCurrentFrame();
  const { beat } = usePulse();
  const bob = mood === "sleep" ? Math.sin(frame * 0.08) * 3 : Math.sin(frame * 0.18) * 5 - jump;
  const shakeX = mood === "panic" ? Math.sin(frame * 2.4) * 4 : 0;
  const squashX = 1 + beat * 0.035;
  const squashY = 1 - beat * 0.03;
  const earWig = Math.sin(frame * 0.22) * 5;
  const tailSwish = Math.sin(frame * 0.26) * 18;
  const blink = frame % 90 > 86 && (mood === "happy" || mood === "chill");

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `translate(${shakeX}px, ${bob}px) scaleX(${flip ? -squashX : squashX}) scaleY(${squashY})`,
        filter: "drop-shadow(0 14px 20px rgba(30,34,48,0.16))",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 260 260">
        <defs>
          <radialGradient id="niumaBody" cx="42%" cy="30%" r="72%">
            <stop offset="0%" stopColor="#fff8ee" />
            <stop offset="68%" stopColor="#f8e3c4" />
            <stop offset="100%" stopColor="#e8c396" />
          </radialGradient>
          <linearGradient id="niumaHoodie" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#4f8ef7" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
          <linearGradient id="hornGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="100%" stopColor="#fcd34d" />
          </linearGradient>
        </defs>

        {/* Ground shadow */}
        <ellipse cx="130" cy="238" rx="64" ry="12" fill="rgba(30,34,48,0.15)" />

        {/* Swishing pony tail */}
        <g transform={`rotate(${tailSwish} 192 178)`}>
          <path d="M188 176 Q226 164 222 132" stroke="#7c4a2d" strokeWidth="14" strokeLinecap="round" fill="none" />
          <path d="M188 176 Q226 164 222 132" stroke="#9a5d3a" strokeWidth="7" strokeLinecap="round" fill="none" />
        </g>

        {/* Cute backpack when going off work */}
        {prop === "bag" && (
          <g transform="translate(174, 134)">
            <rect x="0" y="0" width="44" height="58" rx="16" fill={C.coral} stroke={C.ink} strokeWidth="4.5" />
            <rect x="8" y="26" width="28" height="20" rx="8" fill={C.butter} stroke={C.ink} strokeWidth="3.5" />
          </g>
        )}

        {/* Rounded cute ears */}
        <g transform={`rotate(${earWig} 70 86)`}>
          <ellipse cx="56" cy="84" rx="22" ry="12" transform="rotate(-24 56 84)" fill="#f3cfa2" stroke={C.ink} strokeWidth="4.5" />
          <ellipse cx="56" cy="84" rx="12" ry="6" transform="rotate(-24 56 84)" fill="#fda4af" />
        </g>
        <g transform={`rotate(${-earWig} 190 86)`}>
          <ellipse cx="204" cy="84" rx="22" ry="12" transform="rotate(24 204 84)" fill="#f3cfa2" stroke={C.ink} strokeWidth="4.5" />
          <ellipse cx="204" cy="84" rx="12" ry="6" transform="rotate(24 204 84)" fill="#fda4af" />
        </g>

        {/* Cute curved little ox horns */}
        <path d="M84 62 Q68 34 88 26 Q98 42 104 54 Z" fill="url(#hornGrad)" stroke={C.ink} strokeWidth="4.5" strokeLinejoin="round" />
        <path d="M176 62 Q192 34 172 26 Q162 42 156 54 Z" fill="url(#hornGrad)" stroke={C.ink} strokeWidth="4.5" strokeLinejoin="round" />

        {/* Chubby head + body silhouette */}
        <rect x="64" y="54" width="132" height="162" rx="64" fill="url(#niumaBody)" stroke={C.ink} strokeWidth="5.5" />

        {/* Fluffy chestnut pony mane tuft on forehead */}
        <path d="M104 56 Q116 32 132 48 Q144 30 156 56 Q142 66 130 62 Q116 68 104 56 Z" fill="#8b4d2b" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />

        {/* Programmer blue hoodie lower torso */}
        <path d="M67 158 Q130 146 193 158 L192 178 Q190 216 130 216 Q70 216 68 178 Z" fill="url(#niumaHoodie)" stroke={C.ink} strokeWidth="5" />
        {/* Lanyard & cute work ID badge 「牛马」 */}
        <path d="M106 154 L130 182 L154 154" stroke="#f59e0b" strokeWidth="4.5" fill="none" />
        <rect x="114" y="178" width="32" height="24" rx="6" fill="#ffffff" stroke={C.ink} strokeWidth="3.5" />
        <text x="130" y="195" textAnchor="middle" fontSize="13" fontWeight="700" fill={C.ink}>牛马</text>

        {/* Cute wide cream snout / muzzle */}
        <ellipse cx="130" cy="134" rx="34" ry="20" fill="#fffaf2" stroke={C.ink} strokeWidth="4" />
        <circle cx="118" cy="130" r="3.2" fill="#8b5e3c" />
        <circle cx="142" cy="130" r="3.2" fill="#8b5e3c" />

        {/* Expressive Mouth */}
        {mood === "panic" || mood === "wow" ? (
          <ellipse cx="130" cy="144" rx="8" ry="9" fill={C.coral} stroke={C.ink} strokeWidth="3" />
        ) : mood === "tired" ? (
          <path d="M120 144 Q130 139 140 144" stroke={C.ink} strokeWidth="3.8" strokeLinecap="round" fill="none" />
        ) : mood === "sleep" ? (
          <circle cx="130" cy="143" r="4.5" fill={C.pink} />
        ) : (
          <path d="M118 140 Q130 150 142 140" stroke={C.ink} strokeWidth="3.8" strokeLinecap="round" fill="none" />
        )}

        {/* Rosy cheeks */}
        <ellipse cx="86" cy="126" rx="11" ry="6.5" fill={C.pink} opacity="0.45" />
        <ellipse cx="174" cy="126" rx="11" ry="6.5" fill={C.pink} opacity="0.45" />

        {/* Under-eye dark circles when tired/panic */}
        {(mood === "tired" || mood === "panic") && (
          <>
            <path d="M90 112 Q103 120 116 112" stroke="#6366f1" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.55" />
            <path d="M144 112 Q157 120 170 112" stroke="#6366f1" strokeWidth="4.5" strokeLinecap="round" fill="none" opacity="0.55" />
          </>
        )}

        {/* Eyes */}
        {mood === "sleep" ? (
          <>
            <path d="M92 104 Q103 112 114 104" stroke={C.ink} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <path d="M146 104 Q157 112 168 104" stroke={C.ink} strokeWidth="4.5" strokeLinecap="round" fill="none" />
            <text x="184" y={62 - (frame % 30) * 0.6} fontSize="26" fontWeight="700" fill={C.cyan}>Zzz</text>
          </>
        ) : mood === "chill" || blink ? (
          <>
            <path d="M92 106 Q103 94 114 106" stroke={C.ink} strokeWidth="4.8" strokeLinecap="round" fill="none" />
            <path d="M146 106 Q157 94 168 106" stroke={C.ink} strokeWidth="4.8" strokeLinecap="round" fill="none" />
          </>
        ) : mood === "wow" ? (
          <>
            <text x="90" y="114" fontSize="26" fill={C.butter} fontWeight="700">★</text>
            <text x="144" y="114" fontSize="26" fill={C.butter} fontWeight="700">★</text>
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

        {/* Cute round programmer glasses (unless sleeping) */}
        {mood !== "sleep" && (
          <g stroke={C.ink} strokeWidth="3.8" fill="rgba(255,255,255,0.18)">
            <circle cx="103" cy="102" r="16" />
            <circle cx="157" cy="102" r="16" />
            <line x1="119" y1="102" x2="141" y2="102" />
          </g>
        )}

        {/* Panic sweat drop */}
        {(mood === "panic" || mood === "tired") && (
          <path
            d="M180 76 Q189 92 180 100 Q171 92 180 76 Z"
            fill={C.cyan}
            stroke={C.ink}
            strokeWidth="3"
            transform={`translate(0, ${Math.sin(frame * 0.35) * 4})`}
          />
        )}

        {/* Cute hooves / hands */}
        {mood === "chill" || mood === "wow" ? (
          <>
            <ellipse cx="52" cy="162" rx="16" ry="12" fill="#7c4a2d" stroke={C.ink} strokeWidth="4" transform={`rotate(${-30 + Math.sin(frame * 0.35) * 14} 52 162)`} />
            <ellipse cx="208" cy="162" rx="16" ry="12" fill="#7c4a2d" stroke={C.ink} strokeWidth="4" transform={`rotate(${30 - Math.sin(frame * 0.35) * 14} 208 162)`} />
          </>
        ) : (
          <>
            <ellipse cx="80" cy="192" rx="14" ry="11" fill="#7c4a2d" stroke={C.ink} strokeWidth="4" />
            <ellipse cx="180" cy="192" rx="14" ry="11" fill="#7c4a2d" stroke={C.ink} strokeWidth="4" />
          </>
        )}

        {/* Iced Americano prop */}
        {prop === "coffee" && (
          <g transform="translate(182, 152)">
            <polygon points="4,10 34,10 30,48 8,48" fill="#fef3c7" stroke={C.ink} strokeWidth="4" strokeLinejoin="round" />
            <polygon points="6,22 32,22 30,46 8,46" fill="#6f4e37" />
            <line x1="22" y1="10" x2="26" y2="-6" stroke={C.mint} strokeWidth="4.5" strokeLinecap="round" />
            <text x="19" y="39" textAnchor="middle" fontSize="11" fontWeight="700" fill="#ffffff">续命</text>
          </g>
        )}

        {/* YAML card prop */}
        {prop === "yaml" && (
          <g transform="translate(178, 146) rotate(-8)">
            <rect x="0" y="0" width="54" height="58" rx="10" fill="#ffffff" stroke={C.ink} strokeWidth="4" />
            <rect x="8" y="8" width="38" height="11" rx="4" fill={C.k8sBlue} />
            <line x1="10" y1="30" x2="44" y2="30" stroke={C.mint} strokeWidth="4" strokeLinecap="round" />
            <line x1="10" y1="42" x2="36" y2="42" stroke={C.butter} strokeWidth="4" strokeLinecap="round" />
          </g>
        )}
      </svg>
    </div>
  );
};

/**
 * 「K8s 船舵管家」Adorable Kubernetes 7-Spoke Helm Robot!
 * Classic K8s blue heptagon helm body, glowing friendly visor, spinning spokes, hover thruster!
 */
export const K8sHelmBot: React.FC<{
  size?: number;
  spin?: boolean;
  scanBeam?: boolean;
  jump?: number;
}> = ({ size = 230, spin = true, scanBeam = false, jump = 0 }) => {
  const frame = useCurrentFrame();
  const { beat } = usePulse();
  const bob = Math.sin(frame * 0.16 + 1) * 6 - jump;
  const wheelAngle = spin ? frame * 1.4 : 0;

  return (
    <div
      style={{
        width: size,
        height: size,
        position: "relative",
        transform: `translateY(${bob}px) scale(${1 + beat * 0.04})`,
        filter: "drop-shadow(0 14px 24px rgba(50,108,229,0.28))",
      }}
    >
      <svg width={size} height={size} viewBox="0 0 240 240">
        <defs>
          <linearGradient id="k8sGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="55%" stopColor="#326ce5" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* Optional scanning radar beam */}
        {scanBeam && (
          <path
            d="M120 120 L20 228 L220 228 Z"
            fill="rgba(0, 180, 216, 0.22)"
            stroke={C.cyan}
            strokeWidth="2.5"
            strokeDasharray="8 6"
          />
        )}

        {/* Ground glow */}
        <ellipse cx="120" cy="224" rx="54" ry="10" fill="rgba(50,108,229,0.22)" />

        {/* Hover thruster flame */}
        <path
          d={`M108 188 Q120 ${204 + Math.sin(frame * 0.8) * 7} 132 188 Z`}
          fill={C.cyan}
          opacity="0.9"
        />

        {/* Rotating classic 7-spoke K8s helm handles */}
        <g transform={`rotate(${wheelAngle} 120 116)`}>
          {[0, 1, 2, 3, 4, 5, 6].map((i) => {
            const deg = (i * 360) / 7;
            return (
              <g key={i} transform={`rotate(${deg} 120 116)`}>
                <rect x="113" y="20" width="14" height="34" rx="7" fill="#93c5fd" stroke={C.ink} strokeWidth="4" />
                <circle cx="120" cy="22" r="9" fill="#ffffff" stroke={C.ink} strokeWidth="4" />
              </g>
            );
          })}
          {/* Outer helm ring */}
          <circle cx="120" cy="116" r="74" fill="url(#k8sGrad)" stroke={C.ink} strokeWidth="5.5" />
          <circle cx="120" cy="116" r="61" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="4" strokeDasharray="16 12" />
        </g>

        {/* Cute face visor (stays upright!) */}
        <rect x="74" y="84" width="92" height="64" rx="28" fill="#0f172a" stroke="#ffffff" strokeWidth="4" />
        {/* Glowing cyan eyes */}
        <circle cx="102" cy="112" r="10" fill={C.cyan} />
        <circle cx="105" cy="109" r="3.5" fill="#ffffff" />
        <circle cx="138" cy="112" r="10" fill={C.cyan} />
        <circle cx="141" cy="109" r="3.5" fill="#ffffff" />
        {/* Friendly digital smile */}
        <path d="M110 129 Q120 138 130 129" stroke={C.mint} strokeWidth="4.5" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
};

/** Cute Glowing Pod Capsule (with main container + optional sidecar + status badge + IP tag) */
export const PodCapsule: React.FC<{
  label?: string;
  ip?: string;
  version?: "v1" | "v2";
  status?: "running" | "dead" | "starting";
  withSidecar?: boolean;
  stamp?: string;
  scale?: number;
}> = ({
  label = "Pod",
  ip,
  version = "v1",
  status = "running",
  withSidecar = false,
  stamp,
  scale = 1,
}) => {
  const frame = useCurrentFrame();
  const isDead = status === "dead";
  const borderColor = isDead
    ? C.coral
    : version === "v2"
      ? C.butter
      : C.k8sBlue;
  const bg = isDead
    ? "rgba(244,63,94,0.14)"
    : version === "v2"
      ? "rgba(254,243,199,0.92)"
      : "rgba(219,232,255,0.92)";

  return (
    <div
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        background: bg,
        border: `4px ${isDead ? "dashed" : "solid"} ${borderColor}`,
        borderRadius: 28,
        padding: "14px 20px",
        boxShadow: isDead ? "none" : `0 8px 0 rgba(30,34,48,0.12)`,
        transform: `scale(${scale}) rotate(${isDead ? -7 : Math.sin(frame * 0.14) * 1.2}deg)`,
        opacity: isDead ? 0.45 : 1,
        minWidth: withSidecar ? 230 : 148,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {/* Main container block */}
        <div
          style={{
            background: isDead ? C.coral : version === "v2" ? C.butter : C.k8sBlue,
            color: "#ffffff",
            borderRadius: 14,
            border: `3px solid ${C.ink}`,
            padding: "8px 14px",
            fontSize: 20,
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span>{isDead ? "💥" : "📦"}</span>
          <span>{label}</span>
        </div>

        {/* Optional log sidecar */}
        {withSidecar && (
          <div
            style={{
              background: C.mint,
              color: "#ffffff",
              borderRadius: 12,
              border: `3px solid ${C.ink}`,
              padding: "6px 10px",
              fontSize: 16,
              fontWeight: 700,
            }}
          >
            📝日志
          </div>
        )}
      </div>

      {/* IP or version pill */}
      {ip && (
        <div
          style={{
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "monospace",
            color: C.ink,
            background: "#ffffff",
            padding: "2px 10px",
            borderRadius: 99,
            border: `2px solid ${borderColor}`,
          }}
        >
          {ip}
        </div>
      )}

      {/* Status check */}
      <div
        style={{
          position: "absolute",
          top: -12,
          right: -10,
          width: 30,
          height: 30,
          borderRadius: 99,
          background: isDead ? C.coral : status === "starting" ? C.butter : C.mint,
          color: "#ffffff",
          border: `3px solid ${C.ink}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          fontWeight: 700,
        }}
      >
        {isDead ? "✕" : status === "starting" ? "…" : "✓"}
      </div>

      {stamp && (
        <div
          style={{
            position: "absolute",
            bottom: -14,
            right: -12,
            background: C.coral,
            color: "#ffffff",
            border: `3px solid ${C.ink}`,
            borderRadius: 10,
            padding: "3px 10px",
            fontSize: 16,
            fontWeight: 700,
            transform: "rotate(-10deg)",
          }}
        >
          {stamp}
        </div>
      )}
    </div>
  );
};
