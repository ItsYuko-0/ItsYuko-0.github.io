import { motion } from "framer-motion";
import { useScenes, useCharacters, useInteractions, useTimeline, useStats } from "../hooks/useData";
import ForceGraph from "../components/ForceGraph";
import Heatmap from "../components/Heatmap";
import { Loader2, MessageSquare, BookOpen, Users, Calendar } from "lucide-react";

const DataPage = () => {
  const { scenes, loading: scenesLoading } = useScenes();
  const { characters, characterList, loading: charsLoading } = useCharacters();
  const { interactions, loading: interactionsLoading } = useInteractions();
  const { timeline, loading: timelineLoading } = useTimeline();
  
  const stats = useStats(scenes, characters, timeline);
  
  const loading = scenesLoading || charsLoading || interactionsLoading || timelineLoading;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-[#2563EB]" size={32} />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="px-6 md:px-12 lg:px-24 py-12 lg:py-24"
    >
      {/* Header */}
      <header className="mb-16">
        <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] tracking-tight leading-tight">
          数据总览
        </h1>
        <p className="text-[#52525B] mt-4 text-lg leading-relaxed max-w-2xl">
          月光之境的活动数据与可视化分析。
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-left"
          data-testid="stat-scenes"
        >
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#2563EB] font-semibold mb-2">
            <BookOpen size={14} />
            场景数
          </div>
          <div className="font-serif text-5xl md:text-6xl text-[#1A1A1A] stat-number">
            {stats.totalScenes}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-left"
          data-testid="stat-messages"
        >
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#2563EB] font-semibold mb-2">
            <MessageSquare size={14} />
            消息数
          </div>
          <div className="font-serif text-5xl md:text-6xl text-[#1A1A1A] stat-number">
            {stats.totalMessages.toLocaleString()}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-left"
          data-testid="stat-characters"
        >
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#2563EB] font-semibold mb-2">
            <Users size={14} />
            角色数
          </div>
          <div className="font-serif text-5xl md:text-6xl text-[#1A1A1A] stat-number">
            {stats.totalCharacters}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-left"
          data-testid="stat-days"
        >
          <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#2563EB] font-semibold mb-2">
            <Calendar size={14} />
            活跃天数
          </div>
          <div className="font-serif text-5xl md:text-6xl text-[#1A1A1A] stat-number">
            {stats.activeDays}
          </div>
        </motion.div>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Force Graph - Takes 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white rounded-lg p-8 border border-[#E4E4E7]"
          data-testid="force-graph-container"
        >
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">角色关系图</h2>
          <p className="text-sm text-[#52525B] mb-6">
            节点大小代表发言量，连线粗细代表共同出场次数。拖拽节点、滚轮缩放、点击聚焦。
          </p>
          <div className="relative">
            <ForceGraph interactions={interactions} characters={characters} />
          </div>
        </motion.div>

        {/* Character Ranking - 1 column, narrower */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-white rounded-lg p-6 border border-[#E4E4E7]"
          data-testid="character-ranking"
        >
          <h2 className="font-serif text-xl text-[#1A1A1A] mb-2">角色发言量排行</h2>
          <p className="text-sm text-[#52525B] mb-4">
            前 15 位角色
          </p>
          <div className="space-y-2">
            {characterList.slice(0, 15).map((char, index) => {
              const maxCount = characterList[0]?.message_count || 1;
              const percentage = (char.message_count / maxCount) * 100;
              
              return (
                <motion.div
                  key={char.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.03 }}
                  className="group"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-xs text-[#1A1A1A] truncate max-w-[140px] group-hover:text-[#2563EB] transition-colors">
                      {index + 1}. {char.name}
                    </span>
                    <span className="text-xs text-[#52525B]">
                      {char.message_count.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#F4F4F5] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.5 + index * 0.03, duration: 0.6 }}
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Timeline Heatmap - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-3 bg-white rounded-lg p-8 border border-[#E4E4E7]"
          data-testid="heatmap-container"
        >
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">活跃度时间线</h2>
          <p className="text-sm text-[#52525B] mb-6">
            每日消息数量热力图。从 {stats.dateRange.start} 到 {stats.dateRange.end}。
          </p>
          <Heatmap timeline={timeline} />
        </motion.div>

        {/* Top Locations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-white rounded-lg p-8 border border-[#E4E4E7]"
          data-testid="top-locations"
        >
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">热门地点</h2>
          <p className="text-sm text-[#52525B] mb-6">
            出现频率最高的场景地点。
          </p>
          <div className="space-y-2">
            {(() => {
              // Aggregate locations from all characters
              const locationCounts = {};
              characterList.forEach((char) => {
                if (char.top_locations) {
                  Object.entries(char.top_locations).forEach(([loc, count]) => {
                    locationCounts[loc] = (locationCounts[loc] || 0) + count;
                  });
                }
              });
              
              return Object.entries(locationCounts)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 10)
                .map(([location, count], index) => (
                  <motion.div
                    key={location}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 + index * 0.02 }}
                    className="flex items-center justify-between py-2 border-b border-[#F4F4F5] last:border-0"
                  >
                    <span className="text-[#1A1A1A] text-sm truncate max-w-[200px]">
                      {location}
                    </span>
                    <span className="text-[#2563EB] text-sm font-medium">
                      {count}
                    </span>
                  </motion.div>
                ));
            })()}
          </div>
        </motion.div>

        {/* Date Range Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-lg p-8 border border-[#E4E4E7]"
          data-testid="date-range"
        >
          <h2 className="font-serif text-2xl text-[#1A1A1A] mb-2">时间跨度</h2>
          <p className="text-sm text-[#52525B] mb-6">
            故事发生的时间范围。
          </p>
          <div className="space-y-4">
            <div>
              <div className="text-xs tracking-[0.2em] uppercase text-[#A1A1AA] mb-1">
                开始日期
              </div>
              <div className="font-serif text-2xl text-[#1A1A1A]">
                {stats.dateRange.start}
              </div>
            </div>
            <div>
              <div className="text-xs tracking-[0.2em] uppercase text-[#A1A1AA] mb-1">
                结束日期
              </div>
              <div className="font-serif text-2xl text-[#1A1A1A]">
                {stats.dateRange.end}
              </div>
            </div>
            <div className="pt-4 border-t border-[#E4E4E7]">
              <div className="text-xs tracking-[0.2em] uppercase text-[#A1A1AA] mb-1">
                平均每日消息
              </div>
              <div className="font-serif text-2xl text-[#2563EB]">
                {Math.round(stats.totalMessages / stats.activeDays)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DataPage;
