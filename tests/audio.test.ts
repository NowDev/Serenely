import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createAudioWorker, chunkPath } from '../worker/audio'
import type { AudioManifest } from '../worker/audio'

const data = Uint8Array.from({ length: 9001 }, (_, index) => index % 251)
const asset = { size: data.length, chunkSize: 1024, hash: 'a'.repeat(64) }
const manifest: AudioManifest = { '/audio/rain.m4a': asset }
const worker = createAudioWorker(manifest)

function fixture() {
  const requested: string[] = []
  const env = {
    ASSETS: {
      async fetch(request: Request) {
        const path = new URL(request.url).pathname
        requested.push(path)
        const index = Number(path.split('/').at(-1)?.replace('.bin', ''))
        if (!Number.isInteger(index)) return new Response('Static file.')
        return new Response(data.slice(index * asset.chunkSize, (index + 1) * asset.chunkSize))
      },
    },
  }
  const fetch = (headers: HeadersInit = {}, method = 'GET', path = '/audio/rain.m4a') => worker.fetch(
    new Request(`https://serenely.test${path}`, { headers, method }), env,
  )
  return { requested, fetch, env }
}

test('the complete response preserves every byte', async () => {
  const { fetch, requested } = fixture()
  const response = await fetch()
  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Content-Length'), String(data.length))
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), data)
  assert.equal(requested.length, 9)
})

for (const [range, start, end] of [
  ['bytes=0-1', 0, 1],
  ['bytes=1000-1050', 1000, 1050],
  ['bytes=1024-2047', 1024, 2047],
  ['bytes=8990-', 8990, 9000],
  ['bytes=-32', 8969, 9000],
  ['bytes=8990-9999', 8990, 9000],
  ['bytes=-99999', 0, 9000],
] as const) {
  test(`range ${range} returns only the required chunks`, async () => {
    const { fetch, requested } = fixture()
    const response = await fetch({ Range: range })
    assert.equal(response.status, 206)
    assert.equal(response.headers.get('Content-Range'), `bytes ${start}-${end}/${data.length}`)
    assert.equal(response.headers.get('Content-Length'), String(end - start + 1))
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), data.slice(start, end + 1))
    assert.equal(requested.length, Math.floor(end / 1024) - Math.floor(start / 1024) + 1)
  })
}

test('HEAD and cache validation do not fetch chunks', async () => {
  const { fetch, requested } = fixture()
  const head = await fetch({ Range: 'bytes=0-1' }, 'HEAD')
  assert.equal(head.status, 200)
  assert.equal(head.headers.get('Content-Length'), String(data.length))
  assert.equal(await head.text(), '')
  const cached = await fetch({ 'If-None-Match': `W/"${asset.hash}"` })
  assert.equal(cached.status, 304)
  assert.equal(requested.length, 0)
})

test('unsatisfiable ranges return 416 without fetching chunks', async () => {
  const { fetch, requested } = fixture()
  for (const range of ['bytes=9001-', 'bytes=10-1', 'bytes=-0']) {
    const response = await fetch({ Range: range })
    assert.equal(response.status, 416)
    assert.equal(response.headers.get('Content-Range'), `bytes */${data.length}`)
  }
  assert.equal(requested.length, 0)
})

test('unsupported ranges and stale If-Range return the complete file', async () => {
  const { fetch } = fixture()
  const cases: HeadersInit[] = [
    { Range: 'bytes=0-1,3-4' },
    { Range: 'invalid' },
    { Range: 'bytes=0-1', 'If-Range': '"old-file"' },
  ]
  for (const headers of cases) {
    const response = await fetch(headers)
    assert.equal(response.status, 200)
    assert.deepEqual(new Uint8Array(await response.arrayBuffer()), data)
  }
})

test('current If-Range retains partial delivery', async () => {
  const { fetch } = fixture()
  const response = await fetch({ Range: 'bytes=0-1', 'If-Range': `"${asset.hash}"` })
  assert.equal(response.status, 206)
  assert.deepEqual(new Uint8Array(await response.arrayBuffer()), data.slice(0, 2))
})

test('cancellation stops subsequent chunk requests', async () => {
  const { fetch, requested } = fixture()
  const response = await fetch()
  assert.equal(requested.length, 0)
  const reader = response.body!.getReader()
  await reader.read()
  await reader.cancel()
  assert.deepEqual(requested, [chunkPath(asset, 0)])
})

test('missing and truncated chunks fail the stream', async () => {
  for (const response of [new Response(null, { status: 404 }), new Response('short')]) {
    const result = await worker.fetch(new Request('https://serenely.test/audio/rain.m4a'), {
      ASSETS: { fetch: async () => response },
    })
    await assert.rejects(result.arrayBuffer())
  }
})

test('unknown audio and unsupported methods do not fetch chunks', async () => {
  const { fetch, requested } = fixture()
  assert.equal((await fetch({}, 'GET', '/audio/absent.m4a')).status, 404)
  assert.equal((await fetch({}, 'POST')).status, 405)
  assert.equal(requested.length, 0)
  assert.equal(await (await fetch({}, 'GET', '/favicon.svg')).text(), 'Static file.')
})
