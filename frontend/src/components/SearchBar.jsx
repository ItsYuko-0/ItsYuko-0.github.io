import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const SearchBar = ({ onSearch, onSelect, results }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  const handleSearch = useCallback(
    (value) => {
      setQuery(value);
      onSearch(value);
      setIsOpen(value.length > 0);
    },
    [onSearch]
  );

  const handleSelect = (scene) => {
    onSelect(scene);
    setQuery("");
    setIsOpen(false);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("");
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <Search
          className="absolute left-0 top-1/2 -translate-y-1/2 text-[#52525B]"
          size={18}
        />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query && setIsOpen(true)}
          placeholder="搜索场景、角色、对话..."
          className="w-full bg-transparent border-b-2 border-[#E4E4E7] focus:border-[#2563EB] 
                     py-3 pl-8 pr-8 text-lg text-[#1A1A1A] placeholder:text-[#A1A1AA]
                     outline-none transition-colors"
          data-testid="search-input"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-0 top-1/2 -translate-y-1/2 text-[#52525B] hover:text-[#1A1A1A] transition-colors"
            data-testid="search-clear"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#E4E4E7] 
                       rounded-lg shadow-lg max-h-[400px] overflow-y-auto z-50"
            data-testid="search-results"
          >
            {results.map((result, index) => (
              <button
                key={result.item.id}
                onClick={() => handleSelect(result.item)}
                className="w-full px-4 py-3 text-left hover:bg-[#FAFAFA] transition-colors 
                           border-b border-[#E4E4E7] last:border-b-0"
                data-testid={`search-result-${index}`}
              >
                <div className="font-serif text-[#1A1A1A] font-medium">
                  {result.item.title}
                </div>
                <div className="text-sm text-[#52525B] mt-1 line-clamp-1">
                  {result.item.summary}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-[#A1A1AA]">
                    {result.item.start_time}
                  </span>
                  <span className="text-xs text-[#2563EB]">
                    {result.item.characters.slice(0, 3).join("、")}
                    {result.item.characters.length > 3 && "..."}
                  </span>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
