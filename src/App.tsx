import { useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import IndexPage from './components/IndexPage'
import ShowPage from './components/ShowPage'
import type { Emoji } from './lib/emoji-data'

function App() {
  const [selectedEmoji, setSelectedEmoji] = useState<Emoji | null>(null)

  return (
    <>
      <div className="min-h-screen bg-background">
        {selectedEmoji ? (
          <ShowPage emoji={selectedEmoji} onBack={() => setSelectedEmoji(null)} />
        ) : (
          <IndexPage onSelectEmoji={setSelectedEmoji} />
        )}
      </div>
      <Toaster />
    </>
  )
}

export default App
