# Serenely

Serenely is a local ambient sound mixer built with Vite, React, TypeScript, and Tailwind CSS.

## Run the project

Use Node.js 22.12 or later.

```sh
npm install
npm run dev
```

Open the local URL shown in the terminal.

## Use the mixer

1. Select a sound to start playback.
2. Select more sounds to combine them.
3. Adjust the volume below each selected sound.
4. Use the bottom volume control to adjust the full mix.
5. Use the play button to pause or resume all selected sounds.
6. Select a preset to replace the current mix.
7. Select **Save mix** to save the current sound levels.
8. Open **Focus timer** to stop playback after 15, 25, or 50 minutes.

Saved mixes and volume preferences stay in this browser.
The page restores selected sounds without automatic playback.
The timer continues when playback is paused.
Reloading the page resets the timer.

## Background colors

The background changes through six dark colors over three minutes.
The player, dialogs, and messages use the same color cycle.
Text and accent colors stay fixed for readability.
The background stays dark green when your system requests reduced motion.

## Audio

The project includes all 28 Noisli sounds listed in the audio catalog.
The original M4A files stay in `audio-sources/`.
The build splits each file into chunks of at most 1 MiB.
It copies the audio bytes without re-encoding.
It checks the SHA-256 hash before and during the split.

The browser requests audio from `/audio/<name>.m4a`.
A Cloudflare Worker serves the requested byte range from the required chunks.
The Worker reads one chunk at a time.
The browser controls buffering and can cancel a request when it has enough data.
The Worker stops reading chunks when the request is cancelled.
The mixer keeps its existing playback, loop, and Web Audio volume controls.
It does not decode complete recordings into memory.
The master output includes a compressor to control combined peaks.

The original downloader remains unchanged.
HAR files are excluded from Git and the production build.
The development server also blocks direct access to HAR files and source recordings.
The app does not need Noisli cookies or credentials.
Playback uses this site's audio routes without requests to Noisli.

## Background playback

The mixer requests the `playback` audio session before it creates the Web Audio context.
Safari uses this session type for background audio.
Browsers without the Audio Session API keep their default audio behavior.
The Media Session API provides play, pause, and stop controls for the full mix where supported.
The controls show the selected sound names.
The mixer removes these controls and restores the previous audio session type when it unmounts.

Check this change in Safari on the target iPhone:

1. Reload the updated site.
2. Select rain and forest without a focus timer.
3. Go to the Home Screen and listen for one minute.
4. Open another app without starting other audio.
5. Lock the screen and listen for at least five minutes.
6. Pause and resume the mix with the lock screen controls.
7. Return to Safari and check both sound levels and the master volume.
8. Remove all sounds and check that playback stops.

Keep the Safari tab open during playback.
Closing the tab or force-closing Safari ends playback.
Calls and other audio can interrupt playback.
The focus timer uses browser timers, which can run late in the background.
Automated checks do not verify background playback on an iPhone.

## Deploy to Cloudflare

The build creates the website, audio chunks, and Worker in `dist/`.
It rejects deployment files larger than Cloudflare's 25 MiB asset limit.
It does not require FFmpeg or R2.
Audio requests use Workers or Pages Functions quotas.
Other files use static asset hosting.

For Pages Git integration, use these settings:

| Setting | Value |
| --- | --- |
| Branch | `main` |
| Build command | `npm run build` |
| Output directory | `dist` |

Pages uses the generated `_worker.js` and `_routes.json` files.
The route configuration sends only `/audio/*` requests to the Worker.

For Workers, run this command after Cloudflare authentication:

```sh
npm run deploy:workers
```

For Workers Git integration, set the build command to `npm run build`.
Set the deploy command to `npx wrangler deploy`.
Wrangler reads `wrangler.jsonc` and deploys the audio handler with its asset binding.
Do not deploy only the static files. Audio requests require the Worker.

For a Pages CLI deployment, run this command:

```sh
npm run deploy:pages -- --project-name serenely
```

Use a Workers or Pages deployment with Functions enabled.
An ordinary static server cannot reconstruct the audio files.

## Checks

```sh
npm run lint
npm test
npm run build
npm run preview:cloudflare
```

The production files are written to `dist/`.
The Cloudflare preview runs at `http://127.0.0.1:8787`.
The tests check byte ranges, chunk boundaries, caching, cancellation, and missing chunks.
These checks do not prove browser playback.

`npm run dev` and `npm run preview` use the same audio handler through a local asset adapter.
Use the Cloudflare preview to check the deployed asset layout.

Check playback in your browser:

1. Enable each new sound and check playback.
2. Enable rain and forest together.
3. Change each volume and the master volume.
4. Pause the mix, then resume it.
5. Save a mix with new sounds.
6. Select the mix under **Saved mixes**.
7. Reload the page and confirm that playback remains paused.
8. Start the focus timer and check its pause and reset controls.

## Project structure

- `src/audio/SoundEngine.ts`: Audio playback, volume controls, and resource cleanup.
- `src/data/sounds.ts`: Sound catalog and presets.
- `src/hooks/useMixer.ts`: Mixer state and playback actions.
- `src/hooks/useTimer.ts`: Timer state and completion.
- `src/lib/storage.ts`: Browser preference validation and storage.
- `src/components/`: Shared interface components.
- `audio-sources/`: Complete source recordings.
- `worker/audio.ts`: Audio byte ranges and chunk streaming.
- `scripts/`: Audio build and local server support.
- `tests/audio.test.ts`: Audio delivery tests.
- `wrangler.jsonc`: Default Cloudflare Workers configuration.
- `wrangler.pages.jsonc`: Explicit Cloudflare Pages CLI configuration.

All styles use Tailwind utilities and the single Tailwind entry file.
All icons come from `react-icons`.
