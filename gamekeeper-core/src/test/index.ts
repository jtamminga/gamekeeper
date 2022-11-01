import 'bootstrap'
import { CoopGame, GameId, GameKeeper, GameType, PlayerId, VsGame } from '@domains'
import { GameFactory, GameKeeperFactory } from '@factories'


// repo test
async function run() {

  console.log('starting test...')

  const gamekeeper = GameKeeperFactory.create('/home/john/Git/gamekeeper/data/gamekeeper.db')

  console.log('created gamekeeper')

  const games = await gamekeeper.games.all()


  for (const game of games) {
    console.log(`game ${game.name} last played ${game.getLastPlayed()}`)
  }

  const spice = await gamekeeper.games.get<VsGame>('2' as GameId)

  const scores = new Map<PlayerId, number>()
  scores.set('1' as PlayerId, 10)
  const playthrough = spice.record({
    playerIds: ['1' as PlayerId, '2' as PlayerId],
    playedOn: new Date(),
    winnerId: '1' as PlayerId,
    scores
  })

  await gamekeeper.record(playthrough)
  console.log('added playthrough')
}

run()