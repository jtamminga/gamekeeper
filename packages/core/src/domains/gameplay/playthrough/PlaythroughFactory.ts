import { CoopPlaythrough } from './CoopPlaythrough'
import { type PlaythroughData, CoopPlaythroughData, VsPlaythroughData } from '@services'
import { VsPlaythrough } from './VsPlaythrough'
import { VsPlaythroughScore, VsPlaythroughScores } from './VsPlaythroughScores'
import type { Playthrough } from './Playthrough'
import type { GameplayDeps } from '../Gameplay'
import type { VsGame, CoopGame } from '../game'


export namespace PlaythroughFactory {

  export function create(deps: GameplayDeps, data: PlaythroughData): Playthrough {
    const game = deps.repo.getGame(data.gameId)
    const players = deps.repo.getPlayers(data.playerIds)

    if (VsPlaythroughData.guard(data)) {
      const scores = new VsPlaythroughScores(
        (data.scores ?? []).map(s => {
          const player = players.find(p => p.id === s.playerId)!
          return new VsPlaythroughScore(player, s.score)
        })
      )
      return new VsPlaythrough({ ...data, game: game as VsGame, players, scores })
    }
    else if (CoopPlaythroughData.guard(data)) {
      return new CoopPlaythrough({ ...data, game: game as CoopGame, players })
    }
    else {
      throw new Error('error creating playthrough')
    }
  }

}
