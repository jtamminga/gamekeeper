'use server'

import { gamekeeper } from 'utils'
import type { CoopPlaythroughData, VsPlaythroughData } from 'gamekeeper-core'


// server action
export async function recordPlaythrough(data: VsPlaythroughData | CoopPlaythroughData) {
  await gamekeeper.playthroughs.create(data)
}