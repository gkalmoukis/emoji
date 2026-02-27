import { useState } from 'react'
import { ArrowLeft, Copy, Heart, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { toast } from 'sonner'
import { EMOJIS, type Emoji } from '@/lib/emoji-data'
import type { Collection } from '@/lib/collections'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

interface CollectionShowPageProps {
  collection: Collection
  onSelectEmoji: (emoji: Emoji) => void
  onRemoveFromCollection: (collectionId: string, emojiCodepoint: string) => void
  onDeleteCollection: (id: string) => void
  onBack: () => void
  favorites: string[]
  onToggleFavorite: (codepoint: string) => void
}

export default function CollectionShowPage({ 
  collection,
  onSelectEmoji,
  onRemoveFromCollection,
  onDeleteCollection,
  onBack,
  favorites,
  onToggleFavorite,
}: CollectionShowPageProps) {
  const [hoveredEmoji, setHoveredEmoji] = useState<string | null>(null)
  
  const collectionEmojis = collection.emojiCodepoints
    .map(codepoint => EMOJIS.find(e => e.codepoint === codepoint))
    .filter(Boolean) as Emoji[]

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

  const handleRemoveClick = (codepoint: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onRemoveFromCollection(collection.id, codepoint)
    toast.success('Removed from collection')
  }

  const handleDeleteCollection = () => {
    onDeleteCollection(collection.id)
    onBack()
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <div className="flex items-center gap-3">
            <div 
              className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl"
              style={{ backgroundColor: collection.color }}
            >
              <span className="text-white drop-shadow-md">{collection.emoji}</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground tracking-tight">
                {collection.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                {collectionEmojis.length} {collectionEmojis.length === 1 ? 'emoji' : 'emojis'}
              </p>
            </div>
          </div>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">
              <Trash className="mr-2" />
              Delete Collection
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Collection</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{collection.name}"? This action cannot be undone. The emojis will not be deleted, only removed from this collection.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteCollection}>
                Delete Collection
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {collectionEmojis.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4 text-6xl">{collection.emoji}</div>
          <h2 className="text-2xl font-bold mb-2">No emojis in this collection</h2>
          <p className="text-muted-foreground">
            Add emojis from the emoji detail page
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {collectionEmojis.map((emoji) => {
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
                    <Button
                      size="sm"
                      variant="secondary"
                      className="h-8 w-8 p-0 bg-destructive/95 text-destructive-foreground hover:bg-destructive shadow-md"
                      onClick={(e) => handleRemoveClick(emoji.codepoint, e)}
                    >
                      <Trash size={16} weight="bold" />
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
