import 'reflect-metadata'
import { CoopGame, Game, GameType, PlayerId, Playthrough, ScoringType, VsGame } from '@domains'
import { GameFactory, GameKeeperFactory } from '@factories'
import {readFile} from 'fs/promises'
import pathUtil from 'path'
import {parse} from 'date-fns'


// importer
export namespace Importer {

  export async function run(path: string) {

    // read csv file
    const file = await readFile(path, { encoding: 'utf-8' })

    // split lines
    const lines = file.split('\n').slice(1).filter(l => l)

    // create gamekeeper
    const fullPath = pathUtil.resolve('/path')
    const gamekeeper = GameKeeperFactory.create(fullPath)
    const playerIds = ['1' as PlayerId, '2' as PlayerId]

    // store created game models
    const games = new Map<string, Game>()

    // go through each line
    for (const line of lines) {
      const columns = line.split(',')
      const gameName = columns[0]
      const dateStr = (columns[1] + columns[2]).replaceAll('"', '')
      const playedOn = parse(dateStr, 'MMM d yyyy', new Date())
      const johnsScore = Number(columns[3])
      const alexsScore = Number(columns[4])
      const scores = new Map<PlayerId, number>()
      if (columns[3] !== '') scores.set(playerIds[0], johnsScore)
      if (columns[4] !== '') scores.set(playerIds[1], alexsScore)

      let game: Game
      if (games.has(gameName)) {
        game = games.get(gameName)!
      } else {
        game = createGame(gameName)
        await gamekeeper.games.add(game)
        games.set(gameName, game)
      }

      let playthrough: Playthrough
      if (game instanceof CoopGame) {
        playthrough = game.record({
          playedOn,
          playersWon: columns[5] === 'Both',
          playerIds
        })
      }
      else if (game instanceof VsGame) {
        playthrough = game.record({
          playedOn,
          playerIds,
          scores,
          winnerId: (columns[5] === 'John' ? '1' : '2') as PlayerId
        })
      }
      else {
        throw new Error('game type not supported')
      }

      await gamekeeper.record(playthrough)
    }

    
    
    // for (const [name, game] of games) {
    //   console.log('game', game.name)
    // }
  }

  // create game from the name
  function createGame(name: string): Game {

    let options: {type: GameType, scoring: ScoringType}

    switch (name) {
      case 'Spice Road':
      case 'Concordia':
      case 'Smallworld':
      case 'Jaipur':
      case 'Mancala':
      case 'Dutch Blitz':
      case '7 Wonders Duel':
      case 'Skip-bo':
      case 'Azul':
      case 'Sagrada':
      case 'Patchwork':
      case 'Cascadia':
      case 'Jamaica':
      case 'Railroad Ink':
      case 'Rummikub':
        options = { type: GameType.VS, scoring: ScoringType.HIGHEST_WINS }
        break
      case '6 Nimmt':
        options = { type: GameType.VS, scoring: ScoringType.LOWEST_WINS }
        break
      case 'Codenames Duet':
        options = { type: GameType.COOP, scoring: ScoringType.NO_SCORE }
        break
      default:
        throw new Error(`"${name}" does not have options`)
    }

    const game = GameFactory.create({
      name,
      ...options
    })

    return game
  }

}


// run import
const path = pathUtil.resolve('path')
Importer.run(path)