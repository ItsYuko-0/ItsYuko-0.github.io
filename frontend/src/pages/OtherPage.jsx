import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff } from "lucide-react";
import { getCharacterColor } from "../utils/characterColors";

const OtherPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [dialogue, setDialogue] = useState([]);
  const [loading, setLoading] = useState(false);

  const correctPassword = "staidans";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError("");
      loadDialogue();
    } else {
      setError("密码错误");
    }
  };

  const loadDialogue = async () => {
    setLoading(true);
    try {
      const res = await fetch("/data/extra_dialogue.json");
      const data = await res.json();
      setDialogue(data);
    } catch (err) {
      console.error("Failed to load dialogue:", err);
    }
    setLoading(false);
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[calc(100vh-65px)] flex items-center justify-center px-6"
      >
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#F4F4F5] rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[#52525B]" size={28} />
            </div>
            <h1 className="font-serif text-2xl text-[#1A1A1A] mb-2">需要密码</h1>
            <p className="text-[#52525B] text-sm">请输入密码以访问此页面</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="输入密码..."
                className="w-full px-4 py-3 border border-[#E4E4E7] rounded-lg focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 transition-all"
                data-testid="password-input"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A1A1AA] hover:text-[#52525B]"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8] transition-colors font-medium"
              data-testid="submit-password"
            >
              进入
            </button>
          </form>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="min-h-[calc(100vh-65px)] px-6 md:px-12 lg:px-24 py-12"
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#1A1A1A] tracking-tight leading-tight">
            我艹了这也太尬了我求你了我真服了
          </h1>
          <p className="text-[#A1A1AA] mt-4 text-sm">
            {dialogue.length} 条消息
          </p>
        </header>

        {/* Dialogue */}
        {loading ? (
          <div className="text-center text-[#A1A1AA]">加载中...</div>
        ) : (
          <div className="space-y-4">
            {dialogue.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(index * 0.005, 1) }}
                className="group"
              >
                <div className="flex items-start gap-3">
                  <span
                    className="font-semibold text-sm shrink-0 min-w-[60px]"
                    style={{ color: getCharacterColor(msg.character) }}
                  >
                    {msg.character.replace("឵", "")}
                  </span>
                  <p className="text-[#1A1A1A] leading-relaxed flex-1">
                    {msg.content}
                  </p>
                </div>
                <div className="text-xs text-[#A1A1AA] mt-1 ml-[72px] opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatTime(msg.timestamp)} · {msg.channel}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OtherPage;
