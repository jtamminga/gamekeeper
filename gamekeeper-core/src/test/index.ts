import 'bootstrap'
import { CoopGame, GameId, GameKeeper, GameType, PlayerId, VsGame } from '@domains'
import { GameFactory } from '@factories'


// repo test
async function run() {

  const gamekeeper = new GameKeeper()

  // const game = GameFactory.create({
  //   name: 'The Crew',
  //   type: GameType.COOP
  // })
  // await gamekeeper.games.add(game)

  // const vsGame = GameFactory.create({
  //   name: 'Chess',
  //   type: GameType.VS
  // })
  // await gamekeeper.games.add(vsGame)

  // const chess = await gamekeeper.games.get<VsGame>('2' as GameId)
  // console.log('game found', chess)
  

  // const players = await gamekeeper.players.all()
  // console.log('players', players)


  const games = await gamekeeper.games.all()

  for (const game of games) {
    console.log(`game ${game.name} last played ${game.getLastPlayed()}`)
  }

  // const scores = new Map<PlayerId, number>()
  // scores.set(players[0].id!, 8)
  // scores.set(players[1].id!, 4)

  // const playthrough = chess.record({
  //   playerIds: players.map(p => p.id!),
  //   playedOn: new Date(),
  //   winnerId: players[0].id!,
  //   scores
  // })

  // gamekeeper.record(playthrough)

  // await gamekeeper.record(playthrough)
  // console.log(`record saved: ${playthrough.id}`)

  // const date = game.getLastPlayed()
  // console.log(`${game.name} was last played on ${game.getLastPlayed()}`)
}

run()