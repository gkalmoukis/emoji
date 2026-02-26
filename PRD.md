# Planning Guide

A lightweight, user-friendly emoji discovery and selection tool that makes finding and copying the perfect emoji quick and delightful.

**Experience Qualities**:
1. **Instant** - Search and filtering feel immediate with no delays, making emoji discovery fluid and responsive
2. **Playful** - Emojis are fun by nature; the interface should reflect that joy with vibrant colors and smooth interactions
3. **Focused** - Each page has a single clear purpose: browse/search or examine an emoji in detail

**Complexity Level**: Light Application (multiple features with basic state)
This is a focused tool with two main views (browse and detail), search/filter functionality, and basic actions like copy and share. It maintains minimal state and doesn't require complex data relationships or authentication flows.

## Essential Features

### Search Functionality
- **Functionality**: Real-time text search that filters emojis by name, keywords, and description
- **Purpose**: Users can quickly find specific emojis without scrolling through hundreds of options
- **Trigger**: User types in the search input field on the index page
- **Progression**: User types text → Results filter instantly → Matching emojis display → User clicks emoji → Navigate to detail page
- **Success criteria**: Search returns relevant results within 100ms, supports partial matching, and searches across multiple emoji properties

### Category Filtering
- **Functionality**: Clickable category chips that filter emojis by type (smileys, animals, food, etc.)
- **Purpose**: Allows users to browse emojis by theme when they don't have a specific search term
- **Trigger**: User clicks on a category chip
- **Progression**: User clicks category → Chip activates with visual feedback → Grid filters to category → User can add multiple categories → X button removes individual filters
- **Success criteria**: Multiple categories can be selected simultaneously, active chips are visually distinct, and filters combine properly (OR logic)

### Emoji Detail View
- **Functionality**: Dedicated page showing emoji in large preview with metadata, skin tone variants, and action buttons
- **Purpose**: Lets users examine an emoji closely, select tone variants, and perform copy/share actions
- **Trigger**: User clicks any emoji from the grid
- **Progression**: Click emoji → Navigate to detail page → Large preview displays → Select tone variant (if applicable) → Preview updates → Click copy/share action → Confirmation feedback
- **Success criteria**: Tone variants display correctly, copy action works on all browsers, share uses native API when available, user receives clear confirmation of actions

### Copy Actions
- **Functionality**: One-click copying of the emoji character or its unicode codepoint to clipboard
- **Purpose**: The primary user goal - getting the emoji into their clipboard for use elsewhere
- **Trigger**: User clicks "Copy" or "Copy Code" button
- **Progression**: Click copy button → Emoji/code copied to clipboard → Toast notification confirms → Button shows temporary success state
- **Success criteria**: Clipboard API works reliably, toast appears within 100ms, users understand what was copied

### Share Functionality
- **Functionality**: Share button that opens native share dialog or copies shareable link
- **Purpose**: Allows users to send specific emoji pages to others
- **Trigger**: User clicks share button on detail page
- **Progression**: Click share → Check if native share available → Open share dialog OR copy link → Toast confirms action
- **Success criteria**: Uses Web Share API on mobile, falls back gracefully on desktop, shared links work correctly

### Emoji Favoriting
- **Functionality**: Users can mark emojis as favorites with a heart icon, creating a personalized collection
- **Purpose**: Quick access to frequently used or preferred emojis without searching
- **Trigger**: User clicks heart icon on emoji grid or detail page
- **Progression**: Click heart → Emoji added to favorites (persistent) → Heart fills with animation → Toast confirms → Favorites section updates
- **Success criteria**: Favorites persist across sessions, heart icon shows correct state, users can unfavorite easily, favorites appear in dedicated section on index page

### Recent History
- **Functionality**: Automatically tracks the last 20 emojis viewed by the user
- **Purpose**: Allows users to quickly return to previously viewed emojis
- **Trigger**: User clicks any emoji to view detail page
- **Progression**: View emoji detail → Emoji added to recent history → Recent section updates on index page → Older entries automatically removed when limit reached
- **Success criteria**: History persists across sessions, displays in reverse chronological order (newest first), automatically manages 20-item limit

## Edge Case Handling
- **Empty Search Results**: Show friendly message with emoji suggesting to try different keywords or clear filters
- **No Category Match**: Display all emojis when no categories are selected (default state)
- **Clipboard API Unavailable**: Fallback to alternate copy method with clear user feedback
- **Missing Emoji Data**: Graceful degradation if emoji metadata is incomplete
- **URL with Invalid Emoji**: Redirect to index page with toast notification
- **Multiple Rapid Clicks**: Debounce/disable buttons briefly to prevent action spam

## Design Direction
The design should feel modern, vibrant, and approachable - celebrating the playful nature of emojis while maintaining excellent usability. The interface should have personality with bold colors and smooth interactions, making emoji discovery feel like browsing a curated collection rather than searching through a database.

## Color Selection
A vibrant, warm palette that reflects the joyful and expressive nature of emojis.

