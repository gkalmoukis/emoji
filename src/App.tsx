import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useKV } from '@github/spark/hooks'
import IndexPage from './components/IndexPage'
import ShowPage from './components/ShowPage'
import type { Emoji } from './lib/emoji-data'
import type { Collection } from './lib/collections'
import { toast } from 'sonner'

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null)
  const [favorites, setFavorites] = useKV<string[]>('emoji-favorites', [])
  const [recents, setRecents] = useKV<string[]>('emoji-recents', [])
  const [collections, setCollections] = useKV<Collection[]>('emoji-collections', [])

  const handleSelectEmoji = (emoji: Emoji) => {
    setSelectedEmoji(emoji)
    
    setRecents((currentRecents) => {
      const current = currentRecents || []
      const filtered = current.filter(c => c !== emoji.codepoint)
      const updated = [emoji.codepoint, ...filtered]
      return updated.slice(0, 20)
    })
  }

  const handleToggleFavorite = (codepoint: string) => {
    setFavorites((currentFavorites) => {
      const current = currentFavorites || []
      if (current.includes(codepoint)) {
        return current.filter(c => c !== codepoint)
      } else {
        return [...current, codepoint]
      }
    })
  }

  const handleCreateCollection = (name: string, emoji: string, color: string) => {
    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name,
      emoji,
      color,
      emojiCodepoints: [],
      createdAt: Date.now(),
    }
    setCollections((current) => [...(current || []), newCollection])
    toast.success(`Collection "${name}" created`)
  }

  const handleDeleteCollection = (id: string) => {
    setCollections((current) => (current || []).filter((c) => c.id !== id))
    toast.success('Collection deleted')
  }

  const handleAddToCollection = (collectionId: string, emojiCodepoint: string) => {
    setCollections((current) => {
      const collections = current || []
      return collections.map((c) => {
        if (c.id === collectionId && !c.emojiCodepoints.includes(emojiCodepoint)) {
          return { ...c, emojiCodepoints: [...c.emojiCodepoints, emojiCodepoint] }
        }
        return c
      })
    })
    toast.success('Added to collection')
  }

  const handleRemoveFromCollection = (collectionId: string, emojiCodepoint: string) => {
    setCollections((current) => {
      const collections = current || []
      return collections.map((c) => {
        if (c.id === collectionId) {
          return { ...c, emojiCodepoints: c.emojiCodepoints.filter((e) => e !== emojiCodepoint) }
        }
        return c
      })
    })
    toast.success('Removed from collection')
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {selectedEmoji ? (
          <ShowPage 
            emoji={selectedEmoji} 
            onBack={() => setSelectedEmoji(null)}
            isFavorite={(favorites || []).includes(selectedEmoji.codepoint)}
            onToggleFavorite={() => handleToggleFavorite(selectedEmoji.codepoint)}
            collections={collections || []}
            onAddToCollection={handleAddToCollection}
            onRemoveFromCollection={handleRemoveFromCollection}
            onCreateCollection={handleCreateCollection}
          />
        ) : (
          <IndexPage 
            onSelectEmoji={handleSelectEmoji}
            favorites={favorites || []}
            recents={recents || []}
            onToggleFavorite={handleToggleFavorite}
            collections={collections || []}
            onCreateCollection={handleCreateCollection}
            onDeleteCollection={handleDeleteCollection}
            onAddToCollection={handleAddToCollection}
            onRemoveFromCollection={handleRemoveFromCollection}
          />
        )}
      </div>
      <Toaster />
    </>
  )
}

export default App
