import { ArrowLeft, Plus, FolderOpen, Trash } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import type { Collection } from '@/lib/collections'
import { EMOJIS } from '@/lib/emoji-data'
import CollectionDialog, { ManageCollectionsDialog } from './CollectionDialog'

interface CollectionsIndexPageProps {
  collections: Collection[]
  onCreateCollection: (name: string, emoji: string, color: string) => void
  onDeleteCollection: (id: string) => void
  onSelectCollection: (collection: Collection) => void
  onBack: () => void
}

export default function CollectionsIndexPage({ 
  collections, 
  onCreateCollection,
  onDeleteCollection,
  onSelectCollection,
  onBack
}: CollectionsIndexPageProps) {
  return (
    <div className="container mx-auto px-6 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-4xl font-bold text-foreground tracking-tight">
              Collections
            </h1>
            <p className="text-muted-foreground mt-1">
              Organize your emojis into custom groups
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <CollectionDialog onCreateCollection={onCreateCollection} />
          <ManageCollectionsDialog 
            collections={collections}
            onDeleteCollection={onDeleteCollection}
          />
        </div>
      </div>

      {collections.length === 0 ? (
        <div className="text-center py-16">
          <div className="mb-4 text-6xl">📁</div>
          <h2 className="text-2xl font-bold mb-2">No collections yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first collection to organize your favorite emojis
          </p>
          <CollectionDialog 
            onCreateCollection={onCreateCollection}
            trigger={
              <Button size="lg">
                <Plus className="mr-2" />
                Create Collection
              </Button>
            }
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {collections.map((collection) => {
            const emojiCount = collection.emojiCodepoints.length
            const previewEmojis = collection.emojiCodepoints
              .slice(0, 4)
              .map(codepoint => EMOJIS.find(e => e.codepoint === codepoint))
              .filter(Boolean)

            return (
              <Card
                key={collection.id}
                className="cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg active:scale-95 overflow-hidden"
                onClick={() => onSelectCollection(collection)}
              >
                <div 
                  className="h-24 flex items-center justify-center text-4xl relative"
                  style={{ backgroundColor: collection.color }}
                >
                  <span className="text-white drop-shadow-md">{collection.emoji}</span>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-bold text-lg mb-1 truncate">{collection.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {emojiCount} {emojiCount === 1 ? 'emoji' : 'emojis'}
                  </p>
                  {previewEmojis.length > 0 && (
                    <div className="flex gap-1">
                      {previewEmojis.map((emoji) => (
                        <span key={emoji!.codepoint} className="text-2xl">
                          {emoji!.emoji}
                        </span>
                      ))}
                      {emojiCount > 4 && (
                        <span className="text-sm text-muted-foreground self-end ml-1">
                          +{emojiCount - 4}
                        </span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
