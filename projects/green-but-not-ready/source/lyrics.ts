export interface LyricLine {
  from: number;
  to: number;
  text: string;
  highlight?: string;
}

export const FPS = 30;
export const TOTAL_FRAMES = 5115; // 170.50s — clean silence right after final 8-bit beat, before 171.16s watermark

/**
 * Exact frame-aligned lyric lines derived from faster-whisper-base word timestamps
 * on public/green-but-not-ready/external/audio/green-but-not-ready-song.mp3.
 */
export const LYRIC_LINES: LyricLine[] = [
  // Verse 1A (10.28s - 19.96s)
  { from: 308, to: 356, text: "早上十点问句话", highlight: "十点" },
  { from: 356, to: 437, text: "这版今天能发吗", highlight: "能发吗" },
  { from: 437, to: 511, text: "还没张口先叠甲", highlight: "先叠甲" },
  { from: 511, to: 599, text: "怕出问题实在怕", highlight: "实在怕" },

  // Verse 1B (19.96s - 29.66s)
  { from: 599, to: 661, text: "编译绿了别急夸", highlight: "别急夸" },
  { from: 661, to: 735, text: "能跑一样也会炸", highlight: "也会炸" },
  { from: 735, to: 812, text: "虽然日志正常呀", highlight: "虽然" },
  { from: 812, to: 890, text: "但是不能保证啦", highlight: "不能保证" },

  // Pre-Chorus (29.66s - 39.98s)
  { from: 890, to: 971, text: "通过不代表验收", highlight: "不代表验收" },
  { from: 971, to: 1049, text: "跑通不代表能走", highlight: "不代表能走" },
  { from: 1049, to: 1113, text: "测过不代表没漏", highlight: "不代表没漏" },
  { from: 1113, to: 1199, text: "把边界全部说透", highlight: "边界" },

  // Chorus 1 (39.98s - 62.50s)
  { from: 1199, to: 1265, text: "不是这个而是那呀", highlight: "不是…而是" },
  { from: 1265, to: 1351, text: "不能这样不代表啦", highlight: "不能不代表" },
  { from: 1351, to: 1421, text: "每句话都叠三层甲", highlight: "叠三层甲" },
  { from: 1421, to: 1502, text: "虽然但是绕圈说呀", highlight: "虽然但是" },
  { from: 1502, to: 1569, text: "结论藏进括号里啦", highlight: "括号里" },
  { from: 1569, to: 1651, text: "免责声明摞成高塔", highlight: "高塔" },
  { from: 1651, to: 1735, text: "我就想问行不行", highlight: "行不行" },
  { from: 1735, to: 1875, text: "未核实，不应假定！", highlight: "不应假定" },

  // Verse 2A (81.02s - 90.24s)
  { from: 2431, to: 2478, text: "下午改动本来少", highlight: "本来少" },
  { from: 2478, to: 2556, text: "它嫌护栏不够牢", highlight: "护栏" },
  { from: 2556, to: 2631, text: "判空校验全出招", highlight: "判空校验" },
  { from: 2631, to: 2707, text: "异常捕获层层套", highlight: "层层套" },

  // Verse 2B (90.24s - 100.44s)
  { from: 2707, to: 2788, text: "三行需求写到爆", highlight: "写到爆" },
  { from: 2788, to: 2860, text: "边界测试垒得高", highlight: "边界测试" },
  { from: 2860, to: 2937, text: "跑完绿灯满屏飘", highlight: "绿灯满屏飘" },
  { from: 2937, to: 3013, text: "冷静发来新警告", highlight: "新警告" },

  // Bridge (100.44s - 112.94s)
  { from: 3013, to: 3089, text: "模拟绿得像长城", highlight: "像长城" },
  { from: 3089, to: 3166, text: "不代表实车能成", highlight: "实车" },
  { from: 3166, to: 3241, text: "未测分支怕有坑", highlight: "怕有坑" },
  { from: 3241, to: 3388, text: "最后还得——我硬撑！", highlight: "我硬撑" },

  // Chorus 2 (112.94s - 135.92s)
  { from: 3388, to: 3470, text: "不是这个而是那呀", highlight: "不是…而是" },
  { from: 3470, to: 3548, text: "不能这样不代表啦", highlight: "不能不代表" },
  { from: 3548, to: 3620, text: "每句话都叠三层甲", highlight: "叠三层甲" },
  { from: 3620, to: 3700, text: "虽然但是绕圈说呀", highlight: "虽然但是" },
  { from: 3700, to: 3764, text: "结论藏进括号里啦", highlight: "括号里" },
  { from: 3764, to: 3843, text: "免责声明摞成高塔", highlight: "高塔" },
  { from: 3843, to: 3920, text: "我就想问行不行", highlight: "行不行" },
  { from: 3920, to: 4078, text: "未核实，不应假定！", highlight: "不应假定" },

  // Outro Vocal (135.92s - 147.50s)
  { from: 4078, to: 4144, text: "这首歌儿唱完啦", highlight: "唱完啦" },
  { from: 4144, to: 4224, text: "不代表能下班呀", highlight: "不代表能下班" },
  { from: 4224, to: 4304, text: "虽然绿灯亮着啦", highlight: "绿灯亮着" },
  { from: 4304, to: 4440, text: "上线前，请再查查～", highlight: "请再查查" },
];

export const SECTIONS = {
  intro: { from: 0, dur: 308 },
  verse1a: { from: 308, dur: 291 },
  verse1b: { from: 599, dur: 291 },
  preChorus: { from: 890, dur: 309 },
  chorus1: { from: 1199, dur: 676 },
  interlude: { from: 1875, dur: 556 },
  verse2a: { from: 2431, dur: 276 },
  verse2b: { from: 2707, dur: 306 },
  bridge: { from: 3013, dur: 375 },
  chorus2: { from: 3388, dur: 690 },
  outroVocal: { from: 4078, dur: 377 },
  curtainCall: { from: 4455, dur: 660 },
};
