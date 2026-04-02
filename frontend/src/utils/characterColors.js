// Character color mapping
const characterColors = {
  "镜晨": "#2563EB", // 蓝色
  "孤月": "#DC2626", // 红色
  "羽云": "#7C3AED", // 紫色
  "涅索": "#06B6D4", // 浅蓝
  "闇": "#6B7280",   // 灰色
  "克里托": "#1F2937", // 黑色
  "咏希": "#CA8A04", // 淡黄色/金色
  // 其他角色的颜色
  "艾麗塔": "#EC4899", // 粉色
  "北雨🍀": "#10B981", // 绿色
  "永晞": "#F59E0B", // 橙色
  "墨凛": "#8B5CF6", // 浅紫
  "旁白": "#9CA3AF", // 浅灰
};

// 为未定义颜色的角色生成一致的颜色
const defaultColors = [
  "#0EA5E9", "#14B8A6", "#22C55E", "#84CC16", "#EAB308",
  "#F97316", "#EF4444", "#EC4899", "#D946EF", "#A855F7",
  "#6366F1", "#3B82F6", "#0891B2", "#059669", "#65A30D",
];

// 简单哈希函数为角色名生成一致的颜色索引
const hashString = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const getCharacterColor = (name) => {
  if (characterColors[name]) {
    return characterColors[name];
  }
  // 为未定义的角色分配一个固定颜色
  const index = hashString(name) % defaultColors.length;
  return defaultColors[index];
};

export default characterColors;
