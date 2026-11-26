import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import {
  C,
  DataConduit,
  HardwareModule,
  SceneTiming,
  TechStage,
  easeOutCubic,
  getCue,
  hexRgba,
} from "../TechStage";

/* ============================================================================
 * ACT 1: HOOK — Real Titanium Phone -> Interactive EACCES Kernel Rejection ->
 *               4-Layer Isometric Hardware Exploded Stack + Main Title
 * ============================================================================ */
export const HookAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cDenied = getCue(scene.cues, "deniedPulse");
  const cTitle = getCue(scene.cues, "titleSlam");

  const isDenied = frame >= cDenied.from && frame < cTitle.from;
  const isTitle = frame >= cTitle.from;

  const accent = isDenied ? C.crimson : isTitle ? C.emerald : C.cyan;
  const plate = isTitle ? "shot02_pixel_dive.jpg" : "shot01_desk_phone.jpg";

  // Interactive tap -> syscall packet flight -> crimson bounce during deniedPulse
  const deniedLocal = Math.max(0, frame - cDenied.from);
  const tapPulse = spring({ frame: Math.max(0, deniedLocal - 16), fps, config: { damping: 14, stiffness: 200 } });
  const packetCycle = ((deniedLocal - 24) % 95 + 95) % 95;
  const packetGoing = deniedLocal >= 24 && packetCycle < 42;
  const packetBounce = deniedLocal >= 24 && packetCycle >= 42 && packetCycle < 78;
  const packetX = packetGoing
    ? interpolate(packetCycle, [0, 42], [585, 1110])
    : packetBounce
      ? interpolate(packetCycle, [42, 78], [1110, 620])
      : 585;
  const wallImpact = packetCycle >= 40 && packetCycle < 58 ? Math.sin(((packetCycle - 40) / 18) * Math.PI) : 0;

  // Isometric stack separation in titleSlam
  const titleLocal = Math.max(0, frame - cTitle.from);
  const stackOpen = spring({ frame: titleLocal, fps, config: { damping: 16, stiffness: 90 } });

  return (
    <TechStage
      plate={plate}
      accent={accent}
      tag="ACT 01 // HIDDEN GOD SWITCH"
      subTag={isTitle ? "ARCHITECTURE EXPLODED · UID=0" : isDenied ? "SYSCALL INTERCEPTED · EACCES" : "FLAGSHIP DEVICE · USER SPACE"}
      plateOpacity={isTitle ? 0.34 : isDenied ? 0.16 : 0.78}
      plateBlur={isTitle ? 3 : isDenied ? 8 : 0}
      cameraZoom={isTitle ? interpolate(titleLocal, [0, 260], [1.0, 1.07], { extrapolateRight: "clamp" }) : 1.0}
      shake={wallImpact > 0.2 ? wallImpact * 10 : 0}
    >
      {/* CUE 1: Sleek Biometric Padlock Halo floating over real Titanium Phone */}
      {!isDenied && !isTitle && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0 }}>
            <defs>
              <radialGradient id="lockHalo" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={C.cyan} stopOpacity="0.34" />
                <stop offset="100%" stopColor={C.cyan} stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="960" cy="495" r="240" fill="url(#lockHalo)" />
            <circle
              cx="960"
              cy="495"
              r="146"
              fill="none"
              stroke={C.cyan}
              strokeWidth="2"
              strokeDasharray="16 12"
              strokeOpacity="0.65"
              transform={`rotate(${frame * 0.7} 960 495)`}
            />
            <circle
              cx="960"
              cy="495"
              r="186"
              fill="none"
              stroke={C.cyan}
              strokeWidth="1.2"
              strokeDasharray="4 14"
              strokeOpacity="0.45"
              transform={`rotate(${-frame * 0.5} 960 495)`}
            />
            {/* Minimalist glowing geometric padlock */}
            <g transform="translate(960, 495)">
              <path
                d="M -28 -10 L -28 -36 A 28 28 0 0 1 28 -36 L 28 -10"
                fill="none"
                stroke="#ffffff"
                strokeWidth="7"
                strokeLinecap="round"
              />
              <rect
                x="-44"
                y="-12"
                width="88"
                height="68"
                rx="14"
                fill="rgba(4, 14, 30, 0.85)"
                stroke={C.cyan}
                strokeWidth="3.5"
              />
              <circle cx="0" cy="18" r="9" fill={C.cyan} />
              <rect x="-3.5" y="22" width="7" height="18" rx="3" fill={C.cyan} />
            </g>
          </svg>
          <div
            style={{
              position: "absolute",
              top: 685,
              width: "100%",
              textAlign: "center",
              fontFamily: "monospace",
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: "0.3em",
              color: C.cyan,
              textShadow: `0 0 18px ${C.cyan}`,
            }}
          >
            OWNER ACCESS: USER SPACE ONLY · UID 10000+
          </div>
        </div>
      )}

      {/* CUE 2: Live Interactive Syscall Rejection Demo (Phone UI -> Kernel Firewall -> EACCES) */}
      {isDenied && (
        <>
          {/* Left: Sleek Realistic Android Phone Mockup */}
          <HardwareModule x={160} y={145} w={420} h={735} accent={wallImpact > 0.2 ? C.crimson : C.cyan} radius={44} glow={0.7}>
            <div style={{ padding: "28px 28px", height: "100%", display: "flex", flexDirection: "column" }}>
              {/* Status bar */}
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 14, color: C.muted, marginBottom: 26 }}>
                <span>11:30 · ANDROID 16</span>
                <span style={{ color: C.cyan }}>UID 10241</span>
              </div>
              {/* App card */}
              <div
                style={{
                  padding: "24px 22px",
                  borderRadius: 20,
                  background: "rgba(15, 25, 48, 0.9)",
                  border: "1px solid rgba(148,163,184,0.22)",
                  marginBottom: 22,
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div
                    style={{
                      width: 62,
                      height: 62,
                      borderRadius: 16,
                      background: "linear-gradient(135deg, #f97316, #ef4444)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      fontWeight: 900,
                      color: "#fff",
                    }}
                  >
                    SYS
                  </div>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fff" }}>系统预装软件</div>
                    <div style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, marginTop: 4 }}>/system/priv-app/Bloat.apk</div>
                  </div>
                </div>

                {/* Action button with animated tap ripple */}
                <div
                  style={{
                    marginTop: 26,
                    padding: "16px 0",
                    borderRadius: 14,
                    textAlign: "center",
                    fontSize: 20,
                    fontWeight: 800,
                    background: wallImpact > 0.15 ? hexRgba(C.crimson, 0.35) : hexRgba(C.crimson, 0.2),
                    border: `2px solid ${C.crimson}`,
                    color: "#fff",
                    transform: `scale(${1 - tapPulse * 0.04 * (deniedLocal < 30 ? 1 : 0)})`,
                    boxShadow: `0 0 22px ${hexRgba(C.crimson, 0.4)}`,
                  }}
                >
                  尝试卸载 / 删除文件
                </div>
              </div>

              {/* Real-time shell error readout inside phone */}
              <div
                style={{
                  flex: 1,
                  padding: "20px",
                  borderRadius: 18,
                  background: "rgba(3, 6, 14, 0.85)",
                  border: `1px solid ${hexRgba(C.crimson, 0.45)}`,
                  fontFamily: "monospace",
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#cbd5e1",
                }}
              >
                <div style={{ color: C.cyan }}>$ unlink(&quot;/system/priv-app/Bloat.apk&quot;)</div>
                <div style={{ color: C.muted }}>caller_uid = 10241 (普通租客)</div>
                <div style={{ color: C.muted }}>required   = 0 (root)</div>
                {deniedLocal >= 66 && (
                  <>
                    <div style={{ color: C.crimson, fontWeight: 800, marginTop: 12 }}>
                      ✗ ERROR: EACCES (Permission Denied)
                    </div>
                    <div style={{ color: "#fda4af" }}>✗ Read-only file system</div>
                  </>
                )}
              </div>
            </div>
          </HardwareModule>

          {/* Center-Right: Live Kernel Permission Gate & Syscall Packet Flight */}
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <DataConduit d="M 580 430 L 1125 430" color={packetBounce ? C.crimson : C.cyan} width={3} packets={0} dashed />
            {/* Glowing Laser Barrier Gate */}
            <line
              x1="1130"
              y1="185"
              x2="1130"
              y2="825"
              stroke={C.crimson}
              strokeWidth={4 + wallImpact * 8}
              strokeOpacity={0.85}
            />
            <line
              x1="1130"
              y1="185"
              x2="1130"
              y2="825"
              stroke="#ffffff"
              strokeWidth={1.5 + wallImpact * 3}
              strokeOpacity={0.9}
            />
            {/* Flying syscall packet */}
            {deniedLocal >= 24 && (
              <g transform={`translate(${packetX}, 430)`}>
                <circle r={30} fill={hexRgba(packetBounce ? C.crimson : C.cyan, 0.28)} />
                <rect
                  x="-78"
                  y="-22"
                  width="156"
                  height="44"
                  rx="10"
                  fill="rgba(6, 12, 26, 0.94)"
                  stroke={packetBounce ? C.crimson : C.cyan}
                  strokeWidth="2.5"
                />
                <text
                  x="0"
                  y="6"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontFamily="monospace"
                  fontSize="16"
                  fontWeight="800"
                >
                  {packetBounce ? "EACCES 拒签!" : "rm /system/*"}
                </text>
              </g>
            )}
            {/* Impact shockwave ring */}
            {wallImpact > 0.05 && (
              <circle
                cx="1130"
                cy="430"
                r={24 + (1 - wallImpact) * 95}
                fill="none"
                stroke={C.crimson}
                strokeWidth="4"
                strokeOpacity={wallImpact}
              />
            )}
          </svg>

          {/* Right: Protected Core Partitions behind the Kernel Gate */}
          <HardwareModule x={1210} y={195} w={550} h={625} accent={C.crimson} glow={0.4 + wallImpact * 0.6}>
            <div style={{ padding: "34px 36px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 15, letterSpacing: "0.2em", color: C.crimson, fontWeight: 700 }}>
                PROTECTED KERNEL ZONE · LOCKED
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginTop: 8 }}>
                系统底层核心分区
              </div>
              <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { path: "/system", desc: "操作系统本体（只读锁定）", badge: "RO · LOCKED" },
                  { path: "/vendor", desc: "硬件驱动与固件镜像", badge: "RO · LOCKED" },
                  { path: "/data/system", desc: "全局权限与账户配置", badge: "UID 0 ONLY" },
                  { path: "/dev/block", desc: "底层闪存与内核调度接口", badge: "UID 0 ONLY" },
                ].map((row, idx) => (
                  <div
                    key={idx}
                    style={{
                      padding: "18px 22px",
                      borderRadius: 14,
                      background: "rgba(15, 23, 42, 0.72)",
                      border: `1px solid ${hexRgba(C.crimson, 0.35)}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 21, fontWeight: 800, color: "#fff" }}>{row.path}</div>
                      <div style={{ fontSize: 15, color: C.muted, marginTop: 4 }}>{row.desc}</div>
                    </div>
                    <div
                      style={{
                        fontFamily: "monospace",
                        fontSize: 13,
                        fontWeight: 800,
                        color: C.crimson,
                        padding: "6px 12px",
                        borderRadius: 8,
                        background: hexRgba(C.crimson, 0.16),
                      }}
                    >
                      {row.badge}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </HardwareModule>
        </>
      )}

      {/* CUE 3: Exploded 4-Layer Architectural Stack + Hero Main Title */}
      {isTitle && (
        <div style={{ position: "absolute", inset: 0 }}>
          {/* Hero Title on Left */}
          <div
            style={{
              position: "absolute",
              left: 110,
              top: 280,
              width: 780,
              opacity: stackOpen,
              transform: `translateY(${(1 - stackOpen) * 30}px)`,
            }}
          >
            <div style={{ fontFamily: "monospace", fontSize: 19, fontWeight: 800, letterSpacing: "0.32em", color: C.emerald }}>
              UID = 0 // THE HIDDEN GOD SWITCH
            </div>
            <div
              style={{
                fontSize: 94,
                fontWeight: 900,
                color: "#ffffff",
                lineHeight: 1.08,
                marginTop: 18,
                textShadow: `0 0 42px ${hexRgba(C.emerald, 0.55)}, 0 10px 30px rgba(0,0,0,0.95)`,
              }}
            >
              手机 ROOT
              <br />
              底层解密
            </div>
            <div
              style={{
                width: 460 * stackOpen,
                height: 4,
                marginTop: 26,
                background: `linear-gradient(90deg, ${C.emerald}, ${C.cyan}, transparent)`,
                boxShadow: `0 0 22px ${C.emerald}`,
              }}
            />
            <div style={{ fontSize: 22, color: "#e2e8f0", marginTop: 24, lineHeight: 1.6, whiteSpace: "nowrap" }}>
              潜入 Linux 内核 · 安全启动信任链 · Magisk / KernelSU · TEE 硬件保险箱
            </div>
          </div>

          {/* Right: Sleek 4-Layer Isometric Glass Stack physically separating */}
          <div style={{ position: "absolute", right: 110, top: 140, width: 820, height: 740 }}>
            {[
              { name: "01 应用沙盒层", sub: "APP SANDBOX · UID 10000+", col: C.cyan, yBase: 60 },
              { name: "02 Android 框架 & SELinux", sub: "FRAMEWORK · ACCESS POLICY", col: C.blue, yBase: 215 },
              { name: "03 Linux 内核 · UID = 0", sub: "SUPERUSER KERNEL RING 0", col: C.emerald, yBase: 375, hero: true },
              { name: "04 SoC 芯片 & TEE 硬件根", sub: "BOOTROM · TRUSTZONE SILICON", col: C.gold, yBase: 540 },
            ].map((layer, idx) => {
              const offset = (idx - 1.5) * 24 * stackOpen;
              return (
                <div
                  key={idx}
                  style={{
                    position: "absolute",
                    left: 80,
                    top: layer.yBase + offset,
                    width: 660,
                    height: 122,
                    borderRadius: 20,
                    background: layer.hero
                      ? `linear-gradient(135deg, ${hexRgba(C.emerald, 0.28)}, rgba(6, 22, 30, 0.94))`
                      : "linear-gradient(135deg, rgba(16, 28, 52, 0.88), rgba(6, 12, 24, 0.92))",
                    border: `${layer.hero ? 2.5 : 1.5}px solid ${hexRgba(layer.col, layer.hero ? 0.95 : 0.55)}`,
                    boxShadow: `0 22px 48px rgba(0,0,0,0.65), 0 0 ${layer.hero ? 42 : 18}px ${hexRgba(layer.col, layer.hero ? 0.45 : 0.18)}`,
                    transform: `perspective(900px) rotateX(24deg) rotateY(-12deg) translateY(${(1 - stackOpen) * 40}px)`,
                    padding: "24px 36px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    opacity: stackOpen,
                  }}
                >
                  <div>
                    <div style={{ fontSize: 28, fontWeight: 900, color: "#fff" }}>{layer.name}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 15, color: layer.col, marginTop: 6, letterSpacing: "0.1em" }}>
                      {layer.sub}
                    </div>
                  </div>
                  <div
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: layer.col,
                      boxShadow: `0 0 22px ${layer.col}`,
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </TechStage>
  );
};

/* ============================================================================
 * ACT 2: PYRAMID — 4 Isolated App Sandboxes -> Live SELinux Laser Interception ->
 *                  Radiant Golden UID=0 Superuser Crown Takeover
 * ============================================================================ */
export const PyramidAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cSelinux = getCue(scene.cues, "selinuxWall");
  const cUid = getCue(scene.cues, "uidZero");

  const isSelinux = frame >= cSelinux.from && frame < cUid.from;
  const isUid = frame >= cUid.from;
  const accent = isUid ? C.gold : isSelinux ? C.crimson : C.emerald;

  const selLocal = Math.max(0, frame - cSelinux.from);
  const attackCycle = selLocal % 80;
  const rogueX = interpolate(attackCycle, [0, 38], [1410, 965], { extrapolateRight: "clamp" });
  const zapHit = attackCycle >= 36 && attackCycle < 56 ? Math.sin(((attackCycle - 36) / 20) * Math.PI) : 0;

  const uidLocal = Math.max(0, frame - cUid.from);
  const crownRise = spring({ frame: uidLocal, fps, config: { damping: 16, stiffness: 100 } });

  const apps = [
    { x: 145, name: "社交软件", pkg: "com.social", uid: "u0_a182", col: C.cyan },
    { x: 560, name: "手机银行", pkg: "com.bank", uid: "u0_a204", col: C.emerald },
    { x: 1040, name: "浏览器", pkg: "com.browser", uid: "u0_a241", col: C.blue },
    { x: 1455, name: "第三方游戏", pkg: "com.game", uid: "u0_a319", col: C.violet },
  ];

  return (
    <TechStage
      plate={isUid ? "shot05_root_throne.jpg" : isSelinux ? "shot04_firewall_zap.jpg" : "shot03_sandbox_city.jpg"}
      accent={accent}
      tag="ACT 02 // LINUX PERMISSION PYRAMID"
      subTag={isUid ? "UID = 0 · FULL KERNEL AUTHORITY" : isSelinux ? "SELINUX ENFORCING · AVC DENIED" : "ISOLATED APP SANDBOXES"}
      plateOpacity={0.38}
      plateBlur={2.5}
      shake={zapHit > 0.25 ? zapHit * 9 : 0}
    >
      {/* Animated SVG conduits connecting Sandboxes <-> Linux Kernel & UID=0 Crown */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {apps.map((app, i) => {
          const cx = app.x + 160;
          return (
            <React.Fragment key={i}>
              <DataConduit
                d={`M ${cx} 655 L ${cx} 785`}
                color={isUid ? C.gold : app.col}
                width={3}
                packets={2}
                speed={0.018}
              />
              {isUid && (
                <DataConduit
                  d={`M 960 220 C 960 320, ${cx} 290, ${cx} 420`}
                  color={C.gold}
                  width={3.5}
                  packets={3}
                  speed={0.024}
                  opacity={crownRise}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Cue 2: SELinux Enforcing Laser Wall between left & right sandboxes */}
        {isSelinux && (
          <>
            <line x1="960" y1="250" x2="960" y2="780" stroke={C.crimson} strokeWidth={5 + zapHit * 9} strokeOpacity={0.9} />
            <line x1="960" y1="250" x2="960" y2="780" stroke="#ffffff" strokeWidth={2} />
            {/* Rogue cross-sandbox packet flying from Game (right) toward Bank (left) */}
            {attackCycle < 42 && (
              <g transform={`translate(${rogueX}, 530)`}>
                <circle r="24" fill={hexRgba(C.crimson, 0.35)} />
                <rect x="-78" y="-18" width="156" height="36" rx="8" fill="#1f0812" stroke={C.crimson} strokeWidth="2.5" />
                <text x="0" y="5" textAnchor="middle" fill="#fda4af" fontFamily="monospace" fontSize="14" fontWeight="800">
                  偷读银行 Token
                </text>
              </g>
            )}
            {zapHit > 0.05 && (
              <>
                <circle cx="960" cy="530" r={26 + (1 - zapHit) * 90} fill="none" stroke={C.crimson} strokeWidth="4" strokeOpacity={zapHit} />
                <circle cx="960" cy="530" r={18 * zapHit} fill="#ffffff" />
              </>
            )}
          </>
        )}
      </svg>

      {/* CUE 3: Radiant Golden UID = 0 Superuser Crown at Pyramid Apex */}
      {isUid && (
        <HardwareModule
          x={630}
          y={84}
          w={660}
          h={148}
          accent={C.gold}
          glow={1.0}
          delay={0}
          style={{
            background: "linear-gradient(135deg, rgba(64, 42, 6, 0.92), rgba(16, 12, 4, 0.95))",
          }}
        >
          <div style={{ padding: "24px 36px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 800, color: C.gold, letterSpacing: "0.22em" }}>
                LINUX SUPERUSER · PYRAMID APEX
              </div>
              <div style={{ fontSize: 42, fontWeight: 900, color: "#fff", marginTop: 4 }}>
                UID = 0 <span style={{ color: C.gold }}>（ROOT）</span>
              </div>
            </div>
            <div style={{ textAlign: "right", fontFamily: "monospace", fontSize: 15, color: "#fde68a", lineHeight: 1.65 }}>
              <div>✓ 读写任意分区</div>
              <div>✓ 接管硬件调度</div>
              <div>✓ 改写系统规则</div>
            </div>
          </div>
        </HardwareModule>
      )}

      {/* SELinux Policy Header Badge when active */}
      {isSelinux && (
        <HardwareModule x={630} y={108} w={660} h={124} accent={C.crimson} glow={0.7 + zapHit * 0.4}>
          <div style={{ padding: "20px 30px", fontFamily: "monospace" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>SELinux 强制访问防火墙</span>
              <span style={{ fontSize: 14, fontWeight: 800, color: C.emerald, padding: "4px 12px", borderRadius: 6, background: hexRgba(C.emerald, 0.16) }}>
                MODE: ENFORCING
              </span>
            </div>
            <div style={{ fontSize: 15, color: "#fda4af", marginTop: 12 }}>
              avc: denied &#123; read &#125; scontext=u:r:untrusted_app → tcontext=bank_data
            </div>
          </div>
        </HardwareModule>
      )}

      {/* 4 Glassmorphic App Sandbox Containers */}
      {apps.map((app, i) => (
        <HardwareModule
          key={i}
          x={app.x}
          y={420}
          w={320}
          h={235}
          accent={isUid ? C.gold : app.col}
          glow={isUid ? 0.85 : 0.45}
          delay={i * 5}
        >
          <div style={{ padding: "24px 26px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: isUid ? C.gold : app.col }}>
                {app.uid}
              </span>
              <span
                style={{
                  fontFamily: "monospace",
                  fontSize: 12,
                  fontWeight: 800,
                  padding: "3px 9px",
                  borderRadius: 6,
                  background: hexRgba(isUid ? C.gold : app.col, 0.18),
                  color: isUid ? C.gold : app.col,
                }}
              >
                {isUid ? "ROOT RWX" : "SANDBOXED"}
              </span>
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginTop: 14 }}>{app.name}</div>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: C.muted, marginTop: 4 }}>{app.pkg}</div>
            {/* Private encrypted /data bar */}
            <div
              style={{
                marginTop: 28,
                padding: "12px 14px",
                borderRadius: 10,
                background: "rgba(3, 6, 15, 0.72)",
                border: `1px solid ${hexRgba(isUid ? C.gold : app.col, 0.35)}`,
                fontFamily: "monospace",
                fontSize: 13,
                color: "#cbd5e1",
              }}
            >
              /data/data/{app.pkg.split(".")[1]} · 独立隔离
            </div>
          </div>
        </HardwareModule>
      ))}

      {/* Bottom: Gleaming Linux Kernel 6.x Base Floor */}
      <HardwareModule x={145} y={785} w={1630} h={132} accent={C.emerald} glow={0.65} delay={8}>
        <div style={{ padding: "24px 42px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
          <div>
            <div style={{ fontFamily: "monospace", fontSize: 14, color: C.emerald, letterSpacing: "0.22em", fontWeight: 800 }}>
              CORE OPERATING SYSTEM FLOOR
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginTop: 4 }}>
              Linux 内核（Android 真正的底层引擎）
            </div>
          </div>
          <div style={{ display: "flex", gap: 18, fontFamily: "monospace", fontSize: 15, color: "#e2e8f0" }}>
            {["进程与 UID 隔离", "内存虚拟分页", "硬件驱动调度", "SELinux LSM 钩子"].map((chip, k) => (
              <div
                key={k}
                style={{
                  padding: "10px 18px",
                  borderRadius: 10,
                  background: hexRgba(C.emerald, 0.14),
                  border: `1px solid ${hexRgba(C.emerald, 0.45)}`,
                  color: C.emerald,
                  fontWeight: 700,
                }}
              >
                {chip}
              </div>
            ))}
          </div>
        </div>
      </HardwareModule>
    </TechStage>
  );
};

/* ============================================================================
 * ACT 3: TRUST CHAIN — BootROM Mask Silicon -> Live SHA-256 AVB 2.0 Verification ->
 *                      1-Byte Tamper Avalanche Explosion & Bootloader Lock Slam
 * ============================================================================ */
export const TrustChainAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cAvb = getCue(scene.cues, "avbVerify");
  const cTamper = getCue(scene.cues, "tamperAlert");

  const isAvb = frame >= cAvb.from && frame < cTamper.from;
  const isTamper = frame >= cTamper.from;
  const accent = isTamper ? C.crimson : isAvb ? C.emerald : C.gold;

  const avbStep = isAvb
    ? interpolate(frame - cAvb.from, [0, cAvb.duration * 0.78], [0.2, 4.0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
    : isTamper
      ? 4.0
      : 0.6;

  const tamperLocal = Math.max(0, frame - cTamper.from);
  const byteFlipped = isTamper && tamperLocal >= 18;
  const jawSlam = spring({ frame: Math.max(0, tamperLocal - 36), fps, config: { damping: 14, stiffness: 180 } });
  const tamperShake = isTamper && tamperLocal >= 18 && tamperLocal < 46 ? Math.exp(-(tamperLocal - 18) * 0.12) * 14 : 0;

  const stages = [
    { num: "01", name: "BootROM", sub: "硅片出厂刻死 · RSA 公钥", hash: "ROOT_OF_TRUST_HW", col: C.gold },
    { num: "02", name: "Bootloader", sub: "硬件引导铁门", hash: "e3b0c442 98fc1c14", col: C.cyan },
    { num: "03", name: "boot.img", sub: "Linux 内核镜像", hash: "7a91d40f 2c88ab19", col: C.emerald },
    { num: "04", name: "/system", sub: "dm-verity 分区校验", hash: "19f0bc72 8e4431da", col: C.blue },
  ];

  return (
    <TechStage
      plate={isTamper ? "shot07_tamper_lockdown.jpg" : "shot06_bootrom_vault.jpg"}
      accent={accent}
      tag="ACT 03 // ANDROID VERIFIED BOOT (AVB 2.0)"
      subTag={isTamper ? "AVALANCHE HASH MISMATCH · BOOT HALTED" : isAvb ? "VERIFYING RSA-4096 SIGNATURES" : "T+0.001ms · BOOTROM IMMUTABLE SILICON"}
      plateOpacity={0.40}
      plateBlur={2.2}
      cameraZoom={isTamper ? interpolate(tamperLocal, [0, 50], [1.0, 1.05], { extrapolateRight: "clamp" }) : 1.0}
      shake={tamperShake}
    >
      {/* Top Timeline Telemetry Ribbon */}
      <div
        style={{
          position: "absolute",
          top: 96,
          left: 110,
          right: 110,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div>
          <div style={{ fontFamily: "monospace", fontSize: 16, letterSpacing: "0.24em", color: accent, fontWeight: 800 }}>
            {isTamper ? "CRYPTOGRAPHIC INTEGRITY VIOLATION" : "HARDWARE CHAIN OF TRUST"}
          </div>
          <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
            {isTamper ? "改一个字节，哈希雪崩，直接拒绝开机" : "开机第一毫秒：接力式数字签名安检"}
          </div>
        </div>
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 18,
            fontWeight: 800,
            padding: "10px 22px",
            borderRadius: 10,
            background: hexRgba(accent, 0.18),
            border: `1.5px solid ${accent}`,
            color: accent,
          }}
        >
          {isTamper ? "BOOTLOADER LOCK: SEALED" : `STAGE ${Math.min(4, Math.ceil(avbStep))} / 4`}
        </div>
      </div>

      {/* Connecting Optical Verification Beams between all 4 stages */}
      <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[0, 1, 2].map((i) => {
          const x1 = 110 + i * 442 + 376;
          const x2 = 110 + (i + 1) * 442;
          const active = avbStep >= i + 1;
          const broken = byteFlipped && i >= 1;
          return (
            <DataConduit
              key={i}
              d={`M ${x1} 450 L ${x2} 450`}
              color={broken ? C.crimson : active ? C.emerald : C.dim}
              width={broken ? 5 : 4}
              packets={broken ? 0 : active ? 2 : 0}
              dashed={broken}
              opacity={active ? 1 : 0.35}
            />
          );
        })}
      </svg>

      {/* 4 Brushed-Titanium Cryptographic Vault Cards */}
      {stages.map((st, idx) => {
        const x = 110 + idx * 442;
        const verified = avbStep >= idx + 0.7;
        const corrupted = byteFlipped && idx === 2;
        const blocked = byteFlipped && idx >= 2;
        const borderCol = corrupted ? C.crimson : blocked ? C.dim : verified ? (idx === 0 ? C.gold : C.emerald) : C.dim;

        return (
          <HardwareModule
            key={idx}
            x={x}
            y={255}
            w={376}
            h={395}
            accent={borderCol}
            glow={corrupted ? 1.0 : verified && !blocked ? 0.75 : 0.15}
            delay={idx * 4}
          >
            <div style={{ padding: "26px 26px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 900, color: borderCol }}>
                    STAGE {st.num}
                  </span>
                  <span
                    style={{
                      fontFamily: "monospace",
                      fontSize: 12,
                      fontWeight: 800,
                      padding: "4px 10px",
                      borderRadius: 6,
                      background: hexRgba(borderCol, 0.2),
                      color: borderCol,
                    }}
                  >
                    {corrupted ? "HASH MISMATCH ✗" : blocked ? "HALTED" : verified ? "VERIFIED ✓" : "WAITING"}
                  </span>
                </div>
                <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginTop: 14 }}>{st.name}</div>
                <div style={{ fontSize: 15, color: C.muted, marginTop: 4 }}>{st.sub}</div>
              </div>

              {/* Live Hex Byte Window inside Stage */}
              <div
                style={{
                  padding: "16px 16px",
                  borderRadius: 12,
                  background: "rgba(3, 6, 15, 0.85)",
                  border: `1px solid ${hexRgba(borderCol, 0.4)}`,
                  fontFamily: "monospace",
                  fontSize: 14,
                  lineHeight: 1.75,
                }}
              >
                <div style={{ color: C.muted }}>
                  HEX: 4A 0F 9C{" "}
                  <span
                    style={{
                      color: corrupted ? "#ffffff" : C.cyan,
                      background: corrupted ? C.crimson : "transparent",
                      padding: corrupted ? "1px 5px" : "0",
                      borderRadius: 4,
                      fontWeight: 900,
                    }}
                  >
                    {corrupted ? "FF" : "7F"}
                  </span>{" "}
                  2E 11
                </div>
                <div style={{ color: C.muted, fontSize: 12, marginTop: 8 }}>SHA-256 DIGEST:</div>
                <div style={{ color: corrupted ? C.crimson : verified ? C.emerald : C.dim, fontWeight: 800, fontSize: 15 }}>
                  {corrupted ? "4e0b99ff 81ca02d4" : st.hash}
                </div>
                {corrupted && (
                  <div style={{ color: "#fda4af", fontSize: 12, marginTop: 4 }}>
                    ≠ 预期签名: 7a91d40f 2c88ab19
                  </div>
                )}
              </div>
            </div>
          </HardwareModule>
        );
      })}

      {/* Bottom: Dramatic Bootloader Lock Gate Slam Bar during tamperAlert */}
      {isTamper && (
        <HardwareModule
          x={260}
          y={708}
          w={1400}
          h={152}
          accent={C.crimson}
          glow={1.0}
          style={{
            background: "linear-gradient(90deg, rgba(64, 8, 22, 0.94), rgba(20, 6, 14, 0.96), rgba(64, 8, 22, 0.94))",
            transform: `scale(${0.92 + jawSlam * 0.08})`,
          }}
        >
          <div style={{ padding: "24px 44px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 15, color: C.crimson, fontWeight: 800, letterSpacing: "0.24em" }}>
                DM-VERITY CORRUPTED · FIRST IRON GATE
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginTop: 6 }}>
                Bootloader 锁（BL 锁）：拒绝加载任何未经官方签名的内核
              </div>
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 22,
                fontWeight: 900,
                color: "#fff",
                padding: "14px 28px",
                borderRadius: 12,
                background: C.crimson,
                boxShadow: `0 0 28px ${C.crimson}`,
              }}
            >
              BOOT HALTED
            </div>
          </div>
        </HardwareModule>
      )}
    </TechStage>
  );
};

/* ============================================================================
 * ACT 4: UNLOCK, MAGISK & KERNELSU —
 *   1. Mechanical BL Unlock + AES-256 Anti-Theft Key Wipe
 *   2. Surgical init_boot.img Dissection & magiskinit Injection
 *   3. Systemless OverlayFS Live Syscall Ray Redirection (SIGNATURE SCENE!)
 *   4. KernelSU Ring-0 In-Kernel Stealth Whitelist
 * ============================================================================ */
export const UnlockMagiskAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cPatch = getCue(scene.cues, "bootPatch");
  const cSys = getCue(scene.cues, "systemless");
  const cKsu = getCue(scene.cues, "kernelSu");

  const phase =
    frame >= cKsu.from ? "ksu" : frame >= cSys.from ? "sys" : frame >= cPatch.from ? "patch" : "unlock";

  const accent = phase === "ksu" ? C.gold : phase === "sys" ? C.violet : C.cyan;
  const plate =
    phase === "ksu"
      ? "shot11_kernel_veins.jpg"
      : phase === "sys"
        ? "shot10_overlay_glass.jpg"
        : phase === "patch"
          ? "shot09_boot_surgery.jpg"
          : "shot06_bootrom_vault.jpg";

  // Phase 1: BL unlock dial + wipe wave
  const unlockProg = spring({ frame: Math.max(0, frame - 22), fps, config: { damping: 14, stiffness: 65 } });
  const wipeWave = interpolate(frame, [95, 250], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // Phase 2: init_boot surgical split -> magiskinit drops in -> fuses back
  const patchLocal = Math.max(0, frame - cPatch.from);
  const splitGap =
    patchLocal < 130
      ? interpolate(patchLocal, [10, 55], [0, 120], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })
      : interpolate(patchLocal, [150, 195], [120, 12], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const injectY = interpolate(easeOutCubic((patchLocal - 45) / 85), [0, 1], [-180, 0]);
  const patchDone = patchLocal >= 190;

  // Phase 3: Systemless OverlayFS syscall ray refraction
  const sysLocal = Math.max(0, frame - cSys.from);
  const rayPhase = (sysLocal % 90) / 90;

  // Phase 4: KernelSU Ring-0 whitelist demo
  const ksuLocal = Math.max(0, frame - cKsu.from);

  return (
    <TechStage
      plate={plate}
      accent={accent}
      tag="ACT 04 // MODERN ROOT ARCHITECTURE"
      subTag={
        phase === "ksu"
          ? "KERNELSU · IN-KERNEL RING 0"
          : phase === "sys"
            ? "MAGISK · SYSTEMLESS OVERLAYFS"
            : phase === "patch"
              ? "INIT_BOOT.IMG · SURGICAL PATCH"
              : "OEM UNLOCK · ANTI-THEFT WIPE"
      }
      plateOpacity={0.38}
      plateBlur={2.2}
    >
      {/* PHASE 1: Bootloader Unlock + AES Encryption Key Destruction */}
      {phase === "unlock" && (
        <>
          <HardwareModule x={140} y={135} w={740} h={720} accent={unlockProg > 0.5 ? C.emerald : C.gold} glow={0.75}>
            <div style={{ padding: "36px 40px", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ width: "100%" }}>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.cyan, letterSpacing: "0.22em", fontWeight: 800 }}>
                  STEP 01 // FASTBOOT FLASHING UNLOCK
                </div>
                <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", marginTop: 8 }}>解开 Bootloader 铁门</div>
              </div>

              {/* Rotating Mechanical Titanium Vault Lock SVG */}
              <svg width="420" height="420" viewBox="-210 -210 420 420">
                <circle r="175" fill="none" stroke={hexRgba(C.cyan, 0.25)} strokeWidth="14" strokeDasharray="24 14" transform={`rotate(${unlockProg * 90})`} />
                <circle r="138" fill="none" stroke={unlockProg > 0.5 ? C.emerald : C.gold} strokeWidth="6" strokeDasharray="48 22" transform={`rotate(${-unlockProg * 145})`} />
                <circle r="96" fill="rgba(8, 18, 36, 0.92)" stroke={unlockProg > 0.5 ? C.emerald : C.gold} strokeWidth="4" />
                {/* Unlocking shackle */}
                <path
                  d={`M -28 ${-6 - unlockProg * 28} L -28 ${-34 - unlockProg * 28} A 28 28 0 0 1 28 ${-34 - unlockProg * 28} L 28 ${-6 - unlockProg * 10}`}
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <rect x="-42" y="-8" width="84" height="62" rx="12" fill={hexRgba(unlockProg > 0.5 ? C.emerald : C.gold, 0.24)} stroke={unlockProg > 0.5 ? C.emerald : C.gold} strokeWidth="3.5" />
                <text x="0" y="128" textAnchor="middle" fill={unlockProg > 0.5 ? C.emerald : C.gold} fontFamily="monospace" fontSize="18" fontWeight="900">
                  {unlockProg > 0.5 ? "UNLOCKED" : "LOCKED"}
                </text>
              </svg>

              <div style={{ width: "100%", padding: "14px 20px", borderRadius: 12, background: "rgba(3,6,15,0.8)", fontFamily: "monospace", fontSize: 16, color: C.emerald }}>
                $ fastboot flashing unlock → OKAY [0.12s]
              </div>
            </div>
          </HardwareModule>

          {/* Right: Anti-Theft Userdata Wipe Grid */}
          <HardwareModule x={940} y={135} w={840} h={720} accent={C.gold} glow={0.6}>
            <div style={{ padding: "36px 40px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.gold, letterSpacing: "0.22em", fontWeight: 800 }}>
                  SECURITY CONSEQUENCE // ANTI-THEFT
                </div>
                <div style={{ fontSize: 38, fontWeight: 900, color: "#fff", marginTop: 8 }}>
                  为什么解锁必须清空全盘数据？
                </div>
                <div style={{ fontSize: 19, color: C.muted, marginTop: 10 }}>
                  自动销毁本地 AES-256 解密密钥，防止手机被盗后被人直接解锁导出隐私。
                </div>
              </div>

              {/* 4x3 Encrypted Userdata Blocks being swept & zeroed */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, margin: "18px 0" }}>
                {["相册照片", "聊天记录", "银行凭据", "备忘录", "指纹密钥", "通讯录", "定位轨迹", "密码库", "App 数据", "短信记录", "下载文件", "生物特征"].map((label, idx) => {
                  const colPos = (idx % 4) / 3.2;
                  const wiped = wipeWave > colPos + 0.08;
                  return (
                    <div
                      key={idx}
                      style={{
                        padding: "22px 14px",
                        borderRadius: 14,
                        textAlign: "center",
                        background: wiped ? "rgba(15, 23, 42, 0.45)" : hexRgba(C.gold, 0.16),
                        border: `1.5px solid ${wiped ? "rgba(148,163,184,0.22)" : C.gold}`,
                      }}
                    >
                      <div style={{ fontSize: 18, fontWeight: 800, color: wiped ? C.dim : "#fff" }}>
                        {wiped ? "0x0000" : label}
                      </div>
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: wiped ? C.crimson : C.gold, marginTop: 6 }}>
                        {wiped ? "WIPED" : "AES-256"}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  padding: "16px 22px",
                  borderRadius: 12,
                  background: hexRgba(C.gold, 0.14),
                  border: `1px solid ${hexRgba(C.gold, 0.45)}`,
                  fontFamily: "monospace",
                  fontSize: 16,
                  color: "#fde68a",
                }}
              >
                ERASING /userdata ... {Math.round(wipeWave * 100)}% {wipeWave >= 0.99 ? "· 恢复出厂状态完成" : ""}
              </div>
            </div>
          </HardwareModule>
        </>
      )}

      {/* PHASE 2: Surgical init_boot.img Patching */}
      {phase === "patch" && (
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", top: 96, width: "100%", textAlign: "center" }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.cyan, letterSpacing: "0.28em", fontWeight: 800 }}>
              STEP 02 // SURGICAL BOOT IMAGE PATCH
            </div>
            <div style={{ fontSize: 46, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              拆解启动镜像 → 注入 Magisk 守护进程 → 刷回手机
            </div>
          </div>

          {/* Left Half: Linux Kernel */}
          <HardwareModule x={430 - splitGap} y={320} w={370} h={340} accent={C.cyan} glow={0.65}>
            <div style={{ padding: "32px 30px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: C.cyan, fontWeight: 800 }}>ORIGINAL BINARY</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginTop: 10 }}>Linux Kernel</div>
              <div style={{ fontSize: 16, color: C.muted, marginTop: 10, lineHeight: 1.6 }}>
                保持官方原版内核核心，无需暴力篡改系统分区。
              </div>
              <div style={{ marginTop: 32, fontFamily: "monospace", fontSize: 14, color: C.cyan, padding: "10px 14px", borderRadius: 10, background: "rgba(3,6,15,0.8)" }}>
                init_boot.img :: part 1
              </div>
            </div>
          </HardwareModule>

          {/* Center: Descending radiant magiskinit daemon module */}
          <HardwareModule
            x={815}
            y={355 + injectY}
            w={290}
            h={270}
            accent={C.emerald}
            glow={1.0}
            style={{
              background: "linear-gradient(155deg, rgba(6, 56, 46, 0.94), rgba(4, 24, 28, 0.96))",
              zIndex: 4,
            }}
          >
            <div style={{ padding: "28px 26px", textAlign: "center" }}>
              <div style={{ fontFamily: "monospace", fontSize: 13, color: C.emerald, letterSpacing: "0.2em", fontWeight: 800 }}>
                INJECTED DAEMON
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginTop: 12 }}>magiskinit</div>
              <div style={{ fontSize: 15, color: "#a7f3d0", marginTop: 12, lineHeight: 1.5 }}>
                开机最早期接管初始化，注入 su 守护与挂载钩子
              </div>
              <div style={{ marginTop: 22, fontFamily: "monospace", fontSize: 14, fontWeight: 800, color: C.emerald }}>
                {patchDone ? "✓ SEALED & FLASHED" : "↓ INJECTING..."}
              </div>
            </div>
          </HardwareModule>

          {/* Right Half: Ramdisk */}
          <HardwareModule x={1120 + splitGap} y={320} w={370} h={340} accent={C.blue} glow={0.65}>
            <div style={{ padding: "32px 30px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: C.blue, fontWeight: 800 }}>EARLY INIT RAMFS</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginTop: 10 }}>Ramdisk 内存盘</div>
              <div style={{ fontSize: 16, color: C.muted, marginTop: 10, lineHeight: 1.6 }}>
                开机先于 Android 系统加载的内存文件系统容器。
              </div>
              <div style={{ marginTop: 32, fontFamily: "monospace", fontSize: 14, color: C.blue, padding: "10px 14px", borderRadius: 10, background: "rgba(3,6,15,0.8)" }}>
                init_boot.img :: part 2
              </div>
            </div>
          </HardwareModule>

          {/* Bottom live fastboot pipeline bar */}
          <HardwareModule x={330} y={735} w={1260} h={110} accent={patchDone ? C.emerald : C.cyan} glow={0.7}>
            <div style={{ padding: "0 36px", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "monospace", fontSize: 18 }}>
              <span style={{ color: C.cyan }}>$ fastboot flash init_boot magisk_patched.img</span>
              <span style={{ color: patchDone ? C.emerald : C.gold, fontWeight: 900 }}>
                {patchDone ? "Writing 'init_boot' ... OKAY [0.48s]" : "Repacking ramdisk.cpio ..."}
              </span>
            </div>
          </HardwareModule>
        </div>
      )}

      {/* PHASE 3: Systemless OverlayFS — Live Syscall Ray Redirection Demo! */}
      {phase === "sys" && (
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", top: 92, left: 110 }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.violet, letterSpacing: "0.24em", fontWeight: 800 }}>
              MAGISK CORE INNOVATION // SYSTEMLESS
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              Systemless 无系统修改：用虚拟挂载层「凌空覆盖」
            </div>
          </div>

          {/* Live Optical Ray Path showing open("/system/etc/hosts") bending cleanly at OverlayFS! */}
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 5 }}>
            {/* Downward request ray from App -> OverlayFS */}
            <DataConduit d="M 480 288 L 480 398" color={C.cyan} width={4.5} packets={2} speed={0.024} />
            {/* Redirected horizontal refraction across OverlayFS crystal rim -> returns modified file! */}
            <DataConduit d="M 480 398 L 1180 398 L 1180 288" color={C.violet} width={4.5} packets={3} speed={0.026} />
            {/* Glowing refraction prism diamonds */}
            <polygon points="480,386 492,398 480,410 468,398" fill={C.cyan} stroke="#ffffff" strokeWidth="2" />
            <polygon points="1180,386 1192,398 1180,410 1168,398" fill={C.violet} stroke="#ffffff" strokeWidth="2" />
            {/* Dashed vertical projection beams linking OverlayFS to untouched /system (0 disk writes!) */}
            {[360, 740, 1120, 1480].map((lx, i) => (
              <line key={i} x1={lx} y1="560" x2={lx} y2="675" stroke={hexRgba(C.cyan, 0.55)} strokeWidth="2" strokeDasharray="6 6" />
            ))}
            {/* Animated travelling query orb */}
            <circle
              cx={rayPhase < 0.35 ? 480 : rayPhase < 0.72 ? interpolate(rayPhase, [0.35, 0.72], [480, 1180]) : 1180}
              cy={rayPhase < 0.35 ? interpolate(rayPhase, [0, 0.35], [295, 398]) : rayPhase < 0.72 ? 398 : interpolate(rayPhase, [0.72, 1], [398, 295])}
              r="11"
              fill="#ffffff"
            />
          </svg>

          {/* Top App Query Box */}
          <HardwareModule x={330} y={208} w={1020} h={80} accent={C.cyan} glow={0.55}>
            <div style={{ padding: "0 30px", height: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: "monospace", fontSize: 18 }}>
              <span style={{ color: C.cyan }}>APP 请求: open(&quot;/system/etc/hosts&quot;) ↓</span>
              <span style={{ color: C.violet, fontWeight: 800 }}>↑ 返回虚拟挂载层的修改版本（无感生效）</span>
            </div>
          </HardwareModule>

          {/* Middle Floating Holographic OverlayFS Layer */}
          <HardwareModule
            x={160}
            y={380}
            w={1600}
            h={180}
            accent={C.violet}
            glow={0.95}
            style={{
              background: "linear-gradient(135deg, rgba(76, 29, 149, 0.52), rgba(15, 23, 42, 0.88))",
            }}
          >
            <div style={{ padding: "26px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.violet, fontWeight: 800, letterSpacing: "0.2em" }}>
                  FLOATING MOUNT NAMESPACE · OVERLAYFS
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginTop: 6 }}>
                  Magisk 虚拟挂载覆盖层（驻留内存）
                </div>
              </div>
              <div style={{ display: "flex", gap: 16 }}>
                {["去广告 hosts", "LSPosed 框架", "自定义字体 / 温控"].map((mod, k) => (
                  <div
                    key={k}
                    style={{
                      padding: "14px 22px",
                      borderRadius: 14,
                      background: hexRgba(C.violet, 0.25),
                      border: `1.5px solid ${C.violet}`,
                      color: "#fff",
                      fontSize: 18,
                      fontWeight: 800,
                    }}
                  >
                    {mod}
                  </div>
                ))}
              </div>
            </div>
          </HardwareModule>

          {/* Bottom Pristine Read-Only /system Partition */}
          <HardwareModule
            x={160}
            y={675}
            w={1600}
            h={195}
            accent={C.emerald}
            glow={0.7}
            style={{
              background: "linear-gradient(135deg, rgba(6, 54, 46, 0.72), rgba(6, 16, 24, 0.94))",
            }}
          >
            <div style={{ padding: "30px 40px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.emerald, fontWeight: 800, letterSpacing: "0.2em" }}>
                  PHYSICAL /SYSTEM PARTITION · READ-ONLY
                </div>
                <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", marginTop: 6 }}>
                  原版 /system 分区：100% 纹丝不动
                </div>
                <div style={{ fontSize: 18, color: "#a7f3d0", marginTop: 8 }}>
                  磁盘写入 = 0 字节 · 卸载模块或重启安全模式即可无痕还原
                </div>
              </div>
              <div
                style={{
                  fontFamily: "monospace",
                  fontSize: 20,
                  fontWeight: 900,
                  color: C.emerald,
                  padding: "16px 28px",
                  borderRadius: 14,
                  background: hexRgba(C.emerald, 0.16),
                  border: `2px solid ${C.emerald}`,
                }}
              >
                0 BYTES MODIFIED ✓
              </div>
            </div>
          </HardwareModule>
        </div>
      )}

      {/* PHASE 4: KernelSU Ring-0 Whitelist Architecture */}
      {phase === "ksu" && (
        <div style={{ position: "absolute", inset: 0 }}>
          <div style={{ position: "absolute", top: 92, left: 110 }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.gold, letterSpacing: "0.24em", fontWeight: 800 }}>
              NEXT-GEN ROOT // RING 0 IN-KERNEL
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              KernelSU：直接住进 Linux 内核，白名单精准放行
            </div>
          </div>

          {/* Ring 3 User Space (Left: Bank App sees NOTHING; Right: Whitelisted Terminal gets Golden Root) */}
          <HardwareModule x={140} y={240} w={760} h={285} accent={C.muted} glow={0.3}>
            <div style={{ padding: "28px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 14 }}>
                <span style={{ color: C.muted }}>RING 3 // UNTRUSTED APP</span>
                <span style={{ color: C.emerald, fontWeight: 800 }}>STEALTH: 0 TRACES</span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginTop: 10 }}>银行 / 支付 App 探测</div>
              <div style={{ marginTop: 22, padding: "16px 18px", borderRadius: 12, background: "rgba(3,6,15,0.85)", fontFamily: "monospace", fontSize: 15, lineHeight: 1.75 }}>
                <div style={{ color: C.cyan }}>$ ls /sbin/su /system/xbin/su</div>
                <div style={{ color: C.emerald }}>→ ENOENT (未发现任何 Root 文件)</div>
                <div style={{ color: C.muted }}>→ 仅见干净原版用户空间</div>
              </div>
            </div>
          </HardwareModule>

          <HardwareModule x={1020} y={240} w={760} h={285} accent={C.gold} glow={0.9}>
            <div style={{ padding: "28px 32px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 14 }}>
                <span style={{ color: C.gold }}>RING 3 // WHITELISTED APP</span>
                <span style={{ color: C.gold, fontWeight: 800 }}>GRANTED UID = 0 ✓</span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginTop: 10 }}>授权极客工具 / 终端</div>
              <div style={{ marginTop: 22, padding: "16px 18px", borderRadius: 12, background: "rgba(3,6,15,0.85)", fontFamily: "monospace", fontSize: 15, lineHeight: 1.75 }}>
                <div style={{ color: C.cyan }}>$ ksu_escalate_to_root()</div>
                <div style={{ color: C.gold, fontWeight: 800 }}>→ 内核钩子核验白名单通过！</div>
                <div style={{ color: C.emerald }}>→ uid=0(root) gid=0(root) 直接放行</div>
              </div>
            </div>
          </HardwareModule>

          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <DataConduit d="M 1400 620 L 1400 525" color={C.gold} width={5} packets={3} speed={0.028} />
            <line x1="520" y1="525" x2="520" y2="620" stroke={hexRgba(C.muted, 0.35)} strokeWidth="2.5" strokeDasharray="6 6" />
          </svg>

          {/* Ring 0 Linux Kernel Bar hosting KernelSU */}
          <HardwareModule
            x={140}
            y={620}
            w={1640}
            h={240}
            accent={C.gold}
            glow={0.9 + Math.sin(ksuLocal * 0.12) * 0.1}
            style={{
              background: "linear-gradient(135deg, rgba(60, 40, 8, 0.85), rgba(8, 28, 24, 0.94))",
            }}
          >
            <div style={{ padding: "32px 44px", display: "flex", justifyContent: "space-between", alignItems: "center", height: "100%" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.gold, letterSpacing: "0.24em", fontWeight: 800 }}>
                  RING 0 // LINUX KERNEL SPACE
                </div>
                <div style={{ fontSize: 40, fontWeight: 900, color: "#fff", marginTop: 8 }}>
                  KernelSU 内核级超级权限管理器
                </div>
                <div style={{ fontSize: 19, color: "#fde68a", marginTop: 10 }}>
                  不在用户空间留 su 文件，直接拦截内核系统调用，只对白名单 App 现身
                </div>
              </div>
              <div style={{ fontFamily: "monospace", fontSize: 16, lineHeight: 1.9, textAlign: "right" }}>
                <div style={{ color: C.emerald }}>[✓] com.termux → ALLOW (uid=0)</div>
                <div style={{ color: C.emerald }}>[✓] com.backup → ALLOW (uid=0)</div>
                <div style={{ color: C.muted }}>[✗] com.bank   → HIDDEN (invisible)</div>
              </div>
            </div>
          </HardwareModule>
        </div>
      )}
    </TechStage>
  );
};
