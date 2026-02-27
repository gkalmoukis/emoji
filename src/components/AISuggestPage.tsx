import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Sparkle, Copy, Check, Heart } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { EMOJIS, type Emoji } from '@/lib/emoji-data'

interface AISuggestPageProps {
  onBack: () => void
  onSelectEmoji: (emoji: Emoji) => void
  favorites: string[]
  onToggleFavorite: (codepoint: string) => void
}

interface SuggestedEmoji {
  emoji: Emoji
  reason: string
  relevance: number
}

export default function AISuggestPage({ onBack, onSelectEmoji, favorites, onToggleFavorite }: AISuggestPageProps) {
  const [prompt, setPrompt] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestedEmoji[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null)

  const handleCopy = (emoji: string, codepoint: string) => {
    navigator.clipboard.writeText(emoji)
    setCopiedEmoji(codepoint)
    toast.success('Emoji copied!')
    setTimeout(() => setCopiedEmoji(null), 2000)
  }

  const handleSuggest = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setIsLoading(true)
    setSuggestions([])

    try {
      const promptText = `You are an expert at understanding context and emotions to suggest the most relevant emojis.

Analyze this text and suggest the 8 most relevant emojis from the provided emoji list:

TEXT: "${prompt}"

EMOJI DATABASE (JSON array of objects with emoji, name, category, keywords, codepoint):
${JSON.stringify(EMOJIS.map(e => ({
  emoji: e.emoji,
  name: e.name,
  category: e.category,
  keywords: e.keywords,
  codepoint: e.codepoint
})))}

Return EXACTLY 8 emoji suggestions as a JSON object with a single property "suggestions" containing an array of objects with:
- codepoint: the emoji's codepoint from the database (string)
- reason: ONE short sentence (max 10 words) why this emoji fits the text
- relevance: score 1-10 based on how well it matches

Format:
{
  "suggestions": [
    {"codepoint": "U+1F600", "reason": "Expresses happiness and joy", "relevance": 9},
    ...7 more
  ]
}

Return ONLY valid JSON, no other text.`

      const response = await window.spark.llm(promptText, 'gpt-4o', true)
      const parsed = JSON.parse(response)
      
      const suggestedEmojis: SuggestedEmoji[] = parsed.suggestions
        .map((s: { codepoint: string; reason: string; relevance: number }) => {
          const emoji = EMOJIS.find(e => e.codepoint === s.codepoint)
          if (!emoji) return null
          return {
            emoji,
            reason: s.reason,
            relevance: s.relevance
          }
        })
        .filter((s: SuggestedEmoji | null): s is SuggestedEmoji => s !== null)
        .sort((a: SuggestedEmoji, b: SuggestedEmoji) => b.relevance - a.relevance)

      setSuggestions(suggestedEmojis)

      if (suggestedEmojis.length === 0) {
        toast.error('No emoji suggestions found. Try a different prompt.')
      }
    } catch (error) {
      console.error('Error getting AI suggestions:', error)
      toast.error('Failed to get suggestions. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const examplePrompts = [
    "Celebrating a big win at work!",
    "Feeling cozy on a rainy day",
    "Late night coding session",
    "First day of vacation",
    "Just finished a great workout"
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <ArrowLeft size={24} weight="bold" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sparkle className="text-primary" weight="fill" size={32} />
              AI Emoji Suggestions
            </h1>
            <p className="text-muted-foreground mt-1">
              Describe your mood, situation, or message and let AI suggest the perfect emojis
            </p>
          </div>
        </div>

        <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <div className="space-y-4">
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium mb-2">
                What's on your mind?
              </label>
              <Textarea
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., 'Just finished my first marathon!' or 'Working late on an exciting project'"
                className="min-h-[120px] text-base resize-none"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    handleSuggest()
                  }
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Press {navigator.platform.includes('Mac') ? '⌘' : 'Ctrl'} + Enter to suggest
              </div>
              <Button
                onClick={handleSuggest}
                disabled={isLoading || !prompt.trim()}
                className="gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto"
                size="lg"
              >
                <Sparkle weight="fill" size={20} />
                {isLoading ? 'Thinking...' : 'Suggest Emojis'}
              </Button>
            </div>
          </div>
        </Card>

        {!isLoading && suggestions.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold text-muted-foreground">Try these examples:</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {examplePrompts.map((example, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPrompt(example)}
                  className="text-left"
                >
                  <Card className="p-4 hover:bg-secondary/50 transition-colors cursor-pointer border-2 hover:border-primary/30">
                    <p className="text-sm">{example}</p>
                  </Card>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Sparkle className="text-primary" weight="fill" size={48} />
            </motion.div>
            <p className="text-lg text-muted-foreground">Analyzing your prompt...</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {suggestions.length > 0 && !isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Suggested Emojis</h2>
                <Badge variant="secondary" className="text-sm">
                  {suggestions.length} suggestions
                </Badge>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.emoji.codepoint}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-5 hover:shadow-lg transition-all border-2 hover:border-primary/30 group">
                      <div className="flex items-start gap-4">
                        <button
                          onClick={() => onSelectEmoji(suggestion.emoji)}
                          className="text-5xl hover:scale-110 transition-transform flex-shrink-0"
                        >
                          {suggestion.emoji.emoji}
                        </button>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <h3 className="font-semibold text-lg leading-tight">
                                {suggestion.emoji.name}
                              </h3>
                              <p className="text-xs text-muted-foreground">
                                {suggestion.emoji.category}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <Badge 
                                variant={suggestion.relevance >= 8 ? "default" : "secondary"}
                                className="text-xs"
                              >
                                {suggestion.relevance}/10
                              </Badge>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                            {suggestion.reason}
                          </p>

                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="default"
                              className="gap-1.5 flex-1"
                              onClick={() => handleCopy(suggestion.emoji.emoji, suggestion.emoji.codepoint)}
                            >
                              {copiedEmoji === suggestion.emoji.codepoint ? (
                                <>
                                  <Check size={16} weight="bold" />
                                  Copied
                                </>
                              ) : (
                                <>
                                  <Copy size={16} weight="bold" />
                                  Copy
                                </>
                              )}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => onToggleFavorite(suggestion.emoji.codepoint)}
                            >
                              <Heart
                                size={16}
                                weight={favorites.includes(suggestion.emoji.codepoint) ? 'fill' : 'regular'}
                                className={favorites.includes(suggestion.emoji.codepoint) ? 'text-destructive' : ''}
                              />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    setSuggestions([])
                    setPrompt('')
                  }}
                  className="gap-2"
                >
                  <Sparkle size={20} weight="fill" />
                  Try Another Prompt
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
