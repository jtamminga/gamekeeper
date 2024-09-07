import { CoopPlaythrough } from './CoopPlaythrough'
import { type PlaythroughData, CoopPlaythroughData, VsPlaythroughData } from '@services'
import { VsPlaythrough } from './VsPlaythrough'
import type { Playthrough } from './Playthrough'
import type{ GameplayDeps } from '../Gameplay'


export namespace PlaythroughFactory {
  
  export function create(deps: GameplayDeps, data: PlaythroughData): Playthrough {
    if (VsPlaythroughData.guard(data)) {  
      return new VsPlaythrough(deps, data)
    }
    else if (CoopPlaythroughData.guard(data)) {  
      return new CoopPlaythrough(deps, data)
    }
    else {
      throw new Error('error creating playthough')
    }
  }

}