import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { BookOpen, BarChart3, Users } from "lucide-react";

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: "/", label: "正文", icon: BookOpen },
    { path: "/data", label: "数据", icon: BarChart3 },
    { path: "/characters", label: "角色", icon: Users },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAFA]/80 backdrop-blur-md border-b border-[#E4E4E7]">
      <nav className="px-6 md:px-12 lg:px-24 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <NavLink 
            to="/" 
            className="font-serif text-xl md:text-2xl tracking-tight text-[#1A1A1A] hover:text-[#2563EB] transition-colors"
            data-testid="logo-link"
          >
            月光之境档案馆
          </NavLink>
          
          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                (item.path === "/characters" && location.pathname.startsWith("/characters"));
              
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center gap-2 text-sm font-medium transition-colors ${
                    isActive ? "text-[#2563EB]" : "text-[#52525B] hover:text-[#1A1A1A]"
                  }`}
                  data-testid={`nav-${item.label}`}
                >
                  <Icon size={16} />
                  <span className="hidden sm:inline">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-[2px] left-0 right-0 h-[2px] bg-[#2563EB]"
                      layoutId="nav-indicator"
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navigation;
