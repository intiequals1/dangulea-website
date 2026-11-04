import { useState } from 'react'

export type ShareArticle = { title: string; url: string; storyImage: string }

export default function NewsShare({ article }: { article: ShareArticle }) {
  const [status, setStatus] = useState('')
  const [showLink, setShowLink] = useState(false)
  async function copyLink() {
    try {
      await navigator.clipboard.writeText(article.url)
      setStatus('Artikel-Link kopiert.')
    } catch {
      setShowLink(true)
      setStatus('Bitte den Artikel-Link unten markieren und kopieren.')
    }
  }
  async function share() {
    if (navigator.share) {
      try { await navigator.share({ title: article.title, url: article.url }); return }
      catch (error) { if (error instanceof Error && error.name === 'AbortError') return }
    }
    await copyLink()
  }
  return (
    <div className="news-share" aria-label={`Artikel teilen: ${article.title}`}>
      <div className="news-share-actions">
        <button type="button" data-share-url={article.url} onClick={share}>Teilen</button>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(article.url)}`} target="_blank" rel="noopener noreferrer">LinkedIn</a>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(article.url)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
        <a href={article.storyImage} download={`dangulea-${article.url.split('/').filter(Boolean).slice(-2).join('-')}-story.png`}>Story-Bild speichern</a>
        <button type="button" onClick={copyLink}>Artikel-Link kopieren</button>
      </div>
      <p className="news-story-help">Für Instagram: Story-Bild speichern und den Artikel-Link als Link-Sticker einfügen.</p>
      <p role="status" aria-live="polite">{status}</p>
      {showLink && <input aria-label="Artikel-Link zum Kopieren" readOnly value={article.url} onFocus={event => event.currentTarget.select()} />}
    </div>
  )
}
