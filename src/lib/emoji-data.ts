export interface Emoji {
  emoji: string
  name: string
  category: string
  keywords: string[]
  codepoint: string
  hasSkinTone?: boolean
  meaning?: string
  designs?: EmojiDesign[]
  unicodeName?: string
  appleName?: string
  alsoKnownAs?: string
  shortcodes?: string
  proposals?: string
}

export interface EmojiDesign {
  platform: string
  image: string
}

export const CATEGORIES = [
  'Smileys',
  'Gestures',
  'Animals',
  'Food',
  'Travel',
  'Activities',
  'Objects',
  'Symbols'
]

export const EMOJIS: Emoji[] = [
  { 
    emoji: '😀', 
    name: 'Grinning Face', 
    category: 'Smileys', 
    keywords: ['smile', 'happy', 'joy'], 
    codepoint: 'U+1F600',
    unicodeName: 'GRINNING FACE',
    appleName: 'Grinning Face',
    alsoKnownAs: 'Happy Face, Smiley Face',
    shortcodes: ':grinning:',
    meaning: 'A classic happy face expressing joy, excitement, or general positivity. Often used to convey cheerfulness or friendliness in conversations.',
    designs: [
      { platform: 'Apple', image: '😀' },
      { platform: 'Google', image: '😀' },
      { platform: 'Samsung', image: '😀' },
      { platform: 'Microsoft', image: '😀' },
      { platform: 'Twitter', image: '😀' },
      { platform: 'Facebook', image: '😀' }
    ],
    proposals: 'Unicode 6.1 (2012)'
  },
  { emoji: '😃', name: 'Grinning Face with Big Eyes', category: 'Smileys', keywords: ['smile', 'happy'], codepoint: 'U+1F603' },
  { emoji: '😄', name: 'Grinning Face with Smiling Eyes', category: 'Smileys', keywords: ['smile', 'happy', 'joy'], codepoint: 'U+1F604' },
  { emoji: '😁', name: 'Beaming Face with Smiling Eyes', category: 'Smileys', keywords: ['smile', 'happy'], codepoint: 'U+1F601' },
  { emoji: '😊', name: 'Smiling Face with Smiling Eyes', category: 'Smileys', keywords: ['smile', 'blush'], codepoint: 'U+1F60A' },
  { emoji: '😍', name: 'Smiling Face with Heart-Eyes', category: 'Smileys', keywords: ['love', 'heart', 'like'], codepoint: 'U+1F60D' },
  { emoji: '🥰', name: 'Smiling Face with Hearts', category: 'Smileys', keywords: ['love', 'like', 'affection'], codepoint: 'U+1F970' },
  { emoji: '😘', name: 'Face Blowing a Kiss', category: 'Smileys', keywords: ['kiss', 'love'], codepoint: 'U+1F618' },
  { emoji: '😂', name: 'Face with Tears of Joy', category: 'Smileys', keywords: ['laugh', 'lol', 'funny'], codepoint: 'U+1F602' },
  { emoji: '🤣', name: 'Rolling on the Floor Laughing', category: 'Smileys', keywords: ['laugh', 'lol', 'rofl'], codepoint: 'U+1F923' },
  { emoji: '😎', name: 'Smiling Face with Sunglasses', category: 'Smileys', keywords: ['cool', 'swagger'], codepoint: 'U+1F60E' },
  { emoji: '🤔', name: 'Thinking Face', category: 'Smileys', keywords: ['think', 'hmm', 'consider'], codepoint: 'U+1F914' },
  { emoji: '😴', name: 'Sleeping Face', category: 'Smileys', keywords: ['sleep', 'zzz', 'tired'], codepoint: 'U+1F634' },
  { emoji: '😢', name: 'Crying Face', category: 'Smileys', keywords: ['sad', 'cry', 'tear'], codepoint: 'U+1F622' },
  { emoji: '😭', name: 'Loudly Crying Face', category: 'Smileys', keywords: ['cry', 'sad', 'tears'], codepoint: 'U+1F62D' },
  { emoji: '😱', name: 'Face Screaming in Fear', category: 'Smileys', keywords: ['scared', 'shock', 'scream'], codepoint: 'U+1F631' },
  { emoji: '🤯', name: 'Exploding Head', category: 'Smileys', keywords: ['mind blown', 'shock'], codepoint: 'U+1F92F' },
  { emoji: '😡', name: 'Enraged Face', category: 'Smileys', keywords: ['angry', 'mad', 'rage'], codepoint: 'U+1F621' },
  
  { emoji: '👍', name: 'Thumbs Up', category: 'Gestures', keywords: ['like', 'yes', 'approve'], codepoint: 'U+1F44D', hasSkinTone: true },
  { emoji: '👎', name: 'Thumbs Down', category: 'Gestures', keywords: ['dislike', 'no'], codepoint: 'U+1F44E', hasSkinTone: true },
  { emoji: '👋', name: 'Waving Hand', category: 'Gestures', keywords: ['hello', 'hi', 'bye'], codepoint: 'U+1F44B', hasSkinTone: true },
  { emoji: '🤚', name: 'Raised Back of Hand', category: 'Gestures', keywords: ['hand', 'stop'], codepoint: 'U+1F91A', hasSkinTone: true },
  { emoji: '✋', name: 'Raised Hand', category: 'Gestures', keywords: ['hand', 'stop', 'high five'], codepoint: 'U+270B', hasSkinTone: true },
  { emoji: '🙏', name: 'Folded Hands', category: 'Gestures', keywords: ['pray', 'thanks', 'please'], codepoint: 'U+1F64F', hasSkinTone: true },
  { emoji: '💪', name: 'Flexed Biceps', category: 'Gestures', keywords: ['strong', 'muscle', 'power'], codepoint: 'U+1F4AA', hasSkinTone: true },
  { emoji: '🤝', name: 'Handshake', category: 'Gestures', keywords: ['deal', 'agreement', 'shake'], codepoint: 'U+1F91D' },
  
  { emoji: '🐶', name: 'Dog Face', category: 'Animals', keywords: ['dog', 'puppy', 'pet'], codepoint: 'U+1F436' },
  { emoji: '🐱', name: 'Cat Face', category: 'Animals', keywords: ['cat', 'kitten', 'pet'], codepoint: 'U+1F431' },
  { emoji: '🐭', name: 'Mouse Face', category: 'Animals', keywords: ['mouse', 'rodent'], codepoint: 'U+1F42D' },
  { emoji: '🐰', name: 'Rabbit Face', category: 'Animals', keywords: ['bunny', 'rabbit'], codepoint: 'U+1F430' },
  { emoji: '🦊', name: 'Fox', category: 'Animals', keywords: ['fox', 'animal'], codepoint: 'U+1F98A' },
  { emoji: '🐻', name: 'Bear', category: 'Animals', keywords: ['bear', 'animal'], codepoint: 'U+1F43B' },
  { emoji: '🐼', name: 'Panda', category: 'Animals', keywords: ['panda', 'bear'], codepoint: 'U+1F43C' },
  { emoji: '🐨', name: 'Koala', category: 'Animals', keywords: ['koala', 'bear'], codepoint: 'U+1F428' },
  { emoji: '🐯', name: 'Tiger Face', category: 'Animals', keywords: ['tiger', 'cat'], codepoint: 'U+1F42F' },
  { emoji: '🦁', name: 'Lion', category: 'Animals', keywords: ['lion', 'king'], codepoint: 'U+1F981' },
  
  { emoji: '🍕', name: 'Pizza', category: 'Food', keywords: ['pizza', 'food', 'italian'], codepoint: 'U+1F355' },
  { emoji: '🍔', name: 'Hamburger', category: 'Food', keywords: ['burger', 'food', 'fast food'], codepoint: 'U+1F354' },
  { emoji: '🍟', name: 'French Fries', category: 'Food', keywords: ['fries', 'food'], codepoint: 'U+1F35F' },
  { emoji: '🌭', name: 'Hot Dog', category: 'Food', keywords: ['hotdog', 'food'], codepoint: 'U+1F32D' },
  { emoji: '🍿', name: 'Popcorn', category: 'Food', keywords: ['popcorn', 'snack', 'movie'], codepoint: 'U+1F37F' },
  { emoji: '🍩', name: 'Doughnut', category: 'Food', keywords: ['donut', 'sweet', 'dessert'], codepoint: 'U+1F369' },
  { emoji: '🍪', name: 'Cookie', category: 'Food', keywords: ['cookie', 'sweet'], codepoint: 'U+1F36A' },
  { emoji: '🎂', name: 'Birthday Cake', category: 'Food', keywords: ['cake', 'birthday'], codepoint: 'U+1F382' },
  { emoji: '🍰', name: 'Shortcake', category: 'Food', keywords: ['cake', 'dessert'], codepoint: 'U+1F370' },
  { emoji: '🍫', name: 'Chocolate Bar', category: 'Food', keywords: ['chocolate', 'sweet'], codepoint: 'U+1F36B' },
  
  { emoji: '✈️', name: 'Airplane', category: 'Travel', keywords: ['plane', 'travel', 'fly'], codepoint: 'U+2708' },
  { emoji: '🚗', name: 'Automobile', category: 'Travel', keywords: ['car', 'vehicle'], codepoint: 'U+1F697' },
  { emoji: '🚕', name: 'Taxi', category: 'Travel', keywords: ['taxi', 'car'], codepoint: 'U+1F695' },
  { emoji: '🚙', name: 'Sport Utility Vehicle', category: 'Travel', keywords: ['suv', 'car'], codepoint: 'U+1F699' },
  { emoji: '🚌', name: 'Bus', category: 'Travel', keywords: ['bus', 'vehicle'], codepoint: 'U+1F68C' },
  { emoji: '🚂', name: 'Locomotive', category: 'Travel', keywords: ['train', 'locomotive'], codepoint: 'U+1F682' },
  { emoji: '🚢', name: 'Ship', category: 'Travel', keywords: ['ship', 'boat'], codepoint: 'U+1F6A2' },
  { emoji: '🏠', name: 'House', category: 'Travel', keywords: ['home', 'house'], codepoint: 'U+1F3E0' },
  { emoji: '🏨', name: 'Hotel', category: 'Travel', keywords: ['hotel', 'building'], codepoint: 'U+1F3E8' },
  { emoji: '🏖️', name: 'Beach with Umbrella', category: 'Travel', keywords: ['beach', 'vacation'], codepoint: 'U+1F3D6' },
  
  { emoji: '⚽', name: 'Soccer Ball', category: 'Activities', keywords: ['soccer', 'football', 'sport'], codepoint: 'U+26BD' },
  { emoji: '🏀', name: 'Basketball', category: 'Activities', keywords: ['basketball', 'sport'], codepoint: 'U+1F3C0' },
  { emoji: '🏈', name: 'American Football', category: 'Activities', keywords: ['football', 'sport'], codepoint: 'U+1F3C8' },
  { emoji: '⚾', name: 'Baseball', category: 'Activities', keywords: ['baseball', 'sport'], codepoint: 'U+26BE' },
  { emoji: '🎮', name: 'Video Game', category: 'Activities', keywords: ['game', 'gaming', 'controller'], codepoint: 'U+1F3AE' },
  { emoji: '🎯', name: 'Bullseye', category: 'Activities', keywords: ['target', 'goal', 'dart'], codepoint: 'U+1F3AF' },
  { emoji: '🎨', name: 'Artist Palette', category: 'Activities', keywords: ['art', 'paint', 'creative'], codepoint: 'U+1F3A8' },
  { emoji: '🎬', name: 'Clapper Board', category: 'Activities', keywords: ['movie', 'film'], codepoint: 'U+1F3AC' },
  { emoji: '🎵', name: 'Musical Note', category: 'Activities', keywords: ['music', 'note'], codepoint: 'U+1F3B5' },
  { emoji: '🎸', name: 'Guitar', category: 'Activities', keywords: ['guitar', 'music'], codepoint: 'U+1F3B8' },
  
  { emoji: '💻', name: 'Laptop', category: 'Objects', keywords: ['computer', 'laptop', 'tech'], codepoint: 'U+1F4BB' },
  { emoji: '📱', name: 'Mobile Phone', category: 'Objects', keywords: ['phone', 'mobile', 'smartphone'], codepoint: 'U+1F4F1' },
  { emoji: '⌚', name: 'Watch', category: 'Objects', keywords: ['watch', 'time'], codepoint: 'U+231A' },
  { emoji: '📷', name: 'Camera', category: 'Objects', keywords: ['camera', 'photo'], codepoint: 'U+1F4F7' },
  { emoji: '💡', name: 'Light Bulb', category: 'Objects', keywords: ['idea', 'light', 'bulb'], codepoint: 'U+1F4A1' },
  { emoji: '📚', name: 'Books', category: 'Objects', keywords: ['books', 'reading'], codepoint: 'U+1F4DA' },
  { emoji: '✏️', name: 'Pencil', category: 'Objects', keywords: ['pencil', 'write'], codepoint: 'U+270F' },
  { emoji: '🔑', name: 'Key', category: 'Objects', keywords: ['key', 'unlock'], codepoint: 'U+1F511' },
  { emoji: '🎁', name: 'Wrapped Gift', category: 'Objects', keywords: ['gift', 'present'], codepoint: 'U+1F381' },
  { emoji: '🔔', name: 'Bell', category: 'Objects', keywords: ['bell', 'notification'], codepoint: 'U+1F514' },
  
  { emoji: '❤️', name: 'Red Heart', category: 'Symbols', keywords: ['heart', 'love'], codepoint: 'U+2764' },
  { emoji: '💙', name: 'Blue Heart', category: 'Symbols', keywords: ['heart', 'love', 'blue'], codepoint: 'U+1F499' },
  { emoji: '💚', name: 'Green Heart', category: 'Symbols', keywords: ['heart', 'love', 'green'], codepoint: 'U+1F49A' },
  { emoji: '💛', name: 'Yellow Heart', category: 'Symbols', keywords: ['heart', 'love', 'yellow'], codepoint: 'U+1F49B' },
  { emoji: '🔥', name: 'Fire', category: 'Symbols', keywords: ['fire', 'hot', 'flame'], codepoint: 'U+1F525' },
  { emoji: '⭐', name: 'Star', category: 'Symbols', keywords: ['star', 'favorite'], codepoint: 'U+2B50' },
  { emoji: '✨', name: 'Sparkles', category: 'Symbols', keywords: ['sparkle', 'shine'], codepoint: 'U+2728' },
  { emoji: '💯', name: 'Hundred Points', category: 'Symbols', keywords: ['100', 'perfect'], codepoint: 'U+1F4AF' },
  { emoji: '✅', name: 'Check Mark Button', category: 'Symbols', keywords: ['check', 'done', 'yes'], codepoint: 'U+2705' },
  { emoji: '❌', name: 'Cross Mark', category: 'Symbols', keywords: ['x', 'no', 'wrong'], codepoint: 'U+274C' },
]

export const SKIN_TONES = [
  { label: 'Default', modifier: '' },
  { label: 'Light', modifier: '🏻' },
  { label: 'Medium-Light', modifier: '🏼' },
  { label: 'Medium', modifier: '🏽' },
  { label: 'Medium-Dark', modifier: '🏾' },
  { label: 'Dark', modifier: '🏿' },
]
