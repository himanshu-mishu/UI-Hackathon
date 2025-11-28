import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { menuData } from './data';
import { ChevronRight, ChevronLeft, Package } from 'lucide-react';

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [history, setHistory] = useState(['main']);
  const [direction, setDirection] = useState(1);

  // time state
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const currentLevel = history[history.length - 1];

  const getCurrentMenu = () => {
    if (currentLevel === 'main') return menuData.main;

    let menu = menuData.main;
    for (let i = 1; i < history.length; i++) {
      const item = menu.find((m) => m.id === history[i]);
      if (item && item.submenu) menu = item.submenu;
    }
    return menu;
  };

  const handleItemClick = (item) => {
    if (item.hasSubmenu) {
      setDirection(1);
      setHistory([...history, item.id]);
    }
  };

  const handleBack = () => {
    if (history.length > 1) {
      setDirection(-1);
      setHistory(history.slice(0, -1));
    }
  };

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Phone-like background */}
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 to-gray-100 relative">
        {/* Status Bar */}
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
          <div className="flex items-center justify-between px-6 h-14 text-sm font-medium text-gray-800">
            <span className="text-base tabular-nums">
              {currentTime}
            </span>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              <div className="w-5 h-3 border-2 border-gray-800 rounded-sm relative">
                <div className="absolute inset-0.5 bg-gray-800 rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="min-h-[calc(100vh-3.5rem)] pb-20 flex flex-col">
          {/* Landing screen */}
          {!isOpen && (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome</h1>
                <p className="text-gray-600 text-lg">Explore our navigation menu</p>
              </div>
              <button
                onClick={() => setIsOpen(true)}
                className="px-8 py-4 bg-blue-600 text-white rounded-full font-semibold shadow-lg hover:bg-blue-700 active:scale-95 transition-all"
              >
                Open Menu
              </button>
            </div>
          )}

          {/* Drawer overlay (dark scrim behind drawer) */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.15 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-black"
                onClick={() => {
                  setIsOpen(false);
                  setHistory(['main']);
                }}
              />
            )}
          </AnimatePresence>

          {/* DRAGGABLE BOTTOM DRAWER */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] bg-white rounded-t-3xl shadow-2xl flex flex-col overflow-hidden"
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 120 || info.velocity.y > 700) {
                    setIsOpen(false);
                    setHistory(['main']);
                  }
                }}
              >
                {/* drag handle */}
                <div className="py-2 flex justify-center">
                  <div className="w-12 h-1.5 rounded-full bg-gray-400/80" />
                </div>

                {/* Back Button */}
                {history.length > 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="px-4 py-3 border-b border-gray-200 bg-white/60 backdrop-blur-sm"
                  >
                    <button
                      onClick={handleBack}
                      className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium active:scale-95 transition-all"
                    >
                      <ChevronLeft size={20} />
                      <span>Back</span>
                    </button>
                  </motion.div>
                )}

                {/* Menu Items */}
                <div className="flex-1 overflow-hidden relative">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div
                      key={currentLevel}
                      custom={direction}
                      variants={slideVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{
                        x: { type: 'spring', stiffness: 300, damping: 30 },
                        opacity: { duration: 0.2 },
                      }}
                      className="flex-1 overflow-y-auto px-4 pb-6 pt-2 space-y-3"
                    >
                      {getCurrentMenu().map((item, index) => {
                        const Icon = item.icon || Package;
                        return (
                          <motion.button
                            key={item.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            onClick={() => handleItemClick(item)}
                            className="w-full bg-white rounded-2xl p-5 shadow-sm hover:shadow-md active:scale-[0.98] transition-all text-left"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shrink-0">
                                <Icon size={22} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-gray-900 text-base mb-1">
                                  {item.title}
                                </h3>
                                <p className="text-sm text-gray-500 line-clamp-1">
                                  {item.subtitle}
                                </p>
                              </div>
                              {item.hasSubmenu && (
                                <ChevronRight
                                  size={22}
                                  className="text-gray-400 shrink-0"
                                />
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom Home Indicator */}
        <div className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 backdrop-blur-md border-t border-gray-200 flex items-center justify-center pointer-events-none">
          <div className="w-32 h-1.5 bg-gray-400 rounded-full" />
        </div>
      </div>
    </div>
  );
}
