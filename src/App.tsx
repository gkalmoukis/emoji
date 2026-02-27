import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useKV } from '@github/spark/hooks'
import LandingPage from './components/LandingPage'
import HomePage from './components/HomePage'
import ShowPage from './components/ShowPage'
import CollectionsIndexPage from './components/CollectionsIndexPage'
import CollectionShowPage from './components/CollectionShowPage'
import FavoritesPage from './components/FavoritesPage'
import type { Emoji } from './lib/emoji-data'
import type { Collection } from './lib/collections'
import { toast } from 'sonner'

type View = 
  | { type: 'landing' }
  | { type: 'home' }
  | { type: 'emoji'; emoji: Emoji }
  | { type: 'collections' }
  | { type: 'collection'; collection: Collection }
  | { type: 'favorites' }

function App() {
  const [view, setView] = useState<View>({ type: 'landing' })
  const [favorites, setFavorites] = useKV<string[]>('emoji-favorites', [])
  const [recents, setRecents] = useKV<string[]>('emoji-recents', [])
  const [collections, setCollections] = useKV<Collection[]>('emoji-collections', [])

  const handleSelectEmoji = (emoji: Emoji) => {
    setView({ type: 'emoji', emoji })
    
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

  const renderView = () => {
    switch (view.type) {
      case 'landing':
        return (
          <LandingPage onGetStarted={() => setView({ type: 'home' })} />
        )

      case 'home':
        return (
          <HomePage
            onSelectEmoji={handleSelectEmoji}
            favorites={favorites || []}
            recents={recents || []}
            onToggleFavorite={handleToggleFavorite}
            onNavigateToCollections={() => setView({ type: 'collections' })}
            onNavigateToFavorites={() => setView({ type: 'favorites' })}
          />
        )

      case 'emoji':
        return (
          <ShowPage 
            emoji={view.emoji} 
            onBack={() => setView({ type: 'home' })}
            isFavorite={(favorites || []).includes(view.emoji.codepoint)}
            onToggleFavorite={() => handleToggleFavorite(view.emoji.codepoint)}
            collections={collections || []}
            onAddToCollection={handleAddToCollection}
            onRemoveFromCollection={handleRemoveFromCollection}
            onCreateCollection={handleCreateCollection}
          />
        )

      case 'collections':
        return (
          <CollectionsIndexPage
            collections={collections || []}
            onCreateCollection={handleCreateCollection}
            onDeleteCollection={handleDeleteCollection}
            onSelectCollection={(collection) => setView({ type: 'collection', collection })}
            onBack={() => setView({ type: 'home' })}
          />
        )

      case 'collection':
        return (
          <CollectionShowPage
            collection={view.collection}
            onSelectEmoji={handleSelectEmoji}
            onRemoveFromCollection={handleRemoveFromCollection}
            onDeleteCollection={handleDeleteCollection}
            onBack={() => setView({ type: 'collections' })}
            favorites={favorites || []}
            onToggleFavorite={handleToggleFavorite}
          />
        )

      case 'favorites':
        return (
          <FavoritesPage
            favorites={favorites || []}
            onSelectEmoji={handleSelectEmoji}
            onToggleFavorite={handleToggleFavorite}
            onBack={() => setView({ type: 'home' })}
          />
        )
    }
  }

  return (
    <>
      <div className="min-h-screen bg-background">
        {renderView()}
      </div>
      <Toaster />
    </>
  )
}

export default App
