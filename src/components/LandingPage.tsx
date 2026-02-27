import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Heart, MagnifyingGlass, FolderOpen, Clock, Sparkle, Copy, Check } from '@phosphor-icons/react'
import { motion } from 'framer-motion'
import { useState } from 'react'
import EmojiShowcaseCarousel from './EmojiShowcaseCarousel'

interface LandingPageProps {
  onGetStarted: () => void
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [copiedDemo, setCopiedDemo] = useState(false)

  const handleDemoCopy = () => {
    navigator.clipboard.writeText('🎉')
    setCopiedDemo(true)
    setTimeout(() => setCopiedDemo(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-muted">
      <div className="max-w-6xl mx-auto px-6 py-12 lg:py-20">
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center gap-3 bg-primary/10 px-5 py-2 rounded-full border border-primary/20 mb-4">
            <Sparkle className="text-primary" weight="fill" size={20} />
            <span className="text-sm font-medium text-primary">Your Emoji Selection Tool</span>
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight">
            Find the Perfect Emoji,
            <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Every Time
            </span>
          </h1>
          
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Search, organize, and copy emojis instantly. Your personal emoji library with collections, favorites, and smart search.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button 
              size="lg" 
              className="text-lg px-8 py-6 bg-accent hover:bg-accent/90"
              onClick={onGetStarted}
            >
              Get Started Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8 py-6"
              onClick={onGetStarted}
            >
              Explore Emojis
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <EmojiShowcaseCarousel />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-20"
        >
          <Card className="p-8 bg-card/80 backdrop-blur-sm border-2 shadow-2xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex-1 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="text-6xl">🎉</div>
                  <div>
                    <h3 className="text-xl font-bold">Party Popper</h3>
                    <p className="text-sm text-muted-foreground">U+1F389 • :tada:</p>
                  </div>
                </div>
                <p className="text-muted-foreground">
                  One-click copy, detailed info, and instant access to all your favorite emojis
                </p>
              </div>
              <Button 
                size="lg"
                variant={copiedDemo ? "outline" : "default"}
                className="gap-2 min-w-[140px]"
                onClick={handleDemoCopy}
              >
                {copiedDemo ? (
                  <>
                    <Check weight="bold" size={20} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy weight="bold" size={20} />
                    Copy Emoji
                  </>
                )}
              </Button>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-3xl lg:text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 h-full bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 hover:border-primary/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4">
                  <MagnifyingGlass className="text-primary" weight="bold" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Smart Search</h3>
                <p className="text-muted-foreground">
                  Find any emoji instantly with real-time search across names, keywords, and categories
                </p>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 h-full bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20 hover:border-accent/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                  <FolderOpen className="text-accent" weight="bold" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Collections</h3>
                <p className="text-muted-foreground">
                  Organize emojis into custom collections with names, icons, and colors
                </p>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 h-full bg-gradient-to-br from-destructive/10 to-destructive/5 border-destructive/20 hover:border-destructive/40 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center mb-4">
                  <Heart className="text-destructive" weight="fill" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Favorites</h3>
                <p className="text-muted-foreground">
                  Save your go-to emojis for quick access. All your favorites in one place
                </p>
              </Card>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05, y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card className="p-6 h-full bg-gradient-to-br from-muted to-muted/50 border-border hover:border-foreground/20 transition-colors">
                <div className="w-12 h-12 rounded-xl bg-foreground/10 flex items-center justify-center mb-4">
                  <Clock className="text-foreground" weight="bold" size={24} />
                </div>
                <h3 className="text-xl font-bold mb-2">Recent History</h3>
                <p className="text-muted-foreground">
                  Automatically track your last 20 viewed emojis for easy access
                </p>
              </Card>
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-20"
        >
          <Card className="p-10 lg:p-14 bg-gradient-to-br from-primary via-accent to-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
              <h2 className="text-3xl lg:text-5xl font-bold">
                Over 3,600+ Emojis
              </h2>
              <p className="text-lg lg:text-xl opacity-90">
                Complete emoji library with detailed metadata, skin tone variants, technical information, and design previews
              </p>
              <div className="flex flex-wrap gap-3 justify-center pt-4">
                <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                  😀 Smileys & People
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                  🐶 Animals & Nature
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                  🍕 Food & Drink
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                  ⚽ Activities
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                  🚗 Travel & Places
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                  💡 Objects
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                  🔣 Symbols
                </Badge>
                <Badge variant="secondary" className="text-base px-4 py-2 bg-white/20 hover:bg-white/30 text-white border-white/30">
                  🏁 Flags
                </Badge>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center space-y-6"
        >
          <h2 className="text-3xl lg:text-4xl font-bold">
            Ready to Find Your Emoji?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start browsing thousands of emojis with powerful search, collections, and instant copy functionality
          </p>
          <Button 
            size="lg" 
            className="text-lg px-10 py-6 bg-accent hover:bg-accent/90"
            onClick={onGetStarted}
          >
            Launch Emojipedia
          </Button>
        </motion.div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-20 pt-8 border-t text-center text-sm text-muted-foreground"
        >
          <p>Built with ❤️ for emoji lovers everywhere</p>
        </motion.footer>
      </div>
    </div>
  )
}
