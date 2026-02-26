import { useState, useMemo } from 'react'
import { MagnifyingGlass, X, Copy } from '@phosphor-icons/react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { EMOJIS, CATEGORIES, type Emoji } from '@/lib/emoji-data'

interface IndexPageProps {
  onSelectEmoji: (emoji: Emoji) => void
}

export default function IndexPage({ onSelectEmoji }: IndexPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

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

  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2 tracking-tight">
          Emojipedia
        </h1>
        <p className="text-muted-foreground">
          Find the perfect emoji for every moment
        </p>
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

      {filteredEmojis.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-5xl mb-4">🤔</p>
          <p className="text-lg text-muted-foreground">
            No emojis found. Try different keywords or clear filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {filteredEmojis.map((emoji) => (
            <Card
              key={emoji.codepoint}
              className="aspect-square flex items-center justify-center cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95 relative group"
              onClick={() => onSelectEmoji(emoji)}
            >
              <span className="text-4xl">{emoji.emoji}</span>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
                onClick={(e) => copyEmoji(emoji.emoji, e)}
              >
                <Copy size={14} />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
