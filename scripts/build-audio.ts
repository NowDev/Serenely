import { readdir, stat, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { build } from 'esbuild'
import { prepareAudio } from './audio-assets'

const outputDirectory = resolve('dist')
const { manifest } = await prepareAudio(resolve('audio-sources'), outputDirectory)
await build({
  stdin: {
    contents: `import { createAudioWorker } from './worker/audio'; export default createAudioWorker(${JSON.stringify(manifest)});`,
    resolveDir: process.cwd(),
    loader: 'ts',
  },
  outfile: resolve(outputDirectory, '_worker.js'),
  bundle: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  minify: true,
})
await writeFile(resolve(outputDirectory, '_routes.json'), JSON.stringify({ version: 1, include: ['/audio/*'], exclude: [] }))
await writeFile(resolve(outputDirectory, '.assetsignore'), '_worker.js\n_routes.json\n')
for (const file of await readdir(outputDirectory, { recursive: true })) {
  const info = await stat(resolve(outputDirectory, file))
  if (info.isFile() && info.size > 25 * 1024 * 1024) throw new Error(`Deployment file exceeds 25 MiB: ${file}`)
}
console.log(`Prepared ${Object.keys(manifest).length} recordings in chunks of at most 1 MiB.`)
