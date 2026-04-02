import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X } from "lucide-react";

const CharacterSidebar = ({ 
  characters, 
  scenes, 
  selectedCharacter, 
  onSelectCharacter,
  onScrollToScene 
}) => {
  // Get character's scenes
  const characterScenes = useMemo(() => {
    if (!selectedCharacter || !scenes.length) return [];
    const char = characters.find((c) => c.name === selectedCharacter);
    if (!char) return [];
    return scenes.filter((scene) => char.scene_ids.includes(scene.id));
  }, [selectedCharacter, characters, scenes]);

  // Top 20 characters by message count
  const topCharacters = useMemo(() => {
    return characters.slice(0, 20);
  }, [characters]);

  return (
    <div className="space-y-6">
      {/* Character List Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-xs tracking-[0.2em] uppercase text-[#2563EB] font-semibold">
          角色筛选
        </h3>
        {selectedCharacter && (
          <button
            onClick={() => onSelectCharacter(null)}
            className="text-xs text-[#52525B] hover:text-[#1A1A1A] flex items-center gap-1 transition-colors"
            data-testid="clear-character-filter"
          >
            <X size={12} />
            清除
          </button>
        )}
      </div>

      {/* Character List - Native scrollable div */}
      <div 
        className="h-[280px] overflow-y-auto pr-2 scrollbar-thin"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E4E7 transparent' }}
      >
        <div className="space-y-1">
          {topCharacters.map((char, index) => (
            <motion.button
              key={char.name}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              onClick={() => onSelectCharacter(char.name === selectedCharacter ? null : char.name)}
              className={`character-item w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between group ${
                char.name === selectedCharacter
                  ? "active bg-[#DBEAFE] text-[#2563EB]"
                  : "hover:bg-[#F4F4F5]"
              }`}
              data-testid={`character-filter-${char.name}`}
            >
              <div className="flex items-center gap-2">
                <User size={14} />
                <span className="font-medium text-sm truncate max-w-[140px]">
                  {char.name}
                </span>
              </div>
              <span className="text-xs text-[#A1A1AA] group-hover:text-[#52525B]">
                {char.scene_count}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Selected Character Timeline */}
      <AnimatePresence>
        {selectedCharacter && characterScenes.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-[#E4E4E7] pt-6"
          >
            <h4 className="text-xs tracking-[0.2em] uppercase text-[#52525B] font-semibold mb-4">
              {selectedCharacter} 的故事线
            </h4>
            <div 
              className="h-[200px] overflow-y-auto pr-2"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E4E7 transparent' }}
            >
              <div className="timeline-path">
                {characterScenes.slice(0, 30).map((scene, index) => (
                  <motion.button
                    key={scene.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.03 }}
                    onClick={() => onScrollToScene(scene.id)}
                    className="timeline-node w-full text-left hover:text-[#2563EB] transition-colors"
                    data-testid={`timeline-scene-${scene.id}`}
                  >
                    <div className="text-xs text-[#A1A1AA] mb-0.5">
                      {scene.start_time}
                    </div>
                    <div className="text-sm font-medium line-clamp-1">
                      {scene.title}
                    </div>
                  </motion.button>
                ))}
                {characterScenes.length > 30 && (
                  <div className="pl-6 text-xs text-[#A1A1AA] mt-2">
                    还有 {characterScenes.length - 30} 个场景...
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CharacterSidebar;
