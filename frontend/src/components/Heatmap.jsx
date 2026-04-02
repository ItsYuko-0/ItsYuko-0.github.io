import { useMemo, useState } from "react";
import { motion } from "framer-motion";

const Heatmap = ({ timeline }) => {
  const [hoveredCell, setHoveredCell] = useState(null);

  // Process timeline data into weeks
  const { weeks, maxMessages, months } = useMemo(() => {
    if (!timeline.length) return { weeks: [], maxMessages: 0, months: [] };

    // Sort by date
    const sorted = [...timeline].sort((a, b) => a.date.localeCompare(b.date));
    
    // Create a map for quick lookup
    const dateMap = new Map(sorted.map((d) => [d.date, d.messages]));
    
    // Get date range
    const startDate = new Date(sorted[0].date);
    const endDate = new Date(sorted[sorted.length - 1].date);
    
    // Adjust start to Sunday
    const adjustedStart = new Date(startDate);
    adjustedStart.setDate(adjustedStart.getDate() - adjustedStart.getDay());
    
    // Generate all weeks
    const weeks = [];
    const months = [];
    let currentDate = new Date(adjustedStart);
    let currentWeek = [];
    let lastMonth = -1;
    let weekIndex = 0;

    while (currentDate <= endDate || currentWeek.length > 0) {
      const dateStr = currentDate.toISOString().split("T")[0];
      const messages = dateMap.get(dateStr) || 0;
      const month = currentDate.getMonth();
      
      // Track months for labels
      if (month !== lastMonth && currentWeek.length === 0) {
        months.push({ 
          week: weekIndex, 
          name: currentDate.toLocaleDateString("zh-CN", { month: "short" }) 
        });
        lastMonth = month;
      }

      currentWeek.push({
        date: dateStr,
        messages,
        dayOfWeek: currentDate.getDay(),
      });

      if (currentDate.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
        weekIndex++;
      }

      currentDate.setDate(currentDate.getDate() + 1);
      
      if (currentDate > endDate && currentWeek.length === 0) break;
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    const maxMessages = Math.max(...timeline.map((d) => d.messages));

    return { weeks, maxMessages, months };
  }, [timeline]);

  // Get color intensity
  const getColor = (messages) => {
    if (messages === 0) return "bg-[#F4F4F5]";
    const ratio = messages / maxMessages;
    if (ratio < 0.2) return "bg-blue-100";
    if (ratio < 0.4) return "bg-blue-200";
    if (ratio < 0.6) return "bg-blue-400";
    if (ratio < 0.8) return "bg-blue-500";
    return "bg-blue-700";
  };

  const dayLabels = ["日", "一", "二", "三", "四", "五", "六"];

  if (!weeks.length) {
    return <div className="text-[#A1A1AA]">加载中...</div>;
  }

  return (
    <div className="relative" data-testid="heatmap">
      {/* Month labels */}
      <div className="flex gap-[3px] mb-2 ml-6">
        {months.map((m, i) => (
          <div
            key={i}
            className="text-xs text-[#A1A1AA]"
            style={{ 
              position: "absolute",
              left: `${m.week * 13 + 24}px`
            }}
          >
            {m.name}
          </div>
        ))}
      </div>

      <div className="flex gap-1 mt-6">
        {/* Day labels */}
        <div className="flex flex-col gap-[3px] mr-1">
          {dayLabels.map((day, i) => (
            <div
              key={day}
              className="text-[10px] text-[#A1A1AA] h-[10px] leading-[10px]"
              style={{ visibility: i % 2 === 0 ? "hidden" : "visible" }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="flex gap-[3px] overflow-x-auto pb-2">
          {weeks.map((week, weekIndex) => (
            <div key={weekIndex} className="flex flex-col gap-[3px]">
              {week.map((day, dayIndex) => (
                <motion.div
                  key={day.date}
                  className={`heatmap-cell w-[10px] h-[10px] rounded-sm cursor-pointer ${getColor(
                    day.messages
                  )}`}
                  onMouseEnter={() => setHoveredCell(day)}
                  onMouseLeave={() => setHoveredCell(null)}
                  whileHover={{ scale: 1.3 }}
                  data-testid={`heatmap-cell-${day.date}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1A1A1A] text-white px-3 py-2 rounded text-xs whitespace-nowrap z-10"
        >
          {hoveredCell.date}: {hoveredCell.messages} 条消息
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-1 mt-4 text-xs text-[#A1A1AA]">
        <span>少</span>
        <div className="w-[10px] h-[10px] rounded-sm bg-[#F4F4F5]" />
        <div className="w-[10px] h-[10px] rounded-sm bg-blue-100" />
        <div className="w-[10px] h-[10px] rounded-sm bg-blue-200" />
        <div className="w-[10px] h-[10px] rounded-sm bg-blue-400" />
        <div className="w-[10px] h-[10px] rounded-sm bg-blue-700" />
        <span>多</span>
      </div>
    </div>
  );
};

export default Heatmap;
