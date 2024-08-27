import type { GameKeeperDeps } from '@core'
import { CoopPlaythrough, Playthrough, VsPlaythrough } from '@domains'
import { type PlaythroughData, CoopPlaythroughData, VsPlaythroughData } from '@services'


export namespace PlaythroughFactory {
  
  export function create(deps: GameKeeperDeps, data: PlaythroughData): Playthrough {
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