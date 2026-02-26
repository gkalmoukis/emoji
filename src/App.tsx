import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useKV } from '@github/spark/hooks'
import IndexPage from './components/IndexPage'
import ShowPage from './components/ShowPage'
import type { Emoji } from './lib/emoji-data'

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null)
  const [favorites, setFavorites] = useKV<string[]>('emoji-favorites', [])
  const [recents, setRecents] = useKV<string[]>('emoji-recents', [])

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

  return (
    <>
      <div className="min-h-screen bg-background">
        {selectedEmoji ? (
          <ShowPage 
            emoji={selectedEmoji} 
            onBack={() => setSelectedEmoji(null)}
            isFavorite={(favorites || []).includes(selectedEmoji.codepoint)}
            onToggleFavorite={() => handleToggleFavorite(selectedEmoji.codepoint)}
          />
        ) : (
          <IndexPage 
            onSelectEmoji={handleSelectEmoji}
            favorites={favorites || []}
            recents={recents || []}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
      <Toaster />
    </>
  )
}

export default App
