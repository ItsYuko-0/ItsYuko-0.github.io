import { useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useScenes, useCharacters, useFuseSearch } from "../hooks/useData";
import SearchBar from "../components/SearchBar";
import CharacterSidebar from "../components/CharacterSidebar";
import SceneCard from "../components/SceneCard";
import { Loader2 } from "lucide-react";

const ContentPage = () => {
  const { scenes, loading: scenesLoading } = useScenes();
  const { characterList, loading: charsLoading } = useCharacters();
  const { search } = useFuseSearch(scenes);
  
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);
  
  const contentRef = useRef(null);

  // Handle search
  const handleSearch = useCallback(
    (query) => {
      const results = search(query);
      setSearchResults(results);
    },
    [search]
  );

  // Scroll to scene
  const handleScrollToScene = useCallback((sceneId) => {
    const element = document.getElementById(`scene-${sceneId}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  // Handle search result selection
  const handleSearchSelect = useCallback((scene) => {
    handleScrollToScene(scene.id);
  }, [handleScrollToScene]);

  // Reading progress
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setReadingProgress(Math.min(progress, 100));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Get character's scene IDs for filtering
  const characterSceneIds = selectedCharacter
    ? characterList.find((c) => c.name === selectedCharacter)?.scene_ids || []
    : [];

  const loading = scenesLoading || charsLoading;

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
    >
      {/* Reading Progress */}
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
        data-testid="reading-progress"
      />

      <div className="px-6 md:px-12 lg:px-24 py-12 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
          {/* Sidebar */}
          <aside className="col-span-1 lg:col-span-3">
            <div className="space-y-8">
              {/* Search */}
              <SearchBar
                onSearch={handleSearch}
                onSelect={handleSearchSelect}
                results={searchResults}
              />

              {/* Character Filter */}
              <CharacterSidebar
                characters={characterList}
                scenes={scenes}
                selectedCharacter={selectedCharacter}
                onSelectCharacter={setSelectedCharacter}
                onScrollToScene={handleScrollToScene}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main ref={contentRef} className="col-span-1 lg:col-span-9">
            {/* Header */}
            <header className="mb-16">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] tracking-tight leading-tight">
                故事正文
              </h1>
              <p className="text-[#52525B] mt-4 text-lg leading-relaxed max-w-2xl">
                月光之境的全部故事，按时间顺序排列。共 {scenes.length} 个场景。
                {selectedCharacter && (
                  <span className="text-[#2563EB]">
                    {" "}当前筛选：{selectedCharacter}
                  </span>
                )}
              </p>
            </header>

            {/* Scenes */}
            <div className="max-w-prose">
              {scenes.map((scene, index) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  index={index}
                  isFiltered={
                    selectedCharacter && !characterSceneIds.includes(scene.id)
                  }
                  highlightCharacter={selectedCharacter}
                />
              ))}
            </div>
          </main>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentPage;
