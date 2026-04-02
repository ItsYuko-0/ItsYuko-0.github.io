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
      const year = currentDate.getFullYear();
      
      // Track months for labels
      if (month !== lastMonth && currentWeek.length === 0) {
        months.push({ 
          week: weekIndex, 
          name: currentDate.toLocaleDateString("zh-CN", { month: "short" }),
          year: year
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
    if (messages === 0) return "bg-[#EBEDF0]";
    const ratio = messages / maxMessages;
    if (ratio < 0.2) return "bg-[#9BE9A8]";
    if (ratio < 0.4) return "bg-[#40C463]";
    if (ratio < 0.6) return "bg-[#30A14E]";
    if (ratio < 0.8) return "bg-[#216E39]";
    return "bg-[#0E4429]";
  };

  const dayLabels = ["日", "一", "二", "三", "四", "五", "六"];

  if (!weeks.length) {
    return <div className="text-[#A1A1AA]">加载中...</div>;
  }

  return (
    <div className="relative" data-testid="heatmap">
      {/* Scrollable container */}
      <div 
        className="overflow-x-auto pb-4"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E4E7 transparent' }}
      >
        <div className="inline-block min-w-max">
          {/* Month labels row */}
          <div className="flex ml-8 mb-1">
            {weeks.map((week, weekIndex) => {
              const monthInfo = months.find(m => m.week === weekIndex);
              return (
                <div 
                  key={weekIndex} 
                  className="w-[13px] text-xs text-[#A1A1AA] shrink-0"
                >
                  {monthInfo ? monthInfo.name : ''}
                </div>
              );
            })}
          </div>

          {/* Grid with day labels */}
          <div className="flex">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-2 shrink-0">
              {dayLabels.map((day, i) => (
                <div
                  key={day}
                  className="text-[10px] text-[#A1A1AA] h-[11px] leading-[11px] w-6 text-right pr-1"
                  style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayOfWeek) => {
                    const day = week.find(d => d.dayOfWeek === dayOfWeek);
                    if (!day) {
                      return (
                        <div 
                          key={dayOfWeek} 
                          className="w-[11px] h-[11px]" 
                        />
                      );
                    }
                    return (
                      <motion.div
                        key={day.date}
                        className={`w-[11px] h-[11px] rounded-sm cursor-pointer ${getColor(day.messages)}`}
                        onMouseEnter={() => setHoveredCell(day)}
                        onMouseLeave={() => setHoveredCell(null)}
                        whileHover={{ scale: 1.2 }}
                        data-testid={`heatmap-cell-${day.date}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tooltip */}
      {hoveredCell && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed bg-[#1A1A1A] text-white px-3 py-2 rounded text-xs whitespace-nowrap z-50 pointer-events-none"
          style={{
            left: '50%',
            bottom: '20px',
            transform: 'translateX(-50%)'
          }}
        >
          {hoveredCell.date}: {hoveredCell.messages} 条消息
        </motion.div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-end gap-2 mt-4 text-xs text-[#A1A1AA]">
        <span>少</span>
        <div className="flex gap-[2px]">
          <div className="w-[11px] h-[11px] rounded-sm bg-[#EBEDF0]" />
          <div className="w-[11px] h-[11px] rounded-sm bg-[#9BE9A8]" />
          <div className="w-[11px] h-[11px] rounded-sm bg-[#40C463]" />
          <div className="w-[11px] h-[11px] rounded-sm bg-[#30A14E]" />
          <div className="w-[11px] h-[11px] rounded-sm bg-[#0E4429]" />
        </div>
        <span>多</span>
      </div>
    </div>
  );
};

export default Heatmap;
