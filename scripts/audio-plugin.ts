import { open } from 'node:fs/promises'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type { ReadableStream as NodeReadableStream } from 'node:stream/web'
import type { Plugin, Connect } from 'vite'
import { createAudioWorker } from '../worker/audio'
import { CHUNK_SIZE, prepareAudio } from './audio-assets'

export function audioPlugin(): Plugin {
  const middleware = async (): Promise<Connect.NextHandleFunction> => {
    const { manifest, filesByHash } = await prepareAudio('audio-sources')
    const worker = createAudioWorker(manifest)
    return async (request, response, next) => {
      const url = new URL(request.url ?? '/', 'http://localhost')
      if (!url.pathname.startsWith('/audio/')) return next()
      const abort = new AbortController()
      response.once('close', () => abort.abort())
      try {
        const headers = new Headers()
        for (const [name, value] of Object.entries(request.headers)) {
          if (value !== undefined) headers.set(name, Array.isArray(value) ? value.join(', ') : value)
        }
        const result = await worker.fetch(new Request(url, { method: request.method, headers, signal: abort.signal }), {
          ASSETS: {
            async fetch(chunkRequest) {
              const match = /^\/audio-chunks\/([a-f0-9]{64})\/(\d+)\.bin$/.exec(new URL(chunkRequest.url).pathname)
              const source = match && filesByHash.get(match[1])
              if (!source || !match) return new Response(null, { status: 404 })
              const handle = await open(source, 'r')
              try {
                const data = Buffer.alloc(CHUNK_SIZE)
                const { bytesRead } = await handle.read(data, 0, CHUNK_SIZE, Number(match[2]) * CHUNK_SIZE)
                return new Response(data.subarray(0, bytesRead))
              } finally {
                await handle.close()
              }
            },
          },
        })
        response.writeHead(result.status, Object.fromEntries(result.headers))
        if (result.body) await pipeline(Readable.fromWeb(result.body as NodeReadableStream), response)
        else response.end()
      } catch (error) {
        if (!abort.signal.aborted) next(error)
      }
    }
  }
  return {
    name: 'audio-chunks',
    async configureServer(server) { server.middlewares.use(await middleware()) },
    async configurePreviewServer(server) { server.middlewares.use(await middleware()) },
  }
}
