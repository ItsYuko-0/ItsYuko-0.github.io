import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useCharacters, useScenes } from "../hooks/useData";
import { Loader2, MessageSquare, BookOpen, MapPin, Users, ArrowRight } from "lucide-react";

// Placeholder descriptions for characters
const characterDescriptions = {
  "I must learn English": "羽云，妖族的成员，经常出没于妖之殿堂。性格温和但偶尔神秘，与世界各地的居民都有交集。",
  "sasamiya my beloved": "精灵族的一员，常在精灵之殿活动。性格开朗，喜欢与人交流，但有时会突然消失。",
  "如果有人在群里说话我真的会来看的": "活跃于塔顶观测室的神秘角色，消息量巨大，似乎对世界的一切都充满好奇。",
  "艾麗塔": "常出现在霜雅地区的角色，与北雨关系密切，性格可能较为内敛但重感情。",
  "一直挂机的某人": "顾名思义，经常处于挂机状态的角色，但实际参与了大量场景。偏好雪堂茶馆和百花坛车站。",
  "克里托": "与闇关系密切的角色，活动范围广泛，从雪堂茶馆到黑色巢穴都有其踪迹。",
  "闇឵": "神秘的暗系角色，与克里托互动频繁。常出现在黑色巢穴和浣花溪小筑。",
  "北雨🍀": "与艾麗塔关系紧密的角色，主要活动在霜雅地区。",
  "永晞": "塞莱诺组织的成员，活跃于研究总部各处，似乎参与了重要的实验项目。",
  "墨凛": "精灵之殿的常客，与多位角色都有互动，性格可能较为多变。",
};

