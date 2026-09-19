import {
  PiBirdLight, PiCloudLightningLight, PiCloudRainLight, PiCoffeeLight,
  PiFireLight, PiMoonStarsLight, PiTreeLight, PiWavesLight,
  PiWindLight, PiWaveformLight, PiDropLight, PiHeadphonesLight,
  PiLeafLight, PiFanLight, PiTrainLight,
  PiAirplaneLight, PiCirclesThreeLight, PiTreePalmLight, PiBugLight,
  PiCityLight, PiTentLight, PiRocketLight, PiFishLight, PiWashingMachineLight,
} from 'react-icons/pi'
import type { IconType } from 'react-icons'

export const sounds = [
  { id: 'rain', name: 'Rain', icon: PiCloudRainLight, file: 'rain.m4a' },
  { id: 'thunderstorm', name: 'Thunderstorm', icon: PiCloudLightningLight, file: 'thunderstorm.m4a' },
  { id: 'wind', name: 'Wind', icon: PiWindLight, file: 'wind.m4a' },
  { id: 'forest', name: 'Forest', icon: PiTreeLight, file: 'forest.m4a' },
  { id: 'leaves', name: 'Leaves', icon: PiLeafLight, file: 'leaves.m4a' },
  { id: 'waterstream', name: 'Water stream', icon: PiWavesLight, file: 'waterstream.m4a' },
  { id: 'seaside', name: 'Seaside', icon: PiWavesLight, file: 'seaside.m4a' },
  { id: 'water', name: 'Water', icon: PiDropLight, file: 'water.m4a' },
  { id: 'bonfire', name: 'Bonfire', icon: PiFireLight, file: 'bonfire.m4a' },
  { id: 'summernight', name: 'Summer night', icon: PiMoonStarsLight, file: 'summernight.m4a' },
  { id: 'coffeeshop', name: 'Coffee shop', icon: PiCoffeeLight, file: 'coffeeshop.m4a' },
  { id: 'train', name: 'Train', icon: PiTrainLight, file: 'train.m4a' },
  { id: 'fan', name: 'Fan', icon: PiFanLight, file: 'fan.m4a' },
  { id: 'whitenoise', name: 'White noise', icon: PiWaveformLight, file: 'whitenoise.m4a' },
  { id: 'pinknoise', name: 'Pink noise', icon: PiWaveformLight, file: 'pinknoise.m4a' },
  { id: 'brownnoise', name: 'Brown noise', icon: PiWaveformLight, file: 'brownnoise.m4a' },
  { id: 'airplane', name: 'Airplane', icon: PiAirplaneLight, file: 'airplane.m4a' },
  { id: 'bubbles', name: 'Bubbles', icon: PiCirclesThreeLight, file: 'bubbles.m4a' },
  { id: 'waterfall', name: 'Waterfall', icon: PiWavesLight, file: 'waterfall.m4a' },
  { id: 'tropicalforest', name: 'Tropical forest', icon: PiTreePalmLight, file: 'tropicalforest.m4a' },
  { id: 'cicadas', name: 'Cicadas', icon: PiBugLight, file: 'cicadas.m4a' },
  { id: 'cityscape', name: 'Cityscape', icon: PiCityLight, file: 'cityscape.m4a' },
  { id: 'fireplace', name: 'Fireplace', icon: PiFireLight, file: 'fireplace.m4a' },
  { id: 'oceanwaves', name: 'Ocean waves', icon: PiWavesLight, file: 'oceanwaves.m4a' },
  { id: 'rainontent', name: 'Rain on tent', icon: PiTentLight, file: 'rainontent.m4a' },
  { id: 'spaceengine', name: 'Space engine', icon: PiRocketLight, file: 'spaceengine.m4a' },
  { id: 'underwater', name: 'Underwater', icon: PiFishLight, file: 'underwater.m4a' },
  { id: 'washingmachine', name: 'Washing machine', icon: PiWashingMachineLight, file: 'washingmachine.m4a' },
] as const

export type SoundId = (typeof sounds)[number]['id']
export type Sound = (typeof sounds)[number]
export type MixLevels = Partial<Record<SoundId, number>>

export interface Preset {
  id: string
  name: string
  description: string
  icon: IconType
  levels: MixLevels
}

export const presets: Preset[] = [
  { id: 'focus', name: 'Deep focus', description: 'Rain, soft brown noise', icon: PiHeadphonesLight, levels: { rain: 0.6, brownnoise: 0.25 } },
  { id: 'forest', name: 'Forest walk', description: 'Birds, wind, flowing water', icon: PiBirdLight, levels: { forest: 0.6, wind: 0.25, waterstream: 0.4 } },
  { id: 'cafe', name: 'Rainy café', description: 'A table by the window', icon: PiCoffeeLight, levels: { coffeeshop: 0.55, rain: 0.45 } },
  { id: 'unwind', name: 'Unwind', description: 'A fire on a summer night', icon: PiMoonStarsLight, levels: { bonfire: 0.5, summernight: 0.5 } },
]

export function sanitizeLevels(value: unknown): MixLevels {
  if (!value || typeof value !== 'object') return {}
  const levels: MixLevels = {}
  for (const sound of sounds) {
    const level = (value as Record<string, unknown>)[sound.id]
    if (typeof level === 'number' && Number.isFinite(level)) levels[sound.id] = Math.max(0, Math.min(1, level))
  }
  return levels
}
