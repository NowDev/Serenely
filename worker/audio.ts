export interface AudioAsset {
  size: number
  chunkSize: number
  hash: string
}

export type AudioManifest = Record<string, AudioAsset>
export interface AssetBinding {
  fetch(request: Request): Promise<Response>
}

type ByteRange = { start: number; end: number }

export function parseRange(value: string | null, size: number): ByteRange | 'invalid' | null {
  if (!value) return null
  const match = /^bytes=(\d*)-(\d*)$/.exec(value.trim())
  // Ignore unsupported range formats and return the complete file.
  if (!match || (!match[1] && !match[2])) return null
  if (!match[1]) {
    const suffix = Number(match[2])
    if (!Number.isSafeInteger(suffix) || suffix === 0) return 'invalid'
    return { start: Math.max(0, size - suffix), end: size - 1 }
  }
  const start = Number(match[1])
  const end = match[2] ? Number(match[2]) : size - 1
  if (!Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start >= size || end < start) return 'invalid'
  return { start, end: Math.min(end, size - 1) }
}

export function chunkPath(asset: AudioAsset, index: number) {
  return `/audio-chunks/${asset.hash}/${index}.bin`
}

function streamRange(request: Request, assets: AssetBinding, asset: AudioAsset, range: ByteRange) {
  let index = Math.floor(range.start / asset.chunkSize)
  const last = Math.floor(range.end / asset.chunkSize)
  const abort = new AbortController()
  const abortRequest = () => abort.abort()
  request.signal.addEventListener('abort', abortRequest, { once: true })
  const cleanup = () => request.signal.removeEventListener('abort', abortRequest)
  if (request.signal.aborted) abort.abort()

  const body = new ReadableStream<Uint8Array>({
    async pull(controller) {
      try {
        abort.signal.throwIfAborted()
        const url = new URL(chunkPath(asset, index), request.url)
        const response = await assets.fetch(new Request(url, { signal: abort.signal }))
        if (response.status !== 200) throw new Error(`Audio chunk returned ${response.status}.`)
        const data = new Uint8Array(await response.arrayBuffer())
        abort.signal.throwIfAborted()
        const offset = index * asset.chunkSize
        if (data.byteLength !== Math.min(asset.chunkSize, asset.size - offset)) {
          throw new Error('Audio chunk size does not match the manifest.')
        }
        controller.enqueue(data.subarray(Math.max(0, range.start - offset), Math.min(data.length, range.end - offset + 1)))
        if (index++ === last) {
          cleanup()
          controller.close()
        }
      } catch (error) {
        cleanup()
        controller.error(error)
      }
    },
    cancel() {
      abort.abort()
      cleanup()
    },
  }, { highWaterMark: 0 })

  // Workers uses this stream to preserve the response Content-Length header.
  const FixedLength = (globalThis as typeof globalThis & {
    FixedLengthStream?: new (length: number) => { readable: ReadableStream<Uint8Array>; writable: WritableStream<Uint8Array> }
  }).FixedLengthStream
  if (!FixedLength) return body
  const fixed = new FixedLength(range.end - range.start + 1)
  void body.pipeTo(fixed.writable).catch(() => { /* The response stream receives the error. */ })
  return fixed.readable
}

export function createAudioWorker(manifest: AudioManifest) {
  return {
    async fetch(request: Request, env: { ASSETS: AssetBinding }): Promise<Response> {
      const path = new URL(request.url).pathname
      if (!path.startsWith('/audio/')) return env.ASSETS.fetch(request)
      if (!Object.hasOwn(manifest, path)) return new Response('Audio not found.', { status: 404 })
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        return new Response('Method not allowed.', { status: 405, headers: { Allow: 'GET, HEAD' } })
      }

      const asset = manifest[path]
      const etag = `"${asset.hash}"`
      const headers = new Headers({
        'Content-Type': 'audio/mp4',
        'Accept-Ranges': 'bytes',
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'ETag': etag,
        'X-Content-Type-Options': 'nosniff',
      })
      const matches = request.headers.get('If-None-Match')?.split(',').map(value => value.trim().replace(/^W\//, ''))
      if (matches?.some(value => value === '*' || value === etag)) return new Response(null, { status: 304, headers })

      const ifRange = request.headers.get('If-Range')
      const range = request.method === 'GET' && (!ifRange || ifRange === etag)
        ? parseRange(request.headers.get('Range'), asset.size) : null
      if (range === 'invalid') {
        headers.set('Content-Range', `bytes */${asset.size}`)
        return new Response(null, { status: 416, headers })
      }
      const selected = range ?? { start: 0, end: asset.size - 1 }
      headers.set('Content-Length', String(selected.end - selected.start + 1))
      if (range) headers.set('Content-Range', `bytes ${range.start}-${range.end}/${asset.size}`)
      return new Response(request.method === 'HEAD' ? null : streamRange(request, env.ASSETS, asset, selected), {
        status: range ? 206 : 200,
        headers,
      })
    },
  }
}
