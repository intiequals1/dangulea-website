import { useEffect, useRef, useState } from 'react'
import { copyStoryLink, handOffStory, storyImageCache } from '../utils/storyShare'

export type ShareArticle = { title: string; url: string; storyImage: string }

export default function NewsShare({ article }: { article: ShareArticle }) {
  const [status, setStatus] = useState('')
  const [showLink, setShowLink] = useState(false)
  const [storyPreview, setStoryPreview] = useState(false)
  const [preparing, setPreparing] = useState(false)
  const [sharingStory, setSharingStory] = useState(false)
  const [prepared, setPrepared] = useState<{ path: string; file: File } | null>(null)
  const storyButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const button = storyButton.current
    if (!button || typeof navigator.share !== 'function' || typeof navigator.canShare !== 'function') return
    let active = true
    let visible = false
    const prepare = () => {
      visible = true
      setPreparing(true)
      storyImageCache.prepare(article.storyImage).then(file => {
        if (active && visible) setPrepared({ path: article.storyImage, file })
      }).catch(() => {}).finally(() => { if (active) setPreparing(false) })
    }
    if (!('IntersectionObserver' in window)) {
      // Still prepare without blocking a click on older browsers.
      void storyImageCache.prepare(article.storyImage).then(file => {
        if (active) setPrepared({ path: article.storyImage, file })
      }).catch(() => {})
      return () => { active = false }
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) prepare()
      else { visible = false; setPrepared(null) }
    }, { rootMargin: '200px' })
    observer.observe(button)
    return () => { active = false; observer.disconnect() }
  }, [article.storyImage])

  async function shareStory() {
    if (preparing || sharingStory) return
    const file = prepared?.path === article.storyImage ? prepared.file : null
    if (typeof navigator.share === 'function' && typeof navigator.canShare === 'function' && !file) {
      setPreparing(true)
      try {
        const ready = await storyImageCache.prepare(article.storyImage)
        setPrepared({ path: article.storyImage, file: ready })
        setStatus('Story-Bild ist bereit. Bitte zum Teilen erneut auf „Story teilen“ tippen.')
      } catch {
        setStatus('Story-Bild konnte nicht vorbereitet werden. Bitte erneut versuchen.')
      } finally { setPreparing(false) }
      return
    }
    setStoryPreview(false)
    setSharingStory(true)
    const result = file ? await handOffStory(article, file, navigator) : { outcome: 'unsupported', copied: false }
    setSharingStory(false)
    if (result.outcome === 'cancelled') { setStatus('Teilen abgebrochen.'); return }
    if (result.outcome === 'shared') {
      setStatus(result.copied ? 'Bild und Artikellink an das Teilen-Menü übergeben. Link zusätzlich kopiert – in Instagram als Link-Sticker einfügen.' : 'Bild und Artikellink an das Teilen-Menü übergeben. Falls Instagram den Link nicht übernimmt, den Artikel-Link kopieren und als Link-Sticker einfügen.')
      if (!result.copied) setShowLink(true)
      return
    }
    const copied = result.copied || await copyStoryLink(article.url, navigator)
    setStoryPreview(true)
    setShowLink(true)
    setStatus(`${result.outcome === 'unsupported' ? 'Dieses Gerät unterstützt das direkte Teilen des Story-Bildes nicht.' : 'Das Story-Bild konnte nicht an das Teilen-Menü übergeben werden.'} ${copied ? 'Artikel-Link kopiert.' : 'Den Artikel-Link unten markieren und kopieren.'}`)
  }
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
        <button ref={storyButton} type="button" data-story-image={article.storyImage} data-story-url={article.url} disabled={preparing || sharingStory} onClick={shareStory}>{preparing ? 'Story wird vorbereitet…' : sharingStory ? 'Teilen-Menü geöffnet…' : 'Story teilen'}</button>
        <button type="button" onClick={copyLink}>Artikel-Link kopieren</button>
      </div>
      <p className="news-story-help">Story-Bild und Artikellink direkt teilen. Für einen anklickbaren Link in Instagram den Link-Sticker ergänzen.</p>
      <p role="status" aria-live="polite">{status}</p>
      {showLink && <input aria-label="Artikel-Link zum Kopieren" readOnly value={article.url} onFocus={event => event.currentTarget.select()} />}
      {storyPreview && <div className="news-story-preview"><p>Die Story liegt online bereit. Auf einem unterstützten Smartphone kannst du sie direkt teilen.</p><a href={article.storyImage} target="_blank" rel="noopener noreferrer">Story-Bild öffnen</a><img src={article.storyImage} width="1080" height="1920" alt={`Story zu: ${article.title}`} loading="lazy" /></div>}
      <noscript><a href={article.storyImage}>Story-Bild öffnen</a></noscript>
    </div>
  )
}
