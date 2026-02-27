import { useState } from 'react'
import { Plus, FolderOpen, Trash, X } from '@phosphor-icons/react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { DEFAULT_COLLECTION_COLORS, DEFAULT_COLLECTION_EMOJIS } from '@/lib/collections'

interface CollectionDialogProps {
  onCreateCollection: (name: string, emoji: string, color: string) => void
  trigger?: React.ReactNode
}

export default function CollectionDialog({ onCreateCollection, trigger }: CollectionDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState(DEFAULT_COLLECTION_EMOJIS[0])
  const [selectedColor, setSelectedColor] = useState(DEFAULT_COLLECTION_COLORS[0])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onCreateCollection(name.trim(), selectedEmoji, selectedColor)
      setName('')
      setSelectedEmoji(DEFAULT_COLLECTION_EMOJIS[0])
      setSelectedColor(DEFAULT_COLLECTION_COLORS[0])
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2" />
            New Collection
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Collection</DialogTitle>
            <DialogDescription>
              Organize your favorite emojis into custom collections
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-5 py-4">
            <div className="space-y-2">
              <Label htmlFor="collection-name">Collection Name</Label>
              <Input
                id="collection-name"
                placeholder="e.g., Work, Fun, Reactions"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label>Collection Icon</Label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_COLLECTION_EMOJIS.map((emoji) => (
                  <Button
                    key={emoji}
                    type="button"
                    variant={selectedEmoji === emoji ? 'default' : 'outline'}
                    className="text-2xl h-12 w-12 p-0"
                    onClick={() => setSelectedEmoji(emoji)}
                  >
                    {emoji}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Collection Color</Label>
              <div className="flex flex-wrap gap-2">
                {DEFAULT_COLLECTION_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="h-10 w-10 rounded-md border-2 transition-all hover:scale-110"
                    style={{
                      backgroundColor: color,
                      borderColor: selectedColor === color ? 'oklch(0.10 0.005 240)' : 'transparent',
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={!name.trim()}>
              <FolderOpen className="mr-2" />
              Create Collection
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface ManageCollectionsDialogProps {
  collections: Array<{ id: string; name: string; emoji: string; color: string }>
  onDeleteCollection: (id: string) => void
  trigger?: React.ReactNode
}

export function ManageCollectionsDialog({ collections, onDeleteCollection, trigger }: ManageCollectionsDialogProps) {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <FolderOpen className="mr-2" />
            Manage Collections
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Collections</DialogTitle>
          <DialogDescription>
            View and delete your emoji collections
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {collections.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen size={48} className="mx-auto mb-2 opacity-50" />
              <p>No collections yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {collections.map((collection) => (
                <div
                  key={collection.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-10 w-10 rounded-md flex items-center justify-center text-xl"
                      style={{ backgroundColor: collection.color }}
                    >
                      {collection.emoji}
                    </div>
                    <span className="font-medium">{collection.name}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onDeleteCollection(collection.id)}
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
