import { useState, useCallback, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useScenes, useCharacters, useFuseSearch } from "../hooks/useData";
import SearchBar from "../components/SearchBar";
import CharacterSidebar from "../components/CharacterSidebar";
import SceneCard from "../components/SceneCard";
import { Loader2, BookOpen, MessageSquare } from "lucide-react";

const INITIAL_LOAD = 20;
const LOAD_MORE = 15;

const ContentPage = () => {
  const [searchParams] = useSearchParams();
  const { scenes, loading: scenesLoading } = useScenes();
  const { characterList, loading: charsLoading } = useCharacters();
  const { search } = useFuseSearch(scenes);
  
  // Initialize selected character from URL params
  const initialCharacter = searchParams.get("character");
  const [selectedCharacter, setSelectedCharacter] = useState(initialCharacter);
  const [searchResults, setSearchResults] = useState([]);
  const [readingProgress, setReadingProgress] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_LOAD);
  const [summaryMode, setSummaryMode] = useState(false);
  const [expandedSceneId, setExpandedSceneId] = useState(null);
  
  const contentRef = useRef(null);
  const loadMoreRef = useRef(null);

  // Update from URL params
  useEffect(() => {
    const charFromUrl = searchParams.get("character");
    if (charFromUrl) {
      setSelectedCharacter(decodeURIComponent(charFromUrl));
    }
  }, [searchParams]);

  // Infinite scroll - load more scenes
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && visibleCount < scenes.length) {
          setVisibleCount((prev) => Math.min(prev + LOAD_MORE, scenes.length));
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [visibleCount, scenes.length]);

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

  // Reading progress based on content scroll
  useEffect(() => {
    const handleScroll = () => {
      const contentArea = document.getElementById("content-scroll-area");
      if (!contentArea) return;
      const { scrollTop, scrollHeight, clientHeight } = contentArea;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
      setReadingProgress(Math.min(Math.max(progress, 0), 100));
    };

    const contentArea = document.getElementById("content-scroll-area");
    if (contentArea) {
      contentArea.addEventListener("scroll", handleScroll, { passive: true });
      return () => contentArea.removeEventListener("scroll", handleScroll);
    }
  }, [scenesLoading]);

  // Get character's scene IDs for filtering
  const characterSceneIds = selectedCharacter
    ? characterList.find((c) => c.name === selectedCharacter)?.scene_ids || []
    : [];

  const loading = scenesLoading || charsLoading;

  // Toggle expanded scene in summary mode
  const handleToggleExpand = (sceneId) => {
    setExpandedSceneId(expandedSceneId === sceneId ? null : sceneId);
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
      className="h-[calc(100vh-65px)] flex"
    >
      {/* Fixed Sidebar */}
      <aside 
        className="w-80 flex-shrink-0 border-r border-[#E4E4E7] bg-[#FAFAFA] p-6 overflow-y-auto"
        style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E4E7 transparent' }}
      >
        <div className="space-y-8">
          {/* Search */}
          <SearchBar
            onSearch={handleSearch}
            onSelect={handleSearchSelect}
            results={searchResults}
          />

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 p-1 bg-[#F4F4F5] rounded-lg">
            <button
              onClick={() => setSummaryMode(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                !summaryMode
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-[#52525B] hover:text-[#1A1A1A]"
              }`}
              data-testid="mode-full"
            >
              <MessageSquare size={14} />
              完整对话
            </button>
            <button
              onClick={() => setSummaryMode(true)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                summaryMode
                  ? "bg-white text-[#2563EB] shadow-sm"
                  : "text-[#52525B] hover:text-[#1A1A1A]"
              }`}
              data-testid="mode-summary"
            >
              <BookOpen size={14} />
              仅摘要
            </button>
          </div>

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

      {/* Main Content with Scroll */}
      <div className="flex-1 flex flex-col relative">
        {/* Vertical Progress Bar */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#E4E4E7] z-10">
          <div
            className="w-full bg-[#2563EB] transition-all duration-150"
            style={{ height: `${readingProgress}%` }}
            data-testid="reading-progress-bar"
          />
        </div>

        {/* Scrollable Content Area */}
        <div 
          id="content-scroll-area"
          className="flex-1 overflow-y-auto px-8 md:px-12 lg:px-16 py-12"
          style={{ scrollbarWidth: 'thin', scrollbarColor: '#E4E4E7 transparent' }}
        >
          <main ref={contentRef} className="max-w-3xl">
            {/* Header */}
            <header className="mb-16">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-[#1A1A1A] tracking-tight leading-tight">
                故事正文
              </h1>
              <p className="text-[#52525B] mt-4 text-lg leading-relaxed">
                月光之境的全部故事，按时间顺序排列。共 {scenes.length} 个场景。
                {selectedCharacter && (
                  <span className="text-[#2563EB]">
                    {" "}当前筛选：{selectedCharacter}
                  </span>
                )}
                {summaryMode && (
                  <span className="text-[#A1A1AA]">
                    {" "}· 摘要模式（点击展开对话）
                  </span>
                )}
              </p>
            </header>

            {/* Scenes */}
            <div>
              {scenes.slice(0, visibleCount).map((scene, index) => (
                <SceneCard
                  key={scene.id}
                  scene={scene}
                  index={index}
                  isFiltered={
                    selectedCharacter && !characterSceneIds.includes(scene.id)
                  }
                  highlightCharacter={selectedCharacter}
                  summaryMode={summaryMode}
                  isExpanded={expandedSceneId === scene.id}
                  onToggleExpand={() => handleToggleExpand(scene.id)}
                />
              ))}
              
              {/* Load more trigger */}
              {visibleCount < scenes.length && (
                <div 
                  ref={loadMoreRef} 
                  className="py-16 text-center text-[#A1A1AA]"
                  data-testid="load-more-trigger"
                >
                  <Loader2 className="animate-spin mx-auto mb-2" size={24} />
                  加载更多... ({visibleCount}/{scenes.length})
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Progress Indicator at Bottom */}
        <div className="h-10 border-t border-[#E4E4E7] bg-white flex items-center px-6 text-sm text-[#52525B]">
          <span>阅读进度：{Math.round(readingProgress)}%</span>
          <span className="mx-4">·</span>
          <span>已加载 {visibleCount} / {scenes.length} 场景</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ContentPage;
