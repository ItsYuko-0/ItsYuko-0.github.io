import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, X } from "lucide-react";
import { getCharacterColor } from "../utils/characterColors";

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

  // All characters by message count
  const allCharacters = useMemo(() => {
    return characters;
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
          {allCharacters.map((char, index) => {
            const charColor = getCharacterColor(char.name);
            const isSelected = char.name === selectedCharacter;
            
            return (
              <motion.button
                key={char.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: Math.min(index * 0.01, 0.3) }}
                onClick={() => onSelectCharacter(isSelected ? null : char.name)}
                className={`character-item w-full text-left px-3 py-2 rounded-lg transition-all flex items-center justify-between group ${
                  isSelected ? "ring-1" : "hover:bg-[#F4F4F5]"
                }`}
                style={{
                  backgroundColor: isSelected ? `${charColor}15` : undefined,
                  ringColor: isSelected ? charColor : undefined,
                }}
                data-testid={`character-filter-${char.name}`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: charColor }}
                  />
                  <span 
                    className="font-medium text-sm truncate max-w-[140px]"
                    style={{ color: isSelected ? charColor : undefined }}
                  >
                    {char.name}
                  </span>
                </div>
                <span className="text-xs text-[#A1A1AA] group-hover:text-[#52525B]">
                  {char.scene_count}
                </span>
              </motion.button>
            );
          })}
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
            <h4 
              className="text-xs tracking-[0.2em] uppercase font-semibold mb-4"
              style={{ color: getCharacterColor(selectedCharacter) }}
            >
              {selectedCharacter} 的故事线 ({characterScenes.length})
            </h4>
            <div 
              className="h-[250px] overflow-y-auto pr-2"
              style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E4E7 transparent' }}
            >
              <div className="timeline-path">
                {characterScenes.map((scene, index) => (
                  <motion.button
                    key={scene.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(index * 0.01, 0.3) }}
                    onClick={() => onScrollToScene(scene.id)}
                    className="timeline-node w-full text-left transition-colors"
                    style={{ 
                      '--hover-color': getCharacterColor(selectedCharacter)
                    }}
                    data-testid={`timeline-scene-${scene.id}`}
                  >
                    <div className="text-xs text-[#A1A1AA] mb-0.5">
                      {scene.start_time}
                    </div>
                    <div 
                      className="text-sm font-medium line-clamp-1 hover:opacity-80"
                      style={{ color: getCharacterColor(selectedCharacter) }}
                    >
                      {scene.title}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CharacterSidebar;
