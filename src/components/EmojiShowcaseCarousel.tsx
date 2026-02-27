import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const showcaseEmojis = [
  { emoji: '😀', name: 'Grinning Face', category: 'Smileys', code: 'U+1F600' },
  { emoji: '❤️', name: 'Red Heart', category: 'Symbols', code: 'U+2764' },
  { emoji: '🎉', name: 'Party Popper', category: 'Activities', code: 'U+1F389' },
  { emoji: '🔥', name: 'Fire', category: 'Nature', code: 'U+1F525' },
  { emoji: '✨', name: 'Sparkles', category: 'Activities', code: 'U+2728' },
  { emoji: '🚀', name: 'Rocket', category: 'Travel', code: 'U+1F680' },
  { emoji: '🌟', name: 'Glowing Star', category: 'Nature', code: 'U+1F31F' },
  { emoji: '💡', name: 'Light Bulb', category: 'Objects', code: 'U+1F4A1' },
  { emoji: '🎨', name: 'Artist Palette', category: 'Activities', code: 'U+1F3A8' },
  { emoji: '🌈', name: 'Rainbow', category: 'Nature', code: 'U+1F308' },
  { emoji: '⚡', name: 'High Voltage', category: 'Nature', code: 'U+26A1' },
  { emoji: '🎯', name: 'Direct Hit', category: 'Activities', code: 'U+1F3AF' },
]

export default function EmojiShowcaseCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [direction, setDirection] = useState(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setDirection(1)
      setCurrentIndex((prev) => (prev + 1) % showcaseEmojis.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentEmoji = showcaseEmojis[currentIndex]
  
  const visibleEmojis = [
    showcaseEmojis[(currentIndex - 1 + showcaseEmojis.length) % showcaseEmojis.length],
    currentEmoji,
    showcaseEmojis[(currentIndex + 1) % showcaseEmojis.length],
  ]

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.8,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -100 : 100,
      opacity: 0,
      scale: 0.8,
    }),
  }

  const floatingAnimation = {
    y: [0, -20, 0],
    rotate: [0, 5, -5, 0],
  }
  
  const floatingTransition = {
    duration: 4,
    repeat: Infinity as number,
    ease: "easeInOut" as const,
  }

  return (
    <div className="relative py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-10"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [0, -30, 0],
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              duration: 5 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          >
            {showcaseEmojis[i % showcaseEmojis.length].emoji}
          </motion.div>
        ))}
      </div>

      <div className="relative max-w-5xl mx-auto">
        <div className="flex items-center justify-center gap-4 lg:gap-8 px-4">
          <motion.div
            className="hidden lg:block opacity-40 scale-75"
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 min-w-[180px]">
              <div className="text-center space-y-2">
                <div className="text-5xl">{visibleEmojis[0].emoji}</div>
                <p className="text-sm font-medium truncate">{visibleEmojis[0].name}</p>
                <Badge variant="secondary" className="text-xs">
                  {visibleEmojis[0].category}
                </Badge>
              </div>
            </Card>
          </motion.div>

          <div className="relative w-full max-w-xs lg:max-w-sm">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 },
                }}
              >
                <Card className="p-8 lg:p-10 bg-gradient-to-br from-card via-card to-secondary/30 backdrop-blur-sm border-2 shadow-2xl">
                  <div className="text-center space-y-4">
                    <motion.div
                      animate={floatingAnimation}
                      transition={floatingTransition}
                      className="text-8xl lg:text-9xl filter drop-shadow-lg"
                    >
                      {currentEmoji.emoji}
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="text-xl lg:text-2xl font-bold">{currentEmoji.name}</h3>
                      <div className="flex items-center justify-center gap-2">
                        <Badge className="bg-primary/10 text-primary border-primary/20">
                          {currentEmoji.category}
                        </Badge>
                        <Badge variant="outline" className="font-mono text-xs">
                          {currentEmoji.code}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.div
            className="hidden lg:block opacity-40 scale-75"
            animate={{ opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          >
            <Card className="p-6 bg-card/50 backdrop-blur-sm border-2 min-w-[180px]">
              <div className="text-center space-y-2">
                <div className="text-5xl">{visibleEmojis[2].emoji}</div>
                <p className="text-sm font-medium truncate">{visibleEmojis[2].name}</p>
                <Badge variant="secondary" className="text-xs">
                  {visibleEmojis[2].category}
                </Badge>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="flex justify-center gap-2 mt-8">
          {showcaseEmojis.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1)
                setCurrentIndex(index)
              }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'w-8 bg-primary' 
                  : 'w-2 bg-border hover:bg-primary/50'
              }`}
              aria-label={`Go to emoji ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