const CharacterPage = () => {
  const { characterName } = useParams();
  const navigate = useNavigate();
  const { characters, characterList, loading: charsLoading } = useCharacters();
  const { scenes, loading: scenesLoading } = useScenes();
  
  const [selectedCharacter, setSelectedCharacter] = useState(characterName || null);
  
  const loading = charsLoading || scenesLoading;

  // Get current character data
  const currentCharacter = useMemo(() => {
    if (!selectedCharacter || !characters[selectedCharacter]) return null;
    return {
      name: selectedCharacter,
      ...characters[selectedCharacter],
    };
  }, [selectedCharacter, characters]);

  // Get character's scenes
  const characterScenes = useMemo(() => {
    if (!currentCharacter) return [];
    return scenes.filter((scene) => currentCharacter.scene_ids?.includes(scene.id));
  }, [currentCharacter, scenes]);

  // Get top interactions
  const topInteractions = useMemo(() => {
    if (!currentCharacter?.interacts_with) return [];
    return Object.entries(currentCharacter.interacts_with)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [currentCharacter]);

  // Get top locations
  const topLocations = useMemo(() => {
    if (!currentCharacter?.top_locations) return [];
    return Object.entries(currentCharacter.top_locations)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [currentCharacter]);

  const handleSelectCharacter = (name) => {
    setSelectedCharacter(name);
    navigate(`/characters/${encodeURIComponent(name)}`, { replace: true });
  };

  const handleViewStoryline = () => {
    // Navigate to content page with character filter (via URL state)
    navigate(`/?character=${encodeURIComponent(selectedCharacter)}`);
  };

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
      className="px-6 md:px-12 lg:px-24 py-8 lg:py-12"
    >
      {/* Header */}
      <header className="mb-8">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] tracking-tight leading-tight">
          角色档案
        </h1>
        <p className="text-[#52525B] mt-3 text-base leading-relaxed max-w-2xl">
          月光之境中的所有角色。点击查看详细信息与故事线。
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16">
        {/* Character List - Left - Native scrollable */}
        <div className="col-span-1 lg:col-span-4">
          <div 
            className="h-[calc(100vh-220px)] overflow-y-auto pr-4"
            style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E4E7 transparent' }}
          >
            <div className="space-y-1">
              {characterList.map((char, index) => (
                <motion.button
                  key={char.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02 }}
                  onClick={() => handleSelectCharacter(char.name)}
                  className={`character-item w-full text-left px-4 py-3 rounded-lg transition-all group ${
                    char.name === selectedCharacter
                      ? "active bg-[#DBEAFE]"
                      : "hover:bg-[#F4F4F5]"
                  }`}
                  data-testid={`character-select-${char.name}`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-serif text-xl truncate ${
                        char.name === selectedCharacter
                          ? "text-[#2563EB]"
                          : "text-[#1A1A1A]"
                      }`}
                    >
                      {char.name}
                    </span>
                    <ArrowRight
                      size={16}
                      className={`transition-transform ${
                        char.name === selectedCharacter
                          ? "text-[#2563EB] translate-x-1"
                          : "text-[#A1A1AA] group-hover:translate-x-1"
                      }`}
                    />
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-[#52525B]">
                    <span className="flex items-center gap-1">
                      <MessageSquare size={12} />
                      {char.message_count}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen size={12} />
                      {char.scene_count}
                    </span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Character Details - Right */}
        <div className="col-span-1 lg:col-span-8 lg:sticky lg:top-24 lg:h-fit">
          <AnimatePresence mode="wait">
            {currentCharacter ? (
              <motion.div
                key={currentCharacter.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8"
              >
                {/* Character Name */}
                <div>
                  <div className="text-xs tracking-[0.2em] uppercase text-[#2563EB] font-semibold mb-2">
                    角色档案
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] tracking-tight">
                    {currentCharacter.name}
                  </h2>
                </div>

                {/* Description */}
                <div className="border-l-2 border-[#2563EB] pl-6">
                  <p className="text-[#52525B] leading-relaxed text-lg italic">
                    {characterDescriptions[currentCharacter.name] ||
                      "这个角色的故事等待被书写..."}
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  <div className="text-center sm:text-left">
                    <div className="text-xs tracking-[0.2em] uppercase text-[#A1A1AA] mb-1">
                      消息数
                    </div>
                    <div className="font-serif text-3xl text-[#1A1A1A]">
                      {currentCharacter.message_count.toLocaleString()}
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-xs tracking-[0.2em] uppercase text-[#A1A1AA] mb-1">
                      场景数
                    </div>
                    <div className="font-serif text-3xl text-[#1A1A1A]">
                      {currentCharacter.scene_count}
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-xs tracking-[0.2em] uppercase text-[#A1A1AA] mb-1">
                      互动角色
                    </div>
                    <div className="font-serif text-3xl text-[#1A1A1A]">
                      {Object.keys(currentCharacter.interacts_with || {}).length}
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className="text-xs tracking-[0.2em] uppercase text-[#A1A1AA] mb-1">
                      活动地点
                    </div>
                    <div className="font-serif text-3xl text-[#1A1A1A]">
                      {Object.keys(currentCharacter.top_locations || {}).length}
                    </div>
                  </div>
                </div>

                {/* Top Interactions & Locations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Top Interactions */}
                  <div>
                    <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#52525B] font-semibold mb-4">
                      <Users size={14} />
                      最多互动
                    </div>
                    <div className="space-y-2">
                      {topInteractions.map(([name, count]) => (
                        <div
                          key={name}
                          className="flex items-center justify-between py-2 border-b border-[#F4F4F5] last:border-0"
                        >
                          <button
                            onClick={() => handleSelectCharacter(name)}
                            className="text-[#1A1A1A] hover:text-[#2563EB] transition-colors text-sm truncate max-w-[150px]"
                          >
                            {name}
                          </button>
                          <span className="text-[#2563EB] text-sm">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Top Locations */}
                  <div>
                    <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#52525B] font-semibold mb-4">
                      <MapPin size={14} />
                      常去地点
                    </div>
                    <div className="space-y-2">
                      {topLocations.map(([location, count]) => (
                        <div
                          key={location}
                          className="flex items-center justify-between py-2 border-b border-[#F4F4F5] last:border-0"
                        >
                          <span className="text-[#1A1A1A] text-sm truncate max-w-[150px]">
                            {location}
                          </span>
                          <span className="text-[#52525B] text-sm">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* View Storyline Button */}
                <Link
                  to={`/?character=${encodeURIComponent(currentCharacter.name)}`}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1E40AF] transition-colors font-medium"
                  data-testid="view-storyline-btn"
                >
                  <BookOpen size={18} />
                  查看故事线
                  <ArrowRight size={16} />
                </Link>

                {/* Recent Scenes */}
                <div>
                  <div className="text-xs tracking-[0.2em] uppercase text-[#52525B] font-semibold mb-4">
                    最近场景
                  </div>
                  <div className="space-y-3">
                    {characterScenes.slice(0, 5).map((scene) => (
                      <Link
                        key={scene.id}
                        to={`/?scene=${scene.id}`}
                        className="block p-4 border border-[#E4E4E7] rounded-lg hover:border-[#2563EB] transition-colors"
                      >
                        <div className="font-serif text-[#1A1A1A] font-medium">
                          {scene.title}
                        </div>
                        <div className="text-sm text-[#52525B] mt-1 line-clamp-1">
                          {scene.summary}
                        </div>
                        <div className="text-xs text-[#A1A1AA] mt-2">
                          {scene.start_time}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center h-[50vh] text-[#A1A1AA]"
              >
                <div className="text-center">
                  <Users size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="text-lg">选择一个角色查看详情</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CharacterPage;
