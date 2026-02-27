export interface Collection {
  id: string
  name: string
  emoji: string
  color: string
  emojiCodepoints: string[]
  createdAt: number
}

export const DEFAULT_COLLECTION_COLORS = [
  'oklch(0.68 0.19 35)',
  'oklch(0.62 0.24 340)',
  'oklch(0.55 0.22 260)',
  'oklch(0.65 0.20 150)',
  'oklch(0.70 0.18 60)',
  'oklch(0.60 0.25 290)',
  'oklch(0.65 0.20 180)',
  'oklch(0.58 0.22 30)',
]

export const DEFAULT_COLLECTION_EMOJIS = [
  '📁', '⭐', '❤️', '🎨', '💼', '🎯', '🎮', '🎵', '🍕', '✈️', '💡', '🔥'
]
