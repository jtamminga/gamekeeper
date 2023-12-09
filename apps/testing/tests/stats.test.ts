import assert from 'assert'
import { GameKeeperFactory, GameType, ScoringType } from '@gamekeeper/core'
import { createTestServices } from './TestServices'

describe('stats', async function () {

  const gamekeeper = GameKeeperFactory.create(createTestServices())

  await gamekeeper.players.hydrate()

  const players = gamekeeper.players.all()
  const winnerId = players[0].id!

  const game = await gamekeeper.games.create({
    name: 'test',
    scoring: ScoringType.HIGHEST_WINS,
    type: GameType.VS
  })

  const playthrough = await gamekeeper.playthroughs.create({
    gameId: game.id!,
    playerIds: players.map(player => player.id!),
    playedOn: new Date(),
    winnerId
  })
  
  it('game should have id', function () {
    assert.ok(game.id)
  })

  it('playthrough should have id', function () {
    assert.ok(playthrough.id)
  })

  it('game should have 1 playthrough', async function () {
    const stats = gamekeeper.stats.forGame(game)
    const numPlaythroughs = await stats.getNumPlaythroughs()
    assert.equal(numPlaythroughs, 1)
  })

})