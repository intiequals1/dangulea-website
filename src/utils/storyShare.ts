export type StoryArticle = { title: string; url: string; storyImage: string }
export type StoryResult = { outcome: 'shared' | 'cancelled' | 'unsupported' | 'failed'; copied: boolean }
type ShareDevice = Pick<Navigator, 'share' | 'canShare'> & { clipboard?: Pick<Clipboard, 'writeText'> }

export class StoryImageCache {
  private files = new Map<string, File>()
  private pending = new Map<string, Promise<File>>()
  private fetcher: typeof fetch
  private limit: number

  constructor(fetcher: typeof fetch = globalThis.fetch, limit = 8) {
    this.fetcher = fetcher.bind(globalThis)
    this.limit = limit
  }

  prepare(path: string): Promise<File> {
    if (!/^\/news-media\/[\w-]+-story\.png$/.test(path)) return Promise.reject(new Error('Ungültiger Story-Bildpfad'))
    const file = this.files.get(path)
    if (file) {
      this.files.delete(path)
      this.files.set(path, file)
      return Promise.resolve(file)
    }
    const pending = this.pending.get(path)
    if (pending) return pending
    const request = this.load(path).then(file => {
      this.files.set(path, file)
      while (this.files.size > this.limit) this.files.delete(this.files.keys().next().value!)
      return file
    }).finally(() => this.pending.delete(path))
    this.pending.set(path, request)
    return request
  }

  private async load(path: string): Promise<File> {
    // Versioned image URLs are already hosted on dangulea.at. Reuse the HTTP
    // cache; prepare the File before the click so native share keeps its gesture.
    const response = await this.fetcher(path, { cache: 'force-cache' })
    if (!response.ok || response.headers.get('content-type')?.split(';')[0] !== 'image/png') throw new Error('Story-Bild nicht verfügbar')
    const bytes = await response.arrayBuffer()
    const header = new Uint8Array(bytes)
    const view = new DataView(bytes)
    if (bytes.byteLength < 32 || bytes.byteLength >= 5_000_000 ||
        ![137, 80, 78, 71, 13, 10, 26, 10].every((value, index) => header[index] === value) ||
        view.getUint32(16) !== 1080 || view.getUint32(20) !== 1920) throw new Error('Ungültiges Story-Bild')
    return new File([bytes], path.split('/').at(-1)!, { type: 'image/png' })
  }
}

export const storyImageCache = new StoryImageCache()

export function copyStoryLink(url: string, device: Pick<ShareDevice, 'clipboard'>): Promise<boolean> {
  try { return device.clipboard?.writeText(url).then(() => true, () => false) ?? Promise.resolve(false) }
  catch { return Promise.resolve(false) }
}

export function handOffStory(article: StoryArticle, file: File, device: ShareDevice): Promise<StoryResult> {
  const payload = { files: [file], title: article.title, url: article.url }
  try {
    if (!device.share || !device.canShare?.({ files: [file] }) || !device.canShare(payload)) {
      return Promise.resolve({ outcome: 'unsupported', copied: false })
    }
  } catch { return Promise.resolve({ outcome: 'unsupported', copied: false }) }
  // Neither clipboard access nor network requests may be awaited before share().
  // Clipboard failure must never prevent handing off the image AND article URL.
  const copying = copyStoryLink(article.url, device)
  try {
    const sharing = device.share(payload)
    return sharing.then(async () => ({ outcome: 'shared' as const, copied: await copying }),
      async error => ({ outcome: error?.name === 'AbortError' ? 'cancelled' as const : 'failed' as const, copied: await copying }))
  } catch { return copying.then(copied => ({ outcome: 'failed', copied })) }
}
