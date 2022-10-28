import { CoopPlaythrough, Game, Player, PlayerId, VsPlaythrough } from '@domains'


// factory
export namespace PlaythroughFactory {

  // types
  type VsProps = {
    game: Game
    players: readonly Player[]
    winner: Player
    playedOn?: Date
    scores?: ReadonlyMap<Player, number>
  }
  type CoopProps = {
    game: Game
    players: readonly Player[]
    playersWon: boolean
    playedOn?: Date
    score?: number
  }

  /**
   * create vs playthrough
   * default players is all players
   * default playedOn is now
   */
  export function createVs(data: VsProps): VsPlaythrough {

    // convert scores to map of player id
    let scores: Map<PlayerId, number> | undefined
    if (data.scores) {
      scores = new Map()
      for (const [player, score] of data.scores) {
        scores.set(player.id!, score)
      }
    }

    return new VsPlaythrough({
      playedOn: data.playedOn ?? new Date(),
      gameId: data.game.id!,
      playerIds: data.players.map(p => p.id!),
      winnerId: data.winner.id!,
      scores
    })
  }

  /**
   * create vs playthrough
   * default players is all players
   * default playedOn is now
   */
  export function createCoop(data: CoopProps): CoopPlaythrough {
    return new CoopPlaythrough({
      playedOn: data.playedOn ?? new Date(),
      gameId: data.game.id!,
      playerIds: data.players.map(p => p.id!),
      playersWon: data.playersWon,
      score: data.score
    })
  }

}