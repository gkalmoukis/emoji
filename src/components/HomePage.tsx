import { useState, useMemo } from 'react'
import { MagnifyingGlass, X, Copy, Heart, FolderOpen, Star } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { EMOJIS, CATEGORIES, type Emoji } from '@/lib/emoji-data'
import type { Collection } from '@/lib/collections'

interface HomePageProps {
  onSelectEmoji: (emoji: Emoji) => void
  favorites: string[]
  recents: string[]
  onToggleFavorite: (codepoint: string) => void
  onNavigateToCollections: () => void
  onNavigateToFavorites: () => void
}

export default function HomePage({ 
  onSelectEmoji, 
  favorites, 
  recents, 
  onToggleFavorite,
  onNavigateToCollections,
  onNavigateToFavorites,
}: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null)

  const recentEmojis = useMemo(() => {
    return recents.map(codepoint => EMOJIS.find(e => e.codepoint === codepoint)).filter(Boolean) as Emoji[]
  }, [recents])

  const filteredEmojis = useMemo(() => {
    let filtered = EMOJIS

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(query) ||
          e.keywords.some((k) => k.toLowerCase().includes(query))
      )
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((e) => selectedCategories.includes(e.category))
    }

    return filtered
  }, [searchQuery, selectedCategories])

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    )
  }

  const copyEmoji = async (emoji: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await navigator.clipboard.writeText(emoji)
      toast.success('Emoji copied!', { duration: 1500 })
    } catch {
      toast.error('Failed to copy emoji')
    }
  }

  const handleFavoriteClick = (codepoint: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(codepoint)
  }

  const renderEmojiGrid = (emojis: Emoji[]) => (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
      {emojis.map((emoji) => {
        const isFavorite = favorites.includes(emoji.codepoint)
        const isHovered = hoveredEmoji === emoji.codepoint
        
        return (
          <Card
            key={emoji.codepoint}
            className="aspect-square flex items-center justify-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95 relative group"
            onClick={() => onSelectEmoji(emoji)}
            onMouseEnter={() => setHoveredEmoji(emoji.codepoint)}
            onMouseLeave={() => setHoveredEmoji(null)}
          >
            <span className="text-4xl select-none">{emoji.emoji}</span>
            
            {isFavorite && !isHovered && (
              <div className="absolute top-1 right-1">
                <Heart 
                  size={16} 
                  weight="fill"
                  className="text-accent drop-shadow-sm"
                />
              </div>
            )}
            
            {isHovered && (
              <div className="absolute inset-0 bg-gradient-to-t from-accent/90 to-accent/70 rounded-lg flex flex-col items-center justify-center gap-1.5 backdrop-blur-[2px]">
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-8 w-8 p-0 bg-background/95 hover:bg-background shadow-md"
                  onClick={(e) => copyEmoji(emoji.emoji, e)}
                >
                  <Copy size={16} weight="bold" />
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  className={`h-8 w-8 p-0 shadow-md ${
                    isFavorite 
                      ? 'bg-accent text-accent-foreground hover:bg-accent/90' 
                      : 'bg-background/95 hover:bg-background'
                  }`}
                  onClick={(e) => handleFavoriteClick(emoji.codepoint, e)}
                >
                  <Heart 
                    size={16} 
                    weight={isFavorite ? 'fill' : 'bold'}
                  />
                </Button>
              </div>
            )}
          </Card>
        )
      })}
    </div>
  )

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <header className="mb-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Emojipedia
            </h1>
            <p className="text-muted-foreground mt-2">
              Find the perfect emoji for every moment
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onNavigateToFavorites}>
              <Heart className="mr-2" size={18} weight="fill" />
              Favorites
            </Button>
            <Button variant="outline" onClick={onNavigateToCollections}>
              <FolderOpen className="mr-2" size={18} />
              Collections
            </Button>
          </div>
        </div>
      </header>

      <div className="mb-6">
        <div className="relative">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            type="text"
            placeholder="Search emojis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {CATEGORIES.map((category) => {
          const isActive = selectedCategories.includes(category)
          return (
            <Badge
              key={category}
              variant={isActive ? 'default' : 'secondary'}
              className={`cursor-pointer transition-all hover:scale-105 ${
                isActive ? 'bg-accent text-accent-foreground' : ''
              }`}
              onClick={() => toggleCategory(category)}
            >
              {category}
              {isActive && (
                <X size={14} className="ml-1" weight="bold" />
              )}
            </Badge>
          )
        })}
      </div>

      {recentEmojis.length > 0 && !searchQuery && selectedCategories.length === 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
            {renderEmojiGrid(recentEmojis.slice(0, 10))}
          </div>
          <Separator className="my-8" />
        </>
      )}

      <div className="mb-4">
        <h2 className="text-2xl font-bold">
          {searchQuery || selectedCategories.length > 0 ? 'Search Results' : 'All Emojis'}
        </h2>
      </div>

      {filteredEmojis.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🤔</p>
          <p className="text-lg text-muted-foreground">
            No emojis found. Try different keywords or clear filters.
          </p>
        </div>
      ) : (
        renderEmojiGrid(filteredEmojis)
      )}
    </div>
  )
}
