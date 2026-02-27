import { useState, useMemo } from 'react'
import { MagnifyingGlass, X, Copy, Heart, FolderOpen } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { EMOJIS, CATEGORIES, type Emoji } from '@/lib/emoji-data'
import type { Collection } from '@/lib/collections'
import CollectionDialog, { ManageCollectionsDialog } from './CollectionDialog'

interface IndexPageProps {
  onSelectEmoji: (emoji: Emoji) => void
  favorites: string[]
  recents: string[]
  onToggleFavorite: (codepoint: string) => void
  collections: Collection[]
  onCreateCollection: (name: string, emoji: string, color: string) => void
  onDeleteCollection: (id: string) => void
  onAddToCollection: (collectionId: string, emojiCodepoint: string) => void
  onRemoveFromCollection: (collectionId: string, emojiCodepoint: string) => void
}

export default function IndexPage({ 
  onSelectEmoji, 
  favorites, 
  recents, 
  onToggleFavorite,
  collections,
  onCreateCollection,
  onDeleteCollection,
}: IndexPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const favoriteEmojis = useMemo(() => {
    return EMOJIS.filter(e => favorites.includes(e.codepoint))
  }, [favorites])

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
      toast.success('Emoji copied to clipboard!')
    } catch {
      toast.error('Failed to copy emoji')
    }
  }

  const handleFavoriteClick = (codepoint: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onToggleFavorite(codepoint)
    const isFavorited = !favorites.includes(codepoint)
    toast.success(isFavorited ? 'Added to favorites' : 'Removed from favorites')
  }

  const renderEmojiGrid = (emojis: Emoji[], showActions = true) => (
    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
      {emojis.map((emoji) => (
        <Card
          key={emoji.codepoint}
          className="aspect-square flex items-center justify-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95 relative group"
          onClick={() => onSelectEmoji(emoji)}
        >
          <span className="text-4xl">{emoji.emoji}</span>
          {showActions && (
            <div className="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant={favorites.includes(emoji.codepoint) ? 'default' : 'secondary'}
                className="h-6 w-6 p-0"
                onClick={(e) => handleFavoriteClick(emoji.codepoint, e)}
              >
                <Heart 
                  size={14} 
                  weight={favorites.includes(emoji.codepoint) ? 'fill' : 'regular'}
                />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="h-6 w-6 p-0"
                onClick={(e) => copyEmoji(emoji.emoji, e)}
              >
                <Copy size={14} />
              </Button>
            </div>
          )}
        </Card>
      ))}
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
            <CollectionDialog onCreateCollection={onCreateCollection} />
            <ManageCollectionsDialog 
              collections={collections}
              onDeleteCollection={onDeleteCollection}
            />
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

      {favoriteEmojis.length > 0 && !searchQuery && selectedCategories.length === 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Heart size={24} weight="fill" className="text-accent" />
              Favorites
            </h2>
            {renderEmojiGrid(favoriteEmojis)}
          </div>
          <Separator className="my-8" />
        </>
      )}

      {collections.length > 0 && !searchQuery && selectedCategories.length === 0 && collections.map((collection) => {
        const collectionEmojis = EMOJIS.filter(e => collection.emojiCodepoints.includes(e.codepoint))
        if (collectionEmojis.length === 0) return null
        
        return (
          <div key={collection.id} className="mb-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <span 
                className="h-8 w-8 rounded-md flex items-center justify-center text-lg"
                style={{ backgroundColor: collection.color }}
              >
                {collection.emoji}
              </span>
              {collection.name}
              <span className="text-sm text-muted-foreground font-normal">
                ({collectionEmojis.length})
              </span>
            </h2>
            {renderEmojiGrid(collectionEmojis)}
            <Separator className="my-8" />
          </div>
        )
      })}

      {recentEmojis.length > 0 && !searchQuery && selectedCategories.length === 0 && (
        <>
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-4">Recently Viewed</h2>
            {renderEmojiGrid(recentEmojis.slice(0, 10))}
          </div>
          <Separator className="my-8" />
        </>
      )}

      {(searchQuery || selectedCategories.length > 0) && (
        <h2 className="text-2xl font-bold mb-4">
          {searchQuery || selectedCategories.length > 0 ? 'Search Results' : 'All Emojis'}
        </h2>
      )}

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
