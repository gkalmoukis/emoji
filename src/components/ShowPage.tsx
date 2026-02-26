import { useState } from 'react'
import { ArrowLeft, Copy, Code, Share } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { SKIN_TONES, type Emoji } from '@/lib/emoji-data'

interface ShowPageProps {
  emoji: Emoji
  onBack: () => void
}

export default function ShowPage({ emoji, onBack }: ShowPageProps) {
  const [selectedTone, setSelectedTone] = useState(0)

  const displayEmoji = emoji.hasSkinTone
    ? emoji.emoji + (SKIN_TONES[selectedTone].modifier || '')
    : emoji.emoji

  const copyEmoji = async () => {
    try {
      await navigator.clipboard.writeText(displayEmoji)
      toast.success('Emoji copied to clipboard!')
    } catch {
      toast.error('Failed to copy emoji')
    }
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(emoji.codepoint)
      toast.success('Unicode copied to clipboard!')
    } catch {
      toast.error('Failed to copy code')
    }
  }

  const shareEmoji = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: emoji.name,
          text: `Check out this emoji: ${displayEmoji} - ${emoji.name}`,
        })
      } catch {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Link copied to clipboard!')
      }
    } else {
      await navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  return (
    <div className="container mx-auto px-6 py-8 max-w-5xl">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        <ArrowLeft className="mr-2" />
        Back
      </Button>

      <div className="space-y-6">
        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="text-9xl mb-4">{displayEmoji}</div>
            <h1 className="text-3xl font-bold mb-2">{emoji.name}</h1>
            <p className="text-muted-foreground font-mono text-sm">
              {emoji.codepoint}
            </p>
          </div>

          <Separator className="my-6" />

          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                Category
              </h3>
              <p className="text-foreground">{emoji.category}</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2 text-sm text-muted-foreground">
                Keywords
              </h3>
              <p className="text-foreground">{emoji.keywords.join(', ')}</p>
            </div>

            {emoji.hasSkinTone && (
              <div>
                <h3 className="font-semibold mb-3 text-sm text-muted-foreground">
                  Skin Tone
                </h3>
                <div className="flex flex-wrap gap-2">
                  {SKIN_TONES.map((tone, index) => (
                    <Button
                      key={index}
                      variant={selectedTone === index ? 'default' : 'outline'}
                      className={`text-3xl h-14 ${
                        selectedTone === index ? 'bg-accent' : ''
                      }`}
                      onClick={() => setSelectedTone(index)}
                    >
                      {emoji.emoji + (tone.modifier || '')}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <Separator className="my-6" />

            <div className="flex flex-wrap gap-3">
              <Button onClick={copyEmoji} size="lg" className="flex-1 min-w-fit">
                <Copy className="mr-2" />
                Copy Emoji
              </Button>
              <Button
                onClick={copyCode}
                variant="secondary"
                size="lg"
                className="flex-1 min-w-fit"
              >
                <Code className="mr-2" />
                Copy Code
              </Button>
              <Button
                onClick={shareEmoji}
                variant="outline"
                size="lg"
                className="flex-1 min-w-fit"
              >
                <Share className="mr-2" />
                Share
              </Button>
            </div>
          </div>
        </Card>

        {emoji.meaning && (
          <Card>
            <CardHeader>
              <CardTitle>Emoji Meaning</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground leading-relaxed">{emoji.meaning}</p>
            </CardContent>
          </Card>
        )}

        {emoji.designs && emoji.designs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Emoji Designs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {emoji.designs.map((design, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="text-5xl">{design.image}</div>
                    <p className="text-xs text-muted-foreground text-center">
                      {design.platform}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Technical Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-1 text-sm text-muted-foreground">
                    Emoji
                  </h3>
                  <p className="text-foreground text-2xl">{displayEmoji}</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-1 text-sm text-muted-foreground">
                    Codepoints
                  </h3>
                  <p className="text-foreground font-mono">{emoji.codepoint}</p>
                </div>

                {emoji.unicodeName && (
                  <div>
                    <h3 className="font-semibold mb-1 text-sm text-muted-foreground">
                      Unicode Name
                    </h3>
                    <p className="text-foreground">{emoji.unicodeName}</p>
                  </div>
                )}

                {emoji.appleName && (
                  <div>
                    <h3 className="font-semibold mb-1 text-sm text-muted-foreground">
                      Apple Name
                    </h3>
                    <p className="text-foreground">{emoji.appleName}</p>
                  </div>
                )}

                {emoji.alsoKnownAs && (
                  <div>
                    <h3 className="font-semibold mb-1 text-sm text-muted-foreground">
                      Also Known As
                    </h3>
                    <p className="text-foreground">{emoji.alsoKnownAs}</p>
                  </div>
                )}

                {emoji.shortcodes && (
                  <div>
                    <h3 className="font-semibold mb-1 text-sm text-muted-foreground">
                      Shortcodes
                    </h3>
                    <p className="text-foreground font-mono">{emoji.shortcodes}</p>
                  </div>
                )}

                {emoji.proposals && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold mb-1 text-sm text-muted-foreground">
                      Proposals
                    </h3>
                    <p className="text-foreground">{emoji.proposals}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
