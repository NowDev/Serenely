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
Each local M4A contains the complete HLS playlist.
The files retain the original AAC audio without re-encoding.
The mixer streams each local file through a separate Web Audio volume control.
It does not decode the complete files into memory.
The master output includes a compressor to control combined peaks.

The original HAR and downloader remain unchanged.
The HAR is excluded from Git and the production build.
The development server also blocks access to HAR files.
The app does not need Noisli cookies, credentials, or network requests during playback.

## Checks

```sh
npm run lint
npm run build
npm run preview
```

The production files are written to `dist/`.

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
- `public/audio/`: Complete local recordings and source records.

All styles use Tailwind utilities and the single Tailwind entry file.
All icons come from `react-icons`.
