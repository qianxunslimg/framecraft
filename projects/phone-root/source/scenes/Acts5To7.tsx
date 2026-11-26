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
 * ACT 5: POWERS — 8-Core ARM SoC Die + Real-Time Frequency/Thermal Oscilloscope
 *                 -> Live iptables Kernel Packet Firewall & System Ecosystem
 * ============================================================================ */
export const PowersAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const cTools = getCue(scene.cues, "deepTools");
  const isTools = frame >= cTools.from;
  const accent = isTools ? C.cyan : C.orange;

  // Cycle between Stock Throttled -> Overclocked Performance -> Undervolt Eco in cpuTune
  const modePhase = frame < 110 ? 0 : frame < 235 ? 1 : 2;
  const targetGhz = modePhase === 0 ? 2.15 : modePhase === 1 ? 3.85 : 2.65;
  const targetTemp = modePhase === 0 ? 52 : modePhase === 1 ? 66 : 38;
  const targetMv = modePhase === 0 ? "0 mV" : modePhase === 1 ? "+45 mV" : "-85 mV";
  const modeLabel =
    modePhase === 0 ? "原厂保守温控（触发降频）" : modePhase === 1 ? "性能解锁模式（满血高频）" : "定制降压锁频（低温长续航）";
  const modeCol = modePhase === 0 ? C.muted : modePhase === 1 ? C.orange : C.emerald;

  // Animated oscilloscope SVG polyline
  const buildWave = (amp: number, base: number, freq: number, shift: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 48; i++) {
      const x = 18 + (i / 48) * 684;
      const y = base - Math.sin((i + frame * 0.45) * freq + shift) * amp - Math.cos((i * 1.7 + frame * 0.3) * 0.35) * (amp * 0.35);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(" ");
  };

  // Live packet firewall streams in deepTools
  const toolsLocal = Math.max(0, frame - cTools.from);
  const blockedCount = 1240 + Math.floor(toolsLocal * 2.6);

  return (
    <TechStage
      plate={isTools ? "shot03_sandbox_city.jpg" : "shot02_pixel_dive.jpg"}
      accent={accent}
      tag="ACT 05 // GOD MODE UNLEASHED"
      subTag={isTools ? "KERNEL FIREWALL · BACKUP · LSPOSED" : "ARM SOC DIE · GOVERNOR & THERMAL"}
      plateOpacity={0.38}
      plateBlur={2.5}
    >
      {/* CUE 1: Geekerwan-Style 8-Core ARM SoC Die & Live Oscilloscope */}
      {!isTools && (
        <>
          <div style={{ position: "absolute", top: 90, left: 120, right: 120, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ fontFamily: "monospace", fontSize: 16, color: modeCol, letterSpacing: "0.24em", fontWeight: 800 }}>
                DIRECT HARDWARE CONTROL // /sys/devices/system/cpu
              </div>
              <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
                直控处理器调频曲线与温控阈值
              </div>
            </div>
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 18,
                fontWeight: 900,
                padding: "10px 22px",
                borderRadius: 10,
                background: hexRgba(modeCol, 0.18),
                border: `1.5px solid ${modeCol}`,
                color: modeCol,
              }}
            >
              {modeLabel}
            </div>
          </div>

          {/* Left: Top-Down Detailed 8-Core ARM SoC Silicon Die */}
          <HardwareModule x={120} y={240} w={840} h={640} accent={modeCol} glow={0.75}>
            <div style={{ padding: "28px 34px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "monospace", fontSize: 15, color: C.muted }}>
                <span>FLAGSHIP 3nm ARMv9 SOC DIE</span>
                <span style={{ color: modeCol, fontWeight: 800 }}>THERMAL: {targetTemp}°C</span>
              </div>

              {/* 8 Core Silicon Layout Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {[
                  { name: "PRIME X4", ghz: targetGhz, prime: true },
                  { name: "PERF A720", ghz: targetGhz * 0.86, prime: false },
                  { name: "PERF A720", ghz: targetGhz * 0.85, prime: false },
                  { name: "PERF A720", ghz: targetGhz * 0.84, prime: false },
                  { name: "EFF A520", ghz: targetGhz * 0.58, prime: false },
                  { name: "EFF A520", ghz: targetGhz * 0.56, prime: false },
                  { name: "EFF A520", ghz: targetGhz * 0.57, prime: false },
                  { name: "EFF A520", ghz: targetGhz * 0.55, prime: false },
                ].map((core, i) => {
                  const pulse = 0.72 + 0.28 * Math.sin(frame * (0.14 + modePhase * 0.08) + i * 0.9);
                  const col = core.prime ? (modePhase === 1 ? C.crimson : modeCol) : modeCol;
                  return (
                    <div
                      key={i}
                      style={{
                        padding: "20px 14px",
                        borderRadius: 14,
                        background: `linear-gradient(155deg, ${hexRgba(col, 0.24 * pulse)}, rgba(6, 12, 24, 0.94))`,
                        border: `1.5px solid ${hexRgba(col, 0.55 + 0.35 * pulse)}`,
                        boxShadow: `0 0 ${14 + 18 * pulse}px ${hexRgba(col, 0.25)}`,
                      }}
                    >
                      <div style={{ fontFamily: "monospace", fontSize: 12, color: col, fontWeight: 800 }}>{core.name}</div>
                      <div style={{ fontFamily: "monospace", fontSize: 24, fontWeight: 900, color: "#fff", marginTop: 8 }}>
                        {core.ghz.toFixed(2)} <span style={{ fontSize: 13, color: C.muted }}>GHz</span>
                      </div>
                      <div style={{ marginTop: 10, height: 6, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                        <div style={{ width: `${Math.min(100, (core.ghz / 4.0) * 100)}%`, height: "100%", background: col }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* GPU / NPU / L3 Cache Block */}
              <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16 }}>
                <div style={{ padding: "18px 22px", borderRadius: 14, background: hexRgba(C.violet, 0.16), border: `1px solid ${hexRgba(C.violet, 0.45)}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "monospace", fontSize: 13, color: C.violet, fontWeight: 800 }}>IMMORTALIS / ADRENO GPU</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: "#fff", marginTop: 4 }}>图形渲染核心 · 频率可调</div>
                  </div>
                  <div style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 900, color: C.violet }}>{modePhase === 1 ? "1.15 GHz" : "780 MHz"}</div>
                </div>
                <div style={{ padding: "18px 20px", borderRadius: 14, background: hexRgba(C.cyan, 0.12), border: `1px solid ${hexRgba(C.cyan, 0.35)}` }}>
                  <div style={{ fontFamily: "monospace", fontSize: 12, color: C.cyan, fontWeight: 800 }}>VOLTAGE OFFSET</div>
                  <div style={{ fontFamily: "monospace", fontSize: 26, fontWeight: 900, color: "#fff", marginTop: 6 }}>{targetMv}</div>
                </div>
              </div>
            </div>
          </HardwareModule>

          {/* Right: Live Real-Time Oscilloscope & Sysfs Terminal */}
          <HardwareModule x={1000} y={240} w={800} h={640} accent={C.cyan} glow={0.55}>
            <div style={{ padding: "28px 34px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 14, color: C.cyan, fontWeight: 800, letterSpacing: "0.18em" }}>
                  LIVE FREQUENCY &amp; THERMAL OSCILLOSCOPE
                </div>
                <svg width="720" height="270" style={{ marginTop: 18, background: "rgba(3,6,15,0.8)", borderRadius: 14, border: "1px solid rgba(148,163,184,0.18)" }}>
                  {[55, 110, 165, 220].map((gy, k) => (
                    <line key={k} x1="16" y1={gy} x2="704" y2={gy} stroke="rgba(148,163,184,0.12)" strokeWidth="1" />
                  ))}
                  {/* Frequency curve */}
                  <polyline
                    points={buildWave(modePhase === 1 ? 26 : 14, modePhase === 1 ? 76 : modePhase === 2 ? 142 : 178, 0.22, 0)}
                    fill="none"
                    stroke={modeCol}
                    strokeWidth="4"
                    strokeLinejoin="round"
                  />
                  {/* Thermal curve */}
                  <polyline
                    points={buildWave(10, modePhase === 1 ? 150 : modePhase === 2 ? 210 : 185, 0.14, 2.2)}
                    fill="none"
                    stroke={C.cyan}
                    strokeWidth="2.8"
                    strokeDasharray="8 6"
                  />
                  <text x="28" y="34" fill={modeCol} fontFamily="monospace" fontSize="14" fontWeight="800">
                    CPU CLOCK: {targetGhz.toFixed(2)} GHz
                  </text>
                  <text x="480" y="34" fill={C.cyan} fontFamily="monospace" fontSize="14" fontWeight="800">
                    TEMP: {targetTemp}°C · {targetMv}
                  </text>
                </svg>
              </div>

              {/* Real Root sysfs command preview */}
              <div
                style={{
                  padding: "22px 24px",
                  borderRadius: 14,
                  background: "rgba(3, 6, 15, 0.88)",
                  border: `1px solid ${hexRgba(modeCol, 0.4)}`,
                  fontFamily: "monospace",
                  fontSize: 16,
                  lineHeight: 1.85,
                }}
              >
                <div style={{ color: C.emerald }}># su -c &quot;echo {modePhase === 1 ? "performance" : "schedutil"} &gt; scaling_governor&quot;</div>
                <div style={{ color: C.cyan }}># su -c &quot;echo {targetTemp + 15}000 &gt; thermal_zone0/trip_point&quot;</div>
                <div style={{ color: C.muted, marginTop: 8 }}>
                  → 摆脱原厂保守调度策略，性能释放与能耗比完全由你定义
                </div>
              </div>
            </div>
          </HardwareModule>
        </>
      )}

      {/* CUE 2: Live iptables Kernel Firewall Packet Vaporizer + 3 Ecosystem Pods */}
      {isTools && (
        <>
          <div style={{ position: "absolute", top: 90, left: 120 }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.cyan, letterSpacing: "0.24em", fontWeight: 800 }}>
              ROOT ECOSYSTEM // KERNEL-LEVEL CAPABILITIES
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              底层全局防火墙 · 完整全量备份 · 系统级插件生态
            </div>
          </div>

          {/* Live Animated Packet Filtering Stage */}
          <HardwareModule x={120} y={230} w={1680} h={345} accent={C.emerald} glow={0.65}>
            <div style={{ position: "relative", width: "100%", height: "100%" }}>
              <div style={{ position: "absolute", top: 22, left: 32, fontFamily: "monospace", fontSize: 15, color: C.emerald, fontWeight: 800, letterSpacing: "0.18em" }}>
                LIVE KERNEL IPTABLES / AD-BLOCK FIREWALL
              </div>
              <div style={{ position: "absolute", top: 20, right: 32, fontFamily: "monospace", fontSize: 18, color: C.crimson, fontWeight: 900 }}>
                BLOCKED TRACKERS: {blockedCount.toLocaleString()}
              </div>

              <svg width="1680" height="345" style={{ position: "absolute", inset: 0 }}>
                {/* 3 Horizontal Network Lanes */}
                {[115, 185, 255].map((ly, i) => (
                  <line key={i} x1="280" y1={ly} x2="1420" y2={ly} stroke="rgba(148,163,184,0.18)" strokeWidth="2" strokeDasharray="6 6" />
                ))}

                {/* Central Emerald Firewall Gate */}
                <rect x="815" y="68" width="52" height="232" rx="12" fill={hexRgba(C.emerald, 0.22)} stroke={C.emerald} strokeWidth="3" />
                <text x="841" y="190" textAnchor="middle" fill="#ffffff" fontFamily="monospace" fontSize="14" fontWeight="900" transform="rotate(-90 841 190)">
                  IPTABLES ROOT
                </text>

                {/* Animated packets: Lane 0 & 2 = Clean Cyan HTTPS passing straight through; Lane 1 = Crimson Ad/Tracker getting vaporized at x=815! */}
                {[0, 1, 2, 3].map((k) => {
                  const pClean = ((toolsLocal * 0.015 + k * 0.25) % 1 + 1) % 1;
                  const cx = 290 + pClean * 1110;
                  const cy = k % 2 === 0 ? 115 : 255;
                  return (
                    <g key={`c-${k}`} transform={`translate(${cx}, ${cy})`}>
                      <rect x="-56" y="-16" width="112" height="32" rx="8" fill="rgba(4,24,42,0.92)" stroke={C.cyan} strokeWidth="2" />
                      <text x="0" y="5" textAnchor="middle" fill={C.cyan} fontFamily="monospace" fontSize="13" fontWeight="800">
                        HTTPS ✓
                      </text>
                    </g>
                  );
                })}

                {[0, 1, 2].map((k) => {
                  const pAd = ((toolsLocal * 0.018 + k * 0.33) % 1 + 1) % 1;
                  if (pAd < 0.78) {
                    const ax = 290 + (pAd / 0.78) * 515;
                    return (
                      <g key={`a-${k}`} transform={`translate(${ax}, 185)`}>
                        <rect x="-64" y="-17" width="128" height="34" rx="8" fill="#2a0814" stroke={C.crimson} strokeWidth="2.2" />
                        <text x="0" y="5" textAnchor="middle" fill="#fda4af" fontFamily="monospace" fontSize="13" fontWeight="800">
                          ad.tracker.sdk
                        </text>
                      </g>
                    );
                  }
                  const boom = (pAd - 0.78) / 0.22;
                  return (
                    <circle
                      key={`b-${k}`}
                      cx="815"
                      cy="185"
                      r={14 + boom * 52}
                      fill="none"
                      stroke={C.crimson}
                      strokeWidth="3.5"
                      strokeOpacity={1 - boom}
                    />
                  );
                })}

                {/* Endpoint Badges */}
                <rect x="46" y="130" width="210" height="106" rx="14" fill="rgba(10,18,36,0.9)" stroke={C.cyan} strokeWidth="1.5" />
                <text x="151" y="176" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900">手机 App 流量</text>
                <text x="151" y="206" textAnchor="middle" fill={C.muted} fontFamily="monospace" fontSize="13">OUTBOUND PACKETS</text>

                <rect x="1424" y="130" width="210" height="106" rx="14" fill="rgba(6,32,28,0.9)" stroke={C.emerald} strokeWidth="1.5" />
                <text x="1529" y="176" textAnchor="middle" fill="#fff" fontSize="22" fontWeight="900">纯净公网出口</text>
                <text x="1529" y="206" textAnchor="middle" fill={C.emerald} fontFamily="monospace" fontSize="13">0 AD / 0 TRACKER</text>
              </svg>
            </div>
          </HardwareModule>

          {/* Bottom 3 Ecosystem Pods */}
          {[
            { x: 120, title: "真正完整的全量备份", sub: "DATA + APK + ACCOUNTS", desc: "直接打包 /data 私有分区，换机或刷机一键无损还原所有聊天与登录态。", col: C.cyan },
            { x: 694, title: "LSPosed 插件框架", sub: "RUNTIME METHOD HOOKING", desc: "不改 App 安装包，在内存动态拦截系统界面、状态栏、动画与交互逻辑。", col: C.violet },
            { x: 1268, title: "彻底剥离预装与限制", sub: "DEBLOAT & FULL CONTROL", desc: "冻结顽固后台唤醒、定制充电截止阈值保护电池、解锁隐藏硬件功能。", col: C.gold },
          ].map((pod, idx) => (
            <HardwareModule key={idx} x={pod.x} y={615} w={532} h={270} accent={pod.col} glow={0.55} delay={idx * 6}>
              <div style={{ padding: "28px 32px" }}>
                <div style={{ fontFamily: "monospace", fontSize: 13, color: pod.col, fontWeight: 800, letterSpacing: "0.18em" }}>
                  {pod.sub}
                </div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginTop: 10 }}>{pod.title}</div>
                <div style={{ fontSize: 17, color: "#cbd5e1", marginTop: 16, lineHeight: 1.65 }}>{pod.desc}</div>
              </div>
            </HardwareModule>
          ))}
        </>
      )}
    </TechStage>
  );
};

/* ============================================================================
 * ACT 6: CAT & MOUSE — ARM TrustZone Dual-World Wall (bounces Root laser!) ->
 *                      Play Integrity 3-Tier Attestation vs Stealth War ->
 *                      Live Malware Root Grant -> Sandbox Shatter & Bootloop
 * ============================================================================ */
export const CatMouseAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cWar = getCue(scene.cues, "integrityWar");
  const cDanger = getCue(scene.cues, "dangerZone");

  const phase = frame >= cDanger.from ? "danger" : frame >= cWar.from ? "war" : "tee";
  const accent = phase === "tee" ? C.gold : C.crimson;
  const plate =
    phase === "danger"
      ? "shot15_sandbox_shatter.jpg"
      : phase === "war"
        ? "shot14_cat_mouse_clash.jpg"
        : "shot13_tee_bunker.jpg";

  // Phase 1: Root laser slamming into TrustZone hardware bus wall and bouncing off!
  const beamCycle = frame % 70;
  const beamX = beamCycle < 36 ? interpolate(beamCycle, [0, 36], [620, 945]) : interpolate(beamCycle, [36, 65], [945, 720]);
  const wallHit = beamCycle >= 34 && beamCycle < 52 ? Math.sin(((beamCycle - 34) / 18) * Math.PI) : 0;
  const fuseSnapped = frame >= 85;

  // Phase 3: Malware tap -> SELinux shatter -> bootloop
  const dLocal = Math.max(0, frame - cDanger.from);
  const tapped = dLocal >= 42;
  const shatterP = spring({ frame: Math.max(0, dLocal - 44), fps, config: { damping: 14, stiffness: 120 } });
  const dShake = dLocal >= 42 && dLocal < 74 ? Math.exp(-(dLocal - 42) * 0.1) * 14 : 0;

  return (
    <TechStage
      plate={plate}
      accent={accent}
      tag="ACT 06 // HARDWARE TEE & THE COST OF FREEDOM"
      subTag={
        phase === "danger"
          ? "MALWARE ESCALATION · SANDBOX COLLAPSE"
          : phase === "war"
            ? "PLAY INTEGRITY VS STEALTH MODULES"
            : "ARM TRUSTZONE · HARDWARE ISOLATION"
      }
      plateOpacity={0.40}
      plateBlur={2.2}
      shake={phase === "tee" ? wallHit * 7 : dShake}
    >
      {/* PHASE 1: ARM TrustZone Dual-World Hardware Wall */}
      {phase === "tee" && (
        <>
          <div style={{ position: "absolute", top: 90, left: 120 }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.gold, letterSpacing: "0.24em", fontWeight: 800 }}>
              ARM TRUSTZONE HARDWARE SPLIT
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              芯片级硬件保险箱 TEE：连 Root 内核都无法踏入半步
            </div>
          </div>

          {/* Left World: Normal World (Android + Linux Kernel + Root) */}
          <HardwareModule x={120} y={245} w={745} h={625} accent={C.cyan} glow={0.5}>
            <div style={{ padding: "32px 36px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.cyan, fontWeight: 800, letterSpacing: "0.2em" }}>
                  NORMAL WORLD · 非安全世界
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginTop: 8 }}>Android &amp; Linux 内核</div>
                <div style={{ fontSize: 17, color: C.muted, marginTop: 8 }}>
                  即便你已经拿到最高权限 Root（uid=0），活动范围也永远止步于硬件总线墙左侧。
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ padding: "20px 24px", borderRadius: 14, background: hexRgba(C.cyan, 0.12), border: `1px solid ${hexRgba(C.cyan, 0.4)}` }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>用户空间 App / Magisk</div>
                  <div style={{ fontFamily: "monospace", fontSize: 14, color: C.cyan, marginTop: 4 }}>RING 3 · USER SPACE</div>
                </div>
                <div style={{ padding: "22px 24px", borderRadius: 14, background: hexRgba(C.emerald, 0.18), border: `2px solid ${C.emerald}` }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: "#fff" }}>Linux Kernel + ROOT (uid=0)</div>
                  <div style={{ fontFamily: "monospace", fontSize: 14, color: C.emerald, marginTop: 4 }}>RING 0 · 尝试探测硬件密钥 → 被芯片总线弹回!</div>
                </div>
              </div>

              <div style={{ fontFamily: "monospace", fontSize: 15, color: C.crimson, fontWeight: 800 }}>
                STATUS: ROOT ACCESS DENIED BY SILICON BUS WALL
              </div>
            </div>
          </HardwareModule>

          {/* Center Impenetrable Golden Silicon Hardware Wall + Bouncing Root Probe */}
          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 6 }}>
            <rect x="935" y="230" width="50" height="655" rx="10" fill="rgba(72, 46, 8, 0.94)" stroke={C.gold} strokeWidth={3 + wallHit * 4} />
            <text x="960" y="560" textAnchor="middle" fill={C.gold} fontFamily="monospace" fontSize="16" fontWeight="900" transform="rotate(-90 960 560)">
              HARDWARE BUS ISOLATION WALL
            </text>
            {/* Root probe ray firing from Linux Kernel + ROOT (uid=0) at y=675 straight into TrustZone Wall & bouncing off! */}
            <line x1="825" y1="675" x2={Math.max(825, beamX)} y2="675" stroke={beamCycle >= 36 ? C.crimson : C.emerald} strokeWidth="6" strokeLinecap="round" />
            <circle cx={Math.max(825, beamX)} cy="675" r="12" fill="#ffffff" />
            {wallHit > 0.05 && (
              <circle cx="935" cy="675" r={18 + (1 - wallHit) * 76} fill="none" stroke={C.gold} strokeWidth="4.5" strokeOpacity={wallHit} />
            )}
          </svg>

          {/* Right World: Secure World (TEE Hardware Vault + eFuse Register) */}
          <HardwareModule
            x={1055}
            y={245}
            w={745}
            h={625}
            accent={C.gold}
            glow={0.95}
            style={{
              background: "linear-gradient(155deg, rgba(64, 42, 6, 0.88), rgba(14, 10, 4, 0.96))",
            }}
          >
            <div style={{ padding: "32px 36px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.gold, fontWeight: 800, letterSpacing: "0.2em" }}>
                  SECURE WORLD · 独立安全世界
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginTop: 8 }}>可信执行环境（TEE / StrongBox）</div>
                <div style={{ fontSize: 17, color: "#fde68a", marginTop: 8 }}>
                  芯片物理隔离的独立加密保险箱，持有只读硬件证书，独立校验设备是否被解锁。
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { name: "指纹 / 人脸模板", tag: "BIOMETRIC KEY" },
                  { name: "NFC / 支付私钥", tag: "PAYMENT SIGN" },
                  { name: "DRM 高清密钥", tag: "WIDEVINE L1" },
                  { name: "硬件证明证书", tag: "KEYBOX ATTEST" },
                ].map((v, k) => (
                  <div key={k} style={{ padding: "18px 20px", borderRadius: 14, background: "rgba(10, 8, 4, 0.82)", border: `1px solid ${hexRgba(C.gold, 0.5)}` }}>
                    <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{v.name}</div>
                    <div style={{ fontFamily: "monospace", fontSize: 12, color: C.gold, marginTop: 5 }}>{v.tag}</div>
                  </div>
                ))}
              </div>

              {/* Hardware eFuse / VerifiedBootState indicator */}
              <div
                style={{
                  padding: "16px 22px",
                  borderRadius: 12,
                  background: fuseSnapped ? hexRgba(C.crimson, 0.22) : hexRgba(C.emerald, 0.16),
                  border: `1.5px solid ${fuseSnapped ? C.crimson : C.emerald}`,
                  fontFamily: "monospace",
                  fontSize: 16,
                  fontWeight: 900,
                  color: fuseSnapped ? "#fda4af" : C.emerald,
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <span>HARDWARE BOOT STATE:</span>
                <span>{fuseSnapped ? "⚡ UNLOCKED (FLAG RECORDED)" : "LOCKED (GREEN)"}</span>
              </div>
            </div>
          </HardwareModule>
        </>
      )}

      {/* PHASE 2: Play Integrity 3-Tier Check vs Stealth Modules Cat-and-Mouse */}
      {phase === "war" && (
        <>
          <div style={{ position: "absolute", top: 90, left: 120 }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.crimson, letterSpacing: "0.24em", fontWeight: 800 }}>
              ENDLESS CAT-AND-MOUSE WAR
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              金融硬件风控 vs 极客隐藏模块：永无止境的猫鼠大战
            </div>
          </div>

          <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
            <DataConduit d="M 855 445 L 1065 445" color={C.crimson} width={4} packets={3} speed={0.028} />
            <DataConduit d="M 1065 595 L 855 595" color={C.cyan} width={4} packets={3} speed={0.028} />
          </svg>

          {/* Left: Banking & Play Integrity 3-Tier Verification */}
          <HardwareModule x={120} y={245} w={735} h={625} accent={C.crimson} glow={0.85}>
            <div style={{ padding: "32px 36px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.crimson, fontWeight: 800, letterSpacing: "0.2em" }}>
                  DEFENSE // HARDWARE ATTESTATION
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginTop: 8 }}>银行 / 支付风控三级校验</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { tier: "TIER 1 · BASIC INTEGRITY", desc: "基础软件环境与常见 Root 特征扫描", pass: true },
                  { tier: "TIER 2 · DEVICE INTEGRITY", desc: "系统镜像指纹与官方认证设备匹配", pass: true },
                  { tier: "TIER 3 · STRONG INTEGRITY", desc: "直接向芯片 TEE 索要硬件私钥签名证书", pass: false },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "20px 24px",
                      borderRadius: 14,
                      background: row.pass ? "rgba(10, 26, 36, 0.86)" : "rgba(62, 8, 22, 0.88)",
                      border: `1.5px solid ${row.pass ? C.emerald : C.crimson}`,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 900, color: row.pass ? C.emerald : C.crimson }}>{row.tier}</div>
                      <div style={{ fontSize: 16, color: "#cbd5e1", marginTop: 5 }}>{row.desc}</div>
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 16, fontWeight: 900, color: row.pass ? C.emerald : "#fff", padding: "6px 14px", borderRadius: 8, background: row.pass ? hexRgba(C.emerald, 0.16) : C.crimson }}>
                      {row.pass ? "PASS ✓" : "FAIL ✗"}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: "monospace", fontSize: 15, color: "#fda4af" }}>
                ⚠ 触发风控后果：指纹支付失效 / 银行闪退 / 游戏反作弊封号
              </div>
            </div>
          </HardwareModule>

          {/* Right: Geek Stealth & Counter-Detection Arsenal */}
          <HardwareModule x={1065} y={245} w={735} h={625} accent={C.cyan} glow={0.75}>
            <div style={{ padding: "32px 36px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 15, color: C.cyan, fontWeight: 800, letterSpacing: "0.2em" }}>
                  OFFENSE // STEALTH &amp; CLOAKING
                </div>
                <div style={{ fontSize: 34, fontWeight: 900, color: "#fff", marginTop: 8 }}>极客反检测与隐藏工具链</div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                {[
                  { name: "Zygisk + DenyList / Shamiko", desc: "向银行 App 隐藏挂载表、进程注入与异常内存映射" },
                  { name: "KernelSU / SUSFS 内核级隐身", desc: "在 Linux 内核层直接过滤 /proc 探测路径，消除用户态痕迹" },
                  { name: "硬件证明证书对抗（Keybox）", desc: "风控持续拉黑泄露证书，每逢更新全网极客连夜追补丁" },
                ].map((item, i) => (
                  <div
                    key={i}
                    style={{
                      padding: "20px 24px",
                      borderRadius: 14,
                      background: "rgba(6, 22, 38, 0.88)",
                      border: `1.5px solid ${hexRgba(C.cyan, 0.45)}`,
                    }}
                  >
                    <div style={{ fontSize: 22, fontWeight: 900, color: C.cyan }}>{item.name}</div>
                    <div style={{ fontSize: 16, color: "#cbd5e1", marginTop: 6 }}>{item.desc}</div>
                  </div>
                ))}
              </div>

              <div style={{ fontFamily: "monospace", fontSize: 15, color: C.gold, fontWeight: 800 }}>
                循环现状：风控升级 → 隐藏失效 → 社区更新补丁 → 再次升级...
              </div>
            </div>
          </HardwareModule>
        </>
      )}

      {/* PHASE 3: Malware Root Grant -> Sandbox Collapse -> Privacy Theft & Brick */}
      {phase === "danger" && (
        <>
          <div style={{ position: "absolute", top: 90, left: 120 }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.crimson, letterSpacing: "0.24em", fontWeight: 800 }}>
              CRITICAL SECURITY HAZARD // ZERO SANDBOX
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              误授恶意软件 Root：沙盒护城河瞬间瓦解
            </div>
          </div>

          {/* Left: Dangerous Root Authorization Prompt */}
          <HardwareModule x={120} y={245} w={500} h={625} accent={C.crimson} glow={0.9}>
            <div style={{ padding: "32px 32px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontFamily: "monospace", fontSize: 14, color: C.crimson, fontWeight: 800 }}>SUPERUSER REQUEST</div>
                <div style={{ fontSize: 30, fontWeight: 900, color: "#fff", marginTop: 10 }}>
                  「免费破解工具.apk」
                  <br />
                  正在请求超级用户权限
                </div>
                <div style={{ fontSize: 16, color: "#fda4af", marginTop: 14, lineHeight: 1.6 }}>
                  授予 UID = 0 后，该软件将绕过 Android 全部沙盒与 SELinux 防护。
                </div>
              </div>

              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ flex: 1, padding: "16px 0", textAlign: "center", borderRadius: 12, background: "rgba(30,41,59,0.8)", color: C.muted, fontSize: 20, fontWeight: 800 }}>
                  拒绝
                </div>
                <div
                  style={{
                    flex: 1,
                    padding: "16px 0",
                    textAlign: "center",
                    borderRadius: 12,
                    background: tapped ? C.crimson : hexRgba(C.crimson, 0.25),
                    border: `2px solid ${C.crimson}`,
                    color: "#fff",
                    fontSize: 20,
                    fontWeight: 900,
                    boxShadow: tapped ? `0 0 32px ${C.crimson}` : "none",
                  }}
                >
                  {tapped ? "已误点允许!" : "允许"}
                </div>
              </div>

              <div style={{ fontFamily: "monospace", fontSize: 14, color: tapped ? C.crimson : C.muted }}>
                {tapped ? "⚠ SANDBOX BREACHED · UID=0 HIJACKED" : "Waiting for user decision..."}
              </div>
            </div>
          </HardwareModule>

          {/* Animated red breach lightning conduits */}
          {tapped && (
            <svg width="1920" height="1080" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
              <DataConduit d="M 620 450 C 780 450, 780 390, 940 390" color={C.crimson} width={5} packets={4} speed={0.036} opacity={shatterP} />
              <DataConduit d="M 620 580 C 780 580, 780 710, 940 710" color={C.crimson} width={5} packets={4} speed={0.036} opacity={shatterP} />
            </svg>
          )}

          {/* Right Top: Privacy Exfiltration */}
          <HardwareModule x={940} y={245} w={860} h={285} accent={tapped ? C.crimson : C.muted} glow={tapped ? 0.95 : 0.2}>
            <div style={{ padding: "30px 36px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: C.crimson, fontWeight: 800 }}>CONSEQUENCE 01 // PRIVACY EXPOSED</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginTop: 8 }}>隐私裸奔：跨软件直接窃取全部数据</div>
              <div style={{ marginTop: 18, padding: "14px 18px", borderRadius: 10, background: "rgba(3,6,15,0.85)", fontFamily: "monospace", fontSize: 15, color: "#fda4af", lineHeight: 1.7 }}>
                <div># tar -czf steal.tar /data/data/com.bank /data/data/com.wechat</div>
                <div>→ 跳过一切弹窗授权，静默打包验证码、聊天记录与登录会话</div>
              </div>
            </div>
          </HardwareModule>

          {/* Right Bottom: Brick / Bootloop Screen */}
          <HardwareModule x={940} y={565} w={860} h={305} accent={tapped ? C.crimson : C.muted} glow={tapped ? 0.95 : 0.2}>
            <div style={{ padding: "30px 36px" }}>
              <div style={{ fontFamily: "monospace", fontSize: 14, color: C.crimson, fontWeight: 800 }}>CONSEQUENCE 02 // SYSTEM BRICK</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#fff", marginTop: 8 }}>误删关键分区：手机变砖 / 无限重启</div>
              <div style={{ marginTop: 18, padding: "18px 22px", borderRadius: 12, background: "#140409", border: `1.5px solid ${C.crimson}`, fontFamily: "monospace", fontSize: 16, color: "#fff", lineHeight: 1.65 }}>
                <div style={{ color: C.crimson, fontWeight: 900 }}>⚠ Your device is corrupt. It can&apos;t be trusted</div>
                <div style={{ color: "#fda4af", fontSize: 14, marginTop: 4 }}>
                  /dev/block/by-name/boot or persist damaged → BOOTLOOP（需拆机 9008 救砖）
                </div>
              </div>
            </div>
          </HardwareModule>
        </>
      )}
    </TechStage>
  );
};

/* ============================================================================
 * ACT 7: FINALE — 2012 -> 2018 -> 2026 Animated Industry Trend Graph ->
 *                 Bookend Photorealistic Titanium Smartphone Closing Card
 * ============================================================================ */
export const FinaleAct: React.FC<{ scene: SceneTiming }> = ({ scene }) => {
  const frame = useCurrentFrame();
  const cClose = getCue(scene.cues, "closingKey");
  const isClose = frame >= cClose.from;
  const accent = isClose ? C.cyan : C.emerald;

  const curveP = easeOutCubic(Math.min(1, frame / 170));
  const closeLocal = Math.max(0, frame - cClose.from);
  const titleOp = interpolate(closeLocal, [22, 48], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <TechStage
      plate={isClose ? "shot01_desk_phone.jpg" : "shot05_root_throne.jpg"}
      accent={accent}
      tag="ACT 07 // POWER & BOUNDARY"
      subTag={isClose ? "KNOW THE CORE · OWN YOUR MACHINE" : "ROOT EVOLUTION · 2012 TO 2026"}
      plateOpacity={isClose ? 0.76 : 0.36}
      plateBlur={isClose ? 0 : 2.5}
      cameraZoom={isClose ? interpolate(closeLocal, [0, 420], [1.12, 1.0], { extrapolateRight: "clamp" }) : 1.0}
    >
      {/* CUE 1: Animated Dual-Curve Evolution Chart (2012 -> 2018 -> 2026) */}
      {!isClose && (
        <>
          <div style={{ position: "absolute", top: 90, left: 120 }}>
            <div style={{ fontFamily: "monospace", fontSize: 16, color: C.emerald, letterSpacing: "0.24em", fontWeight: 800 }}>
              14 YEARS OF ANDROID EVOLUTION
            </div>
            <div style={{ fontSize: 44, fontWeight: 900, color: "#fff", marginTop: 6 }}>
              为什么今天大多数普通人，早已不必折腾 Root？
            </div>
          </div>

          {/* Trend Curves SVG */}
          <HardwareModule x={120} y={230} w={1680} h={350} accent={C.cyan} glow={0.45}>
            <svg width="1680" height="350" style={{ position: "absolute", inset: 0 }}>
              {[70, 145, 220, 295].map((y, i) => (
                <line key={i} x1="70" y1={y} x2="1610" y2={y} stroke="rgba(148,163,184,0.12)" strokeWidth="1.5" />
              ))}
              {/* Rising Curve 1: Native OS Maturity */}
              <path
                d="M 100 285 C 520 260, 960 140, 1580 72"
                fill="none"
                stroke={C.emerald}
                strokeWidth="5"
                strokeDasharray="1600"
                strokeDashoffset={1600 * (1 - curveP)}
              />
              {/* Rising Curve 2: Hardware Lock & Attestation Strictness */}
              <path
                d="M 100 300 C 580 288, 1020 200, 1580 96"
                fill="none"
                stroke={C.crimson}
                strokeWidth="4.5"
                strokeDasharray="1600"
                strokeDashoffset={1600 * (1 - curveP)}
              />
              {/* Falling Curve 3: Everyday User Need for Root */}
              <path
                d="M 100 84 C 540 110, 980 225, 1580 296"
                fill="none"
                stroke={C.gold}
                strokeWidth="4.5"
                strokeDasharray="1600"
                strokeDashoffset={1600 * (1 - curveP)}
              />
              <text x="1280" y="64" fill={C.emerald} fontSize="18" fontWeight="800">↑ 原生系统成熟度与流畅度</text>
              <text x="1280" y="136" fill={C.crimson} fontSize="18" fontWeight="800">↑ 厂商硬件锁与风控严格度</text>
              <text x="1280" y="284" fill={C.gold} fontSize="18" fontWeight="800">↓ 普通用户折腾 Root 的刚需</text>
            </svg>
          </HardwareModule>

          {/* 3 Era Milestone Cards */}
          {[
            { x: 120, year: "2012", title: "一键 Root 救卡顿", desc: "早期安卓简陋卡顿、权限失控，Root 几乎是装机必备的救命稻草。", col: C.gold },
            { x: 694, year: "2018", title: "Magisk 黄金时代", desc: "Systemless 无系统修改 + 模块生态大爆发，极客玩机达到巅峰。", col: C.cyan },
            { x: 1268, year: "2026", title: "硬件锁全面收紧", desc: "原生体验完善，解锁门槛与风控拉满，Root 回归开发者与安全研究。", col: C.emerald },
          ].map((e, idx) => (
            <HardwareModule key={idx} x={e.x} y={615} w={532} h={265} accent={e.col} glow={0.55} delay={idx * 8}>
              <div style={{ padding: "26px 32px" }}>
                <div style={{ fontFamily: "monospace", fontSize: 32, fontWeight: 900, color: e.col }}>{e.year}</div>
                <div style={{ fontSize: 28, fontWeight: 900, color: "#fff", marginTop: 8 }}>{e.title}</div>
                <div style={{ fontSize: 17, color: "#cbd5e1", marginTop: 14, lineHeight: 1.65 }}>{e.desc}</div>
              </div>
            </HardwareModule>
          ))}
        </>
      )}

      {/* CUE 2: Serene Bookend Closing Card over Photorealistic Titanium Phone */}
      {isClose && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 60,
            opacity: titleOp,
            pointerEvents: "none",
          }}
        >
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "0.38em",
              color: C.cyan,
              textShadow: `0 0 22px ${C.cyan}`,
            }}
          >
            UID = 0  ·  KNOWLEDGE  ·  POWER  ·  BOUNDARY
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              color: "#ffffff",
              marginTop: 18,
              letterSpacing: "0.1em",
              textShadow: `0 0 48px ${hexRgba(C.cyan, 0.72)}, 0 12px 36px rgba(0,0,0,0.98)`,
              textAlign: "center",
            }}
          >
            看懂底层 · 才算真正拥有
          </div>
          <div
            style={{
              width: 560,
              height: 3,
              marginTop: 22,
              background: `linear-gradient(90deg, transparent, ${C.cyan}, #ffffff, ${C.emerald}, transparent)`,
              boxShadow: `0 0 26px ${C.cyan}`,
            }}
          />
        </div>
      )}
    </TechStage>
  );
};
