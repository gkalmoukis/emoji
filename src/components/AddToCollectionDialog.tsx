import { useState } from 'react'
import { FolderOpen, Check } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import type { Collection } from '@/lib/collections'

interface AddToCollectionDialogProps {
  emojiCodepoint: string
  collections: Collection[]
  onAddToCollection: (collectionId: string, emojiCodepoint: string) => void
  onRemoveFromCollection: (collectionId: string, emojiCodepoint: string) => void
  trigger?: React.ReactNode
}

export default function AddToCollectionDialog({
  emojiCodepoint,
  collections,
  onAddToCollection,
  onRemoveFromCollection,
  trigger,
}: AddToCollectionDialogProps) {
  const [open, setOpen] = useState(false)

  const isInCollection = (collectionId: string) => {
    const collection = collections.find((c) => c.id === collectionId)
    return collection?.emojiCodepoints.includes(emojiCodepoint) || false
  }

  const handleToggle = (collectionId: string) => {
    if (isInCollection(collectionId)) {
      onRemoveFromCollection(collectionId, emojiCodepoint)
    } else {
      onAddToCollection(collectionId, emojiCodepoint)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FolderOpen className="mr-2" size={16} />
            Add to Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Select collections to add this emoji to
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[400px] py-4">
          {collections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen size={48} className="mx-auto mb-2 opacity-50" />
              <p className="mb-4">No collections yet</p>
              <p className="text-sm">Create a collection to organize your emojis</p>
            </div>
          ) : (
            <div className="space-y-2">
              {collections.map((collection) => {
                const inCollection = isInCollection(collection.id)
                return (
                  <button
                    key={collection.id}
                    onClick={() => handleToggle(collection.id)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-10 w-10 rounded-md flex items-center justify-center text-xl"
                        style={{ backgroundColor: collection.color }}
                      >
                        {collection.emoji}
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{collection.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {collection.emojiCodepoints.length} emoji{collection.emojiCodepoints.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {inCollection && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check size={14} className="text-primary-foreground" weight="bold" />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
