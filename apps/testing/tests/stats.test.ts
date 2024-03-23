import assert from 'assert'
import { GameKeeper, GameType, ScoringType } from '@gamekeeper/core'
import { Factory } from './Factory'

const alex = Factory.alex
const john = Factory.john

describe('stats', async function () {

  let gamekeeper: GameKeeper

  beforeEach(async function () {
    gamekeeper = Factory.createGamekeeper()
    await gamekeeper.hydrate()
  })

  describe('playthrough counts', async function () {
    it('should count 1 playthrough', async function () {
      const game = await gamekeeper.games.create(Factory.createGame())
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))

      const gameStats = gamekeeper.stats.forGame(game)
      assert.equal(await gameStats.numPlaythroughs(), 1)

      const overallStats = await gamekeeper.stats.numPlaythroughs({})
      assert.equal(await overallStats.get(game), 1)
    })

    it('tied games should still count as playthrough', async function () {
      const game = await gamekeeper.games.create(Factory.createGame())
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, null))

      const gameStats = gamekeeper.stats.forGame(game)
      assert.equal(await gameStats.numPlaythroughs(), 2)

      const overallStats = await gamekeeper.stats.numPlaythroughs({})
      assert.equal(await overallStats.get(game), 2)
    })
  })

  describe('calculating winrates', async function () {
    it('single playthrough should have 100% winrate', async function () {
      const game = await gamekeeper.games.create(Factory.createGame())
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))

      const winrates = await gamekeeper.stats.winrates({})
      const gameWinrates = winrates.get(game)!
      assert.equal(gameWinrates.for(alex.id), 1)
      assert.equal(gameWinrates.for(john.id), 0)
      assert.equal(gameWinrates.highest.player.id, alex.id)
      assert.equal(gameWinrates.highest.winrate, 1)

      const overallWinrates = await gamekeeper.stats.overallWinrates()
      assert.equal(overallWinrates.for(alex.id), 1)
      assert.equal(overallWinrates.for(john.id), 0)
      assert.equal(overallWinrates.highest.player.id, alex.id)
      assert.equal(overallWinrates.highest.winrate, 1)
    })

    it('single game with multiple playthroughs', async function () {
      const game = await gamekeeper.games.create(Factory.createGame())
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, john.id))

      const winrates = await gamekeeper.stats.winrates({})
      const gameWinrates = winrates.get(game)!
      assert.equal(gameWinrates.for(alex.id), 2 / 3)
      assert.equal(gameWinrates.for(john.id), 1 / 3)
      assert.equal(gameWinrates.highest.player.id, alex.id)
      assert.equal(gameWinrates.highest.winrate, 2 / 3)

      const overallWinrates = await gamekeeper.stats.overallWinrates()
      assert.equal(overallWinrates.for(alex.id), 2 / 3)
      assert.equal(overallWinrates.for(john.id), 1 / 3)
      assert.equal(overallWinrates.highest.player.id, alex.id)
      assert.equal(overallWinrates.highest.winrate, 2 / 3)
    })

    it('tied games should be ignored for winrates', async function () {
      const game = await gamekeeper.games.create(Factory.createGame())
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, null)) // tie

      const winrates = await gamekeeper.stats.winrates({})
      const gameWinrates = winrates.get(game)!
      assert.equal(gameWinrates.for(alex.id), 1)
      assert.equal(gameWinrates.for(john.id), 0)
      assert.equal(gameWinrates.highest.player.id, alex.id)
      assert.equal(gameWinrates.highest.winrate, 1)

      const overallWinrates = await gamekeeper.stats.overallWinrates()
      assert.equal(overallWinrates.for(alex.id), 1)
      assert.equal(overallWinrates.for(john.id), 0)
      assert.equal(overallWinrates.highest.player.id, alex.id)
      assert.equal(overallWinrates.highest.winrate, 1)
    })

    it('multiple games', async function () {
      const vs1 = await gamekeeper.games.create(Factory.createGame({ name: 'game1' }))
      const vs2 = await gamekeeper.games.create(Factory.createGame({ name: 'game2' }))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(vs1.id, alex.id))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(vs1.id, john.id))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(vs2.id, john.id))

      const winrates = await gamekeeper.stats.winrates({})
      const vs1Winrates = winrates.get(vs1)!
      assert.equal(vs1Winrates.for(alex.id), 1 / 2)
      assert.equal(vs1Winrates.for(john.id), 1 / 2)
      assert.equal(vs1Winrates.highest.winrate, 1 / 2)

      const vs2Winrates = winrates.get(vs2)!
      assert.equal(vs2Winrates.for(alex.id), 0)
      assert.equal(vs2Winrates.for(john.id), 1)
      assert.equal(vs2Winrates.highest.player.id, john.id)
      assert.equal(vs2Winrates.highest.winrate, 1)

      const overallWinrates = await gamekeeper.stats.overallWinrates()
      assert.equal(overallWinrates.for(alex.id), 1 / 3)
      assert.equal(overallWinrates.for(john.id), 2 / 3)
      assert.equal(overallWinrates.highest.player.id, john.id)
      assert.equal(overallWinrates.highest.winrate, 2 / 3)
    })

    it('coop games', async function () {
      const vs = await gamekeeper.games.create(Factory.createGame({ name: 'vs', type: GameType.VS }))
      const coop = await gamekeeper.games.create(Factory.createGame({ name: 'coop', type: GameType.COOP }))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(vs.id, alex.id))
      await gamekeeper.playthroughs.create(Factory.createCoopPlaythrough(coop.id, false))

      const winrates = await gamekeeper.stats.winrates({})
      const vsWinrates = winrates.get(vs)!
      assert.equal(vsWinrates.for(alex.id), 1)
      assert.equal(vsWinrates.for(john.id), 0)
      assert.equal(vsWinrates.highest.player.id, alex.id)
      assert.equal(vsWinrates.highest.winrate, 1)

      const coopWinrates = winrates.get(coop)!
      assert.equal(coopWinrates.for(alex.id), 0)
      assert.equal(coopWinrates.for(john.id), 0)
      assert.equal(coopWinrates.highest.winrate, 0)

      const overallWinrates = await gamekeeper.stats.overallWinrates()
      assert.equal(overallWinrates.for(alex.id), 1 / 2)
      assert.equal(overallWinrates.for(john.id), 0)
      assert.equal(overallWinrates.highest.player.id, alex.id)
      assert.equal(overallWinrates.highest.winrate, 1 / 2)
    })
  })

  describe('calculating scoring', async function () {
    it('no scores results in undefined score stats', async function () {
      const game = await gamekeeper.games.create(Factory.createGame({ type: GameType.VS }))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))

      const scoreStats = await gamekeeper.stats.forGame(game).scoreStats()
      assert.equal(scoreStats, undefined)
    })

    it('game with no scoring type results in undefined score stats', async function () {
      const game = await gamekeeper.games.create(Factory.createGame({ type: GameType.VS, scoring: ScoringType.NO_SCORE }))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id, Factory.createScores(10, 20)))

      const scoreStats = await gamekeeper.stats.forGame(game).scoreStats()
      assert.equal(scoreStats, undefined)
    })

    it('single vs playthrough with all scores', async function () {
      const game = await gamekeeper.games.create(Factory.createGame({ type: GameType.VS }))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id, Factory.createScores(10, 20)))

      const scoreStats = await gamekeeper.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 15)
      assert.equal(scoreStats!.bestScore.score, 20)
      assert.equal(scoreStats!.bestScore.player!.id, alex.id)
    })

    it('single vs low score playthrough with all scores', async function () {
      const game = await gamekeeper.games.create(Factory.createGame({ type: GameType.VS, scoring: ScoringType.LOWEST_WINS }))
      await gamekeeper.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id, Factory.createScores(10, 20)))

      const scoreStats = await gamekeeper.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 15)
      assert.equal(scoreStats!.bestScore.score, 10)
      assert.equal(scoreStats!.bestScore.player!.id, john.id)
    })

    it('multiple coop playthroughs', async function () {
      const game = await gamekeeper.games.create(Factory.createGame({ type: GameType.COOP, scoring: ScoringType.LOWEST_WINS }))
      await gamekeeper.playthroughs.create(Factory.createCoopPlaythrough(game.id, true, 20))
      await gamekeeper.playthroughs.create(Factory.createCoopPlaythrough(game.id, true, 10))
      await gamekeeper.playthroughs.create(Factory.createCoopPlaythrough(game.id, false, 30))
      await gamekeeper.playthroughs.create(Factory.createCoopPlaythrough(game.id, false))

      const scoreStats = await gamekeeper.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 20)
      assert.equal(scoreStats!.bestScore.score, 10)
      assert.equal(scoreStats!.bestScore.player, undefined)
    })
  })

})