import { useState, useMemo } from 'react'
import { ArrowLeft, Copy, Heart } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { EMOJIS, type Emoji } from '@/lib/emoji-data'

interface FavoritesPageProps {
  favorites: string[]
  onSelectEmoji: (emoji: Emoji) => void
  onToggleFavorite: (codepoint: string) => void
  onBack: () => void
}

export default function FavoritesPage({ 
  favorites, 
  onSelectEmoji,
  onToggleFavorite,
  onBack
}: FavoritesPageProps) {
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null)

  const favoriteEmojis = useMemo(() => {
    return EMOJIS.filter(e => favorites.includes(e.codepoint))
  }, [favorites])

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

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight flex items-center gap-3">
              <Heart size={36} weight="fill" className="text-accent" />
              Favorites
            </h1>
            <p className="text-muted-foreground mt-1">
              {favoriteEmojis.length} {favoriteEmojis.length === 1 ? 'emoji' : 'emojis'}
            </p>
          </div>
        </div>
      </div>

      {favoriteEmojis.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4">
            <Heart size={64} weight="thin" className="mx-auto text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6">
            Start adding emojis to your favorites to see them here
          </p>
          <Button onClick={onBack}>
            Browse Emojis
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {favoriteEmojis.map((emoji) => {
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
                
                {!isHovered && (
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
                      className="h-8 w-8 p-0 bg-accent text-accent-foreground hover:bg-accent/90 shadow-md"
                      onClick={(e) => handleFavoriteClick(emoji.codepoint, e)}
                    >
                      <Heart 
                        size={16} 
                        weight="fill"
                      />
                    </Button>
                  </div>
                )}
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
