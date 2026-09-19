import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'
import { mkdir, open, readdir, stat, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { chunkPath } from '../worker/audio'
import type { AudioManifest } from '../worker/audio'

export const CHUNK_SIZE = 1024 * 1024

export async function prepareAudio(sourceDirectory: string, outputDirectory?: string) {
  const manifest: AudioManifest = {}
  const filesByHash = new Map<string, string>()
  const files = (await readdir(sourceDirectory)).filter(file => file.endsWith('.m4a')).sort()
  if (!files.length) throw new Error('No source audio files were found.')
  for (const file of files) {
    const source = join(sourceDirectory, file)
    const { size } = await stat(source)
    if (!size) throw new Error(`Audio file is empty: ${file}`)
    const hash = createHash('sha256')
    for await (const data of createReadStream(source)) hash.update(data)
    const asset = { size, chunkSize: CHUNK_SIZE, hash: hash.digest('hex') }
    manifest[`/audio/${file}`] = asset
    filesByHash.set(asset.hash, source)
    if (!outputDirectory) continue
    await mkdir(join(outputDirectory, 'audio-chunks', asset.hash), { recursive: true })
    const handle = await open(source, 'r')
    const verified = createHash('sha256')
    try {
      for (let index = 0; index * CHUNK_SIZE < size; index++) {
        const data = Buffer.alloc(Math.min(CHUNK_SIZE, size - index * CHUNK_SIZE))
        const { bytesRead } = await handle.read(data, 0, data.length, index * CHUNK_SIZE)
        if (bytesRead !== data.length) throw new Error(`Audio file changed during the build: ${file}`)
        verified.update(data)
        await writeFile(join(outputDirectory, chunkPath(asset, index)), data)
      }
    } finally {
      await handle.close()
    }
    if (verified.digest('hex') !== asset.hash) throw new Error(`Audio hash changed during the build: ${file}`)
  }
  return { manifest, filesByHash }
}
