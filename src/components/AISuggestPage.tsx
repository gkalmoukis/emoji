import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Sparkle, Copy, Check, Heart, Smiley, Palette, Brain } from '@phosphor-icons/react'
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

interface SentimentAnalysis {
  overall: string
  confidence: number
  emotions: Array<{ name: string; intensity: number }>
  tone: string
  suggestedEmojis: SuggestedEmoji[]
}

interface EmojiCombination {
  emojis: Emoji[]
  meaning: string
  usage: string
  popularity: number
}

export default function AISuggestPage({ onBack, onSelectEmoji, favorites, onToggleFavorite }: AISuggestPageProps) {
  const [prompt, setPrompt] = useState('')
  const [suggestions, setSuggestions] = useState<SuggestedEmoji[]>([])
  const [sentiment, setSentiment] = useState<SentimentAnalysis | null>(null)
  const [combinations, setCombinations] = useState<EmojiCombination[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [copiedEmoji, setCopiedEmoji] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('suggest')

  const handleCopy = (emoji: string, codepoint: string) => {
    navigator.clipboard.writeText(emoji)
    setCopiedEmoji(codepoint)
    toast.success('Emoji copied!')
    setTimeout(() => setCopiedEmoji(null), 2000)
  }

  const handleCopyCombination = (emojis: string) => {
    navigator.clipboard.writeText(emojis)
    toast.success('Emoji combination copied!')
  }

  const handleSuggest = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt')
      return
    }

    setIsLoading(true)
    setSuggestions([])

    try {
      const promptText = window.spark.llmPrompt`You are an expert at understanding context and emotions to suggest the most relevant emojis.

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

  const handleAnalyzeSentiment = async () => {
    if (!prompt.trim()) {
      toast.error('Please enter a text to analyze')
      return
    }

    setIsLoading(true)
    setSentiment(null)

    try {
      const promptText = window.spark.llmPrompt`You are an expert in sentiment analysis and emotional intelligence.

Analyze the sentiment and emotions in this text:

TEXT: "${prompt}"

EMOJI DATABASE:
${JSON.stringify(EMOJIS.map(e => ({
  emoji: e.emoji,
  name: e.name,
  category: e.category,
  keywords: e.keywords,
  codepoint: e.codepoint
})))}

Provide a comprehensive sentiment analysis as a JSON object with a single property "analysis" containing:
- overall: one word describing the overall sentiment (e.g., "positive", "negative", "neutral", "mixed")
- confidence: confidence score 0-100 for the overall sentiment
- emotions: array of 3-5 detected emotions, each with:
  - name: emotion name (e.g., "joy", "sadness", "excitement", "anger", "fear", "surprise")
  - intensity: intensity score 0-100
- tone: one word describing the tone (e.g., "casual", "formal", "playful", "serious", "sarcastic")
- suggestedEmojis: array of 6 emojis that best represent the sentiment, each with:
  - codepoint: emoji codepoint from database
  - reason: short explanation (max 8 words)
  - relevance: score 1-10

Format:
{
  "analysis": {
    "overall": "positive",
    "confidence": 85,
    "emotions": [{"name": "joy", "intensity": 90}, {"name": "excitement", "intensity": 75}],
    "tone": "casual",
    "suggestedEmojis": [{"codepoint": "U+1F600", "reason": "Represents happiness", "relevance": 9}]
  }
}

Return ONLY valid JSON.`

      const response = await window.spark.llm(promptText, 'gpt-4o', true)
      const parsed = JSON.parse(response)
      const analysis = parsed.analysis
      
      const suggestedEmojis: SuggestedEmoji[] = analysis.suggestedEmojis
        .map((s: { codepoint: string; reason: string; relevance: number }) => {
          const emoji = EMOJIS.find(e => e.codepoint === s.codepoint)
          if (!emoji) return null
          return { emoji, reason: s.reason, relevance: s.relevance }
        })
        .filter((s: SuggestedEmoji | null): s is SuggestedEmoji => s !== null)

      setSentiment({
        overall: analysis.overall,
        confidence: analysis.confidence,
        emotions: analysis.emotions,
        tone: analysis.tone,
        suggestedEmojis
      })
    } catch (error) {
      console.error('Error analyzing sentiment:', error)
      toast.error('Failed to analyze sentiment. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateCombinations = async () => {
    setIsLoading(true)
    setCombinations([])

    try {
      const promptText = window.spark.llmPrompt`You are an expert in emoji communication and popular emoji combinations.

Generate 8 creative and meaningful emoji combinations that people commonly use together.

EMOJI DATABASE:
${JSON.stringify(EMOJIS.slice(0, 500).map(e => ({
  emoji: e.emoji,
  name: e.name,
  category: e.category,
  codepoint: e.codepoint
})))}

Create combinations that:
- Use 2-4 emojis together
- Tell a story or express a complete idea
- Are actually used in real communication
- Vary in theme (celebrations, emotions, activities, reactions, etc.)

Return as JSON object with property "combinations" containing array of objects with:
- codepoints: array of 2-4 emoji codepoints from database
- meaning: what the combination means (max 8 words)
- usage: example context for using it (max 12 words)
- popularity: estimated popularity score 1-10

Format:
{
  "combinations": [
    {
      "codepoints": ["U+1F389", "U+1F38A"],
      "meaning": "Party celebration",
      "usage": "When celebrating a birthday or achievement",
      "popularity": 9
    }
  ]
}

Return ONLY valid JSON.`

      const response = await window.spark.llm(promptText, 'gpt-4o', true)
      const parsed = JSON.parse(response)
      
      const emojiCombinations: EmojiCombination[] = parsed.combinations
        .map((c: { codepoints: string[]; meaning: string; usage: string; popularity: number }) => {
          const emojis = c.codepoints
            .map(cp => EMOJIS.find(e => e.codepoint === cp))
            .filter((e): e is Emoji => e !== undefined)
          
          if (emojis.length === 0) return null
          
          return {
            emojis,
            meaning: c.meaning,
            usage: c.usage,
            popularity: c.popularity
          }
        })
        .filter((c: EmojiCombination | null): c is EmojiCombination => c !== null)

      setCombinations(emojiCombinations)

      if (emojiCombinations.length === 0) {
        toast.error('Failed to generate combinations. Please try again.')
      }
    } catch (error) {
      console.error('Error generating combinations:', error)
      toast.error('Failed to generate combinations. Please try again.')
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

  const sentimentExamples = [
    "I'm so excited about this new opportunity! Can't wait to get started.",
    "Feeling a bit overwhelmed with everything going on right now.",
    "This movie was absolutely incredible, best thing I've seen all year!",
    "Not sure how I feel about the changes, mixed emotions honestly."
  ]

  const getSentimentColor = (sentiment: string) => {
    const colors: Record<string, string> = {
      positive: 'text-green-600 bg-green-50 border-green-200',
      negative: 'text-red-600 bg-red-50 border-red-200',
      neutral: 'text-gray-600 bg-gray-50 border-gray-200',
      mixed: 'text-yellow-600 bg-yellow-50 border-yellow-200'
    }
    return colors[sentiment.toLowerCase()] || colors.neutral
  }

  const getEmotionColor = (emotion: string) => {
    const colors: Record<string, string> = {
      joy: 'bg-yellow-500',
      happiness: 'bg-yellow-500',
      excitement: 'bg-orange-500',
      sadness: 'bg-blue-500',
      anger: 'bg-red-500',
      fear: 'bg-purple-500',
      surprise: 'bg-pink-500',
      love: 'bg-rose-500',
      anxiety: 'bg-indigo-500',
      frustration: 'bg-red-600'
    }
    return colors[emotion.toLowerCase()] || 'bg-gray-500'
  }

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
              AI-Powered Emoji Tools
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover emojis with intelligent suggestions, sentiment analysis, and creative combinations
            </p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="suggest" className="gap-2">
              <Sparkle size={18} weight="fill" />
              Suggest
            </TabsTrigger>
            <TabsTrigger value="sentiment" className="gap-2">
              <Brain size={18} weight="fill" />
              Sentiment
            </TabsTrigger>
            <TabsTrigger value="combinations" className="gap-2">
              <Palette size={18} weight="fill" />
              Combinations
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggest" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="space-y-4">
                <div>
                  <label htmlFor="suggest-prompt" className="block text-sm font-medium mb-2">
                    What's on your mind?
                  </label>
                  <Textarea
                    id="suggest-prompt"
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
          </TabsContent>

          <TabsContent value="sentiment" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="space-y-4">
                <div>
                  <label htmlFor="sentiment-prompt" className="block text-sm font-medium mb-2">
                    Enter text to analyze sentiment
                  </label>
                  <Textarea
                    id="sentiment-prompt"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="E.g., 'I'm so excited about this new opportunity!' or 'Feeling overwhelmed with everything'"
                    className="min-h-[120px] text-base resize-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        handleAnalyzeSentiment()
                      }
                    }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    AI will analyze emotions and suggest matching emojis
                  </div>
                  <Button
                    onClick={handleAnalyzeSentiment}
                    disabled={isLoading || !prompt.trim()}
                    className="gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto"
                    size="lg"
                  >
                    <Brain weight="fill" size={20} />
                    {isLoading ? 'Analyzing...' : 'Analyze Sentiment'}
                  </Button>
                </div>
              </div>
            </Card>

            {!isLoading && !sentiment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-muted-foreground">Try these examples:</h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {sentimentExamples.map((example, index) => (
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
                  <Brain className="text-primary" weight="fill" size={48} />
                </motion.div>
                <p className="text-lg text-muted-foreground">Analyzing sentiment...</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {sentiment && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <Card className="p-6 border-2">
                    <h2 className="text-xl font-bold mb-4">Sentiment Analysis</h2>
                    
                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Overall Sentiment</p>
                        <Badge className={`text-base px-4 py-2 ${getSentimentColor(sentiment.overall)}`}>
                          {sentiment.overall.charAt(0).toUpperCase() + sentiment.overall.slice(1)}
                        </Badge>
                      </div>
                      
                      <div>
                        <p className="text-sm text-muted-foreground mb-2">Confidence</p>
                        <div className="space-y-2">
                          <Progress value={sentiment.confidence} className="h-2" />
                          <p className="text-sm font-medium">{sentiment.confidence}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-muted-foreground mb-2">Tone</p>
                      <Badge variant="outline" className="text-base px-4 py-2">
                        {sentiment.tone.charAt(0).toUpperCase() + sentiment.tone.slice(1)}
                      </Badge>
                    </div>

                    <div>
                      <p className="text-sm font-semibold mb-3">Detected Emotions</p>
                      <div className="space-y-3">
                        {sentiment.emotions.map((emotion, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium capitalize">{emotion.name}</span>
                              <span className="text-sm text-muted-foreground">{emotion.intensity}%</span>
                            </div>
                            <div className="relative h-2 bg-secondary rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${emotion.intensity}%` }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className={`h-full ${getEmotionColor(emotion.name)} rounded-full`}
                              />
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </Card>

                  <div>
                    <h3 className="text-xl font-bold mb-4">Suggested Emojis for This Sentiment</h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                      {sentiment.suggestedEmojis.map((suggestion, index) => (
                        <motion.div
                          key={suggestion.emoji.codepoint}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card className="p-5 hover:shadow-lg transition-all border-2 hover:border-primary/30">
                            <div className="flex items-start gap-4">
                              <button
                                onClick={() => onSelectEmoji(suggestion.emoji)}
                                className="text-5xl hover:scale-110 transition-transform flex-shrink-0"
                              >
                                {suggestion.emoji.emoji}
                              </button>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h4 className="font-semibold text-lg leading-tight">
                                    {suggestion.emoji.name}
                                  </h4>
                                  <Badge variant="secondary" className="text-xs">
                                    {suggestion.relevance}/10
                                  </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground mb-3">
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
                  </div>

                  <div className="flex justify-center pt-4">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => {
                        setSentiment(null)
                        setPrompt('')
                      }}
                      className="gap-2"
                    >
                      <Brain size={20} weight="fill" />
                      Analyze Another Text
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>

          <TabsContent value="combinations" className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Discover Popular Emoji Combinations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    AI will generate creative emoji combinations that tell a story or express complex ideas
                  </p>
                </div>

                <Button
                  onClick={handleGenerateCombinations}
                  disabled={isLoading}
                  className="gap-2 bg-primary hover:bg-primary/90 w-full sm:w-auto"
                  size="lg"
                >
                  <Palette weight="fill" size={20} />
                  {isLoading ? 'Generating...' : 'Generate Combinations'}
                </Button>
              </div>
            </Card>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-16 space-y-4">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  <Palette className="text-primary" weight="fill" size={48} />
                </motion.div>
                <p className="text-lg text-muted-foreground">Creating emoji combinations...</p>
              </div>
            )}

            <AnimatePresence mode="wait">
              {combinations.length > 0 && !isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">Emoji Combinations</h2>
                    <Badge variant="secondary" className="text-sm">
                      {combinations.length} combinations
                    </Badge>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {combinations.map((combination, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <Card className="p-5 hover:shadow-lg transition-all border-2 hover:border-primary/30">
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {combination.emojis.map((emoji, i) => (
                                  <button
                                    key={i}
                                    onClick={() => onSelectEmoji(emoji)}
                                    className="text-4xl hover:scale-110 transition-transform"
                                  >
                                    {emoji.emoji}
                                  </button>
                                ))}
                              </div>
                              <Badge 
                                variant={combination.popularity >= 8 ? "default" : "secondary"}
                                className="flex-shrink-0"
                              >
                                <Smiley size={14} className="mr-1" />
                                {combination.popularity}/10
                              </Badge>
                            </div>

                            <div>
                              <h4 className="font-semibold text-lg mb-1">{combination.meaning}</h4>
                              <p className="text-sm text-muted-foreground">{combination.usage}</p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="default"
                                className="gap-1.5 flex-1"
                                onClick={() => handleCopyCombination(combination.emojis.map(e => e.emoji).join(''))}
                              >
                                <Copy size={16} weight="bold" />
                                Copy All
                              </Button>
                              {combination.emojis.map((emoji, i) => (
                                <Button
                                  key={i}
                                  size="sm"
                                  variant="outline"
                                  onClick={() => onToggleFavorite(emoji.codepoint)}
                                >
                                  <Heart
                                    size={16}
                                    weight={favorites.includes(emoji.codepoint) ? 'fill' : 'regular'}
                                    className={favorites.includes(emoji.codepoint) ? 'text-destructive' : ''}
                                  />
                                </Button>
                              ))}
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
                      onClick={handleGenerateCombinations}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      <Palette size={20} weight="fill" />
                      Generate More
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
