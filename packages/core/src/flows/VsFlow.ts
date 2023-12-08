import { PlayerId, ScoringType } from '@services'
import { PlaythroughFlowData } from './PlaythroughFlow'
import { ScoreData } from '@domains'


type VsFlowData = PlaythroughFlowData & {
  scoring: ScoringType
}


export class VsFlow {

  private scores: Map<PlayerId, number>

  public constructor(private data: VsFlowData) {
    this.scores = new Map<PlayerId, number>()
  }

  private get allScoresRecorded(): boolean {
    return this.data.playerIds.every(id => this.scores.has(id))
  }

  public addScore(playerId: PlayerId, score: number) {
    this.scores.set(playerId, score)
  }

  private determinWinner(): PlayerId {
    let winnerId: PlayerId

    switch (this.data.scoring) {
      case ScoringType.HIGHEST_WINS: {
        this.data.playerIds.reduce((winner, current) => )
      }
    }

    this.data.playerIds
  }

  private highest(): PlayerId {
    let highestPlayer: PlayerId
    let highestScore: number = Number.MIN_VALUE

    for (const playerId of this.data.playerIds) {
      const score = this.scores.get(playerId)
      if (score === undefined) {
        throw new Error(`there is no score for player ${playerId}`)
      }
      if (score > highestScore) {
        highestScore = score
        highestPlayer = playerId
      }
    }

    return highestPlayer!
  }

  private lowest(): ScoreData {
    if (this._scores.length === 0) {
      throw new Error('there are no scores')
    }

    let lowestPlayer: PlayerId | undefined
    let lowestScore: number = Number.MAX_VALUE

    for (const { playerId, score } of this._scores) {
      if (score < lowestScore) {
        lowestScore = score
        lowestPlayer = playerId
      }
    }

    return {
      playerId: lowestPlayer!,
      score: lowestScore
    }
  } 
}

// public determineWinner(scores: Scores): ScoreData {
//   switch (this.scoring) {
//     case ScoringType.HIGHEST_WINS:
//       return scores.highest()
//     case ScoringType.LOWEST_WINS:
//       return scores.lowest()
//     default:
//       throw new Error(`winner cannot be determined with scoring type`)
//   }
// }