import { memo, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, Users, ChevronDown, ChevronUp } from "lucide-react";

const SceneCard = memo(({ 
  scene, 
  index, 
  isFiltered, 
  highlightCharacter,
  summaryMode = false,
  isExpanded = false,
  onToggleExpand
}) => {
  // Group messages by location changes
  const groupedMessages = useMemo(() => {
    const groups = [];
    let currentLocation = null;
    let currentGroup = [];

    scene.messages.forEach((msg) => {
      if (msg.channel !== currentLocation) {
        if (currentGroup.length > 0) {
          groups.push({ location: currentLocation, messages: currentGroup });
        }
        currentLocation = msg.channel;
        currentGroup = [msg];
      } else {
        currentGroup.push(msg);
      }
    });

    if (currentGroup.length > 0) {
      groups.push({ location: currentLocation, messages: currentGroup });
    }

    return groups;
  }, [scene.messages]);

  const showDialogue = !summaryMode || isExpanded;

  return (
    <motion.article
      id={`scene-${scene.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.02, 0.5) }}
      className={`scene-card py-12 md:py-16 border-t border-[#E4E4E7] first:border-t-0 ${
        isFiltered ? "scene-faded" : "scene-active"
      }`}
      data-testid={`scene-card-${scene.id}`}
    >
      {/* Scene Header */}
      <header 
        className={`mb-6 ${summaryMode ? "cursor-pointer group" : ""}`}
        onClick={summaryMode ? onToggleExpand : undefined}
      >
        {/* Time */}
        <div className="flex items-center gap-2 text-xs text-[#A1A1AA] mb-3">
          <Clock size={12} />
          <time>{scene.start_time}</time>
          <span>—</span>
          <time>{scene.end_time}</time>
          {summaryMode && (
            <span className="ml-auto flex items-center gap-1 text-[#2563EB]">
              {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {isExpanded ? "收起" : "展开对话"}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className={`scene-title font-serif text-xl sm:text-2xl lg:text-3xl text-[#1A1A1A] tracking-tight leading-tight mb-3 ${
          summaryMode ? "group-hover:text-[#2563EB] transition-colors" : ""
        }`}>
          {scene.title}
        </h2>

        {/* Summary */}
        <p className="text-[#52525B] leading-relaxed text-base italic border-l-2 border-[#2563EB] pl-4">
          {scene.summary}
        </p>

        {/* Characters */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          <Users size={14} className="text-[#A1A1AA]" />
          {scene.characters.map((char) => (
            <span
              key={char}
              className={`text-sm px-2 py-0.5 rounded ${
                char === highlightCharacter
                  ? "bg-[#DBEAFE] text-[#2563EB] font-medium"
                  : "text-[#52525B]"
              }`}
            >
              {char}
            </span>
          ))}
          <span className="text-xs text-[#A1A1AA] ml-2">
            ({scene.messages.length} 条消息)
          </span>
        </div>
      </header>

      {/* Dialogue */}
      <AnimatePresence>
        {showDialogue && (
          <motion.div 
            initial={summaryMode ? { opacity: 0, height: 0 } : false}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 overflow-hidden"
          >
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex}>
                {/* Location Divider */}
                {(groupIndex > 0 || scene.locations.length > 1) && (
                  <div className="location-divider">
                    <span className="flex items-center gap-2">
                      <MapPin size={12} />
                      {group.location}
                    </span>
                  </div>
                )}

                {/* Messages */}
                <div className="space-y-3">
                  {group.messages.map((msg) => (
                    <div key={msg.id} className="group">
                      <div className="flex items-start gap-2">
                        <span
                          className={`dialogue-character font-sans font-medium text-sm shrink-0 ${
                            msg.character === highlightCharacter
                              ? "text-[#2563EB]"
                              : "text-[#52525B]"
                          }`}
                        >
                          {msg.character}
                        </span>
                        <span className="text-[#A1A1AA] text-sm">:</span>
                        <p className="text-[#1A1A1A] leading-relaxed flex-1">
                          {msg.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  );
});

SceneCard.displayName = "SceneCard";

export default SceneCard;