- **Primary Color**: Warm Orange/Coral (oklch(0.68 0.19 35)) - Energetic and friendly, perfect for representing the expressiveness of emojis
- **Secondary Colors**: 
  - Soft Peach background (oklch(0.98 0.015 45)) for cards and surfaces
  - Deep Purple (oklch(0.35 0.12 290)) for text and UI elements providing strong contrast
- **Accent Color**: Bright Magenta (oklch(0.62 0.24 340)) - Eye-catching for interactive elements like active filters and primary actions
- **Foreground/Background Pairings**:
  - Primary (Warm Orange oklch(0.68 0.19 35)): White text (oklch(0.99 0 0)) - Ratio 4.9:1 ✓
  - Accent (Bright Magenta oklch(0.62 0.24 340)): White text (oklch(0.99 0 0)) - Ratio 5.2:1 ✓
  - Background (Soft Peach oklch(0.98 0.015 45)): Deep Purple text (oklch(0.35 0.12 290)) - Ratio 8.1:1 ✓
  - Secondary (Deep Purple oklch(0.35 0.12 290)): White text (oklch(0.99 0 0)) - Ratio 10.5:1 ✓

## Font Selection
Typography should feel contemporary and slightly playful without sacrificing readability - approachable enough for a fun tool, clean enough for functional use.

- **Primary Typeface**: DM Sans - A geometric sans-serif that's friendly and modern with excellent readability
- **Typographic Hierarchy**:
  - H1 (Page Title): DM Sans Bold/32px/tight tracking
  - H2 (Emoji Name on Detail): DM Sans Bold/24px/normal tracking
  - Body (Search, Labels): DM Sans Regular/16px/relaxed line-height
  - Caption (Metadata, Code): DM Sans Medium/14px/normal tracking
  - Emoji Display: System emoji fonts at 64px (grid) and 120px (detail page)

## Animations
Animations should feel snappy and responsive, providing immediate feedback for interactions while adding moments of delight when users discover or copy emojis.

- **Search/Filter Results**: Smooth fade-in with slight stagger (50ms delay between items) as results appear
- **Category Chips**: Gentle scale (1.05) on hover, spring animation on selection
- **Emoji Grid Items**: Subtle lift on hover (translateY -2px) with soft shadow
- **Copy Action**: Button "pop" (scale 0.95) on click, then success checkmark fade-in
- **Toast Notifications**: Slide up from bottom with bounce easing
- **Page Transitions**: Smooth fade between index and detail pages
- **Tone Selector**: Highlight active tone with smooth color transition

## Component Selection
- **Components**:
  - **Input**: Search field with clear button (Shadcn Input component with custom clear icon)
  - **Badge**: Category filter chips (Shadcn Badge with variant styling for active/inactive states)
  - **Card**: Container for emoji grid items (Shadcn Card with hover effects)
  - **Button**: All action buttons - copy, share, back navigation (Shadcn Button with variants)
  - **Separator**: Visual breaks between sections on detail page (Shadcn Separator)
  - **Toast**: Action confirmations (Sonner for copy/share feedback)
  - **Tabs**: Organize tone variants when available (Shadcn Tabs)
  
- **Customizations**:
  - **Emoji Grid**: Custom responsive grid layout with CSS Grid (auto-fill minmax pattern)
  - **Category Filter Bar**: Custom horizontal scrollable container with Tailwind utilities
  - **Tone Selector**: Custom button group with emoji previews as buttons
  - **Code Display**: Custom monospace text display with copy button inline
  
- **States**:
  - **Search Input**: Border accent on focus, clear icon appears when text present
  - **Category Badges**: Active state with accent background and white text, inactive with muted colors
  - **Emoji Cards**: Subtle border on rest, lift effect and shadow on hover, pressed state on click
  - **Action Buttons**: Primary button style for copy, ghost for secondary actions, disabled state during actions
  - **Tone Buttons**: Outlined with transparent background, filled with accent when selected
  
- **Icon Selection**:
  - **MagnifyingGlass**: Search input indicator
  - **X**: Clear search, remove category chips
  - **Copy**: Main copy action
  - **Code**: Copy unicode action  
  - **Share**: Share functionality
  - **ArrowLeft**: Back to index navigation
  - **Check**: Success confirmation in toasts
  
- **Spacing**:
  - Container padding: p-6 (mobile) → p-8 (tablet) → p-12 (desktop)
  - Grid gap: gap-3 (mobile) → gap-4 (desktop)
  - Section spacing: space-y-6 for main sections
  - Button padding: px-4 py-2 for standard buttons, p-3 for icon-only
  - Card padding: p-4 for emoji cards, p-6 for detail content
  
- **Mobile**:
  - Search bar stacks above category filters on mobile (<640px)
  - Emoji grid: 4 columns mobile → 6 tablet → 8 desktop (auto-fill with min 80px)
  - Category chips: Horizontal scroll with snap points on mobile
  - Detail page: Single column layout, tone selector wraps naturally
  - Action buttons: Stack vertically on very small screens (<400px), otherwise inline
  - Bottom padding for mobile keyboards/safe areas
