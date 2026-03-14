import assert from 'assert'
import { GameKeeper, GameType, ScoringType } from '@gamekeeper/core'
import { Factory } from './Factory'

const alex = Factory.alex
const john = Factory.john

describe('stats', async function () {

  let gamekeeper: GameKeeper

  beforeEach(async function () {
    gamekeeper = Factory.createGamekeeper()
    await gamekeeper.gameplay.hydrate()
  })

  describe('playthrough counts', async function () {
    it('should count 1 playthrough', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))

      const gameStats = insights.stats.forGame(game)
      assert.equal(await gameStats.numPlaythroughs(), 1)

      const overallStats = await gamekeeper.insights.stats.numPlaythroughs({})
      assert.equal(await overallStats.get(game), 1)
    })

    it('tied games should still count as playthrough', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, null))

      const gameStats = insights.stats.forGame(game)
      assert.equal(await gameStats.numPlaythroughs(), 2)

      const overallStats = await insights.stats.numPlaythroughs({})
      assert.equal(await overallStats.get(game), 2)
    })
  })

  describe('calculating winrates', async function () {
    it('single playthrough should have 100% winrate', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))

      const winrates = await insights.stats.winrates({})
      const gameWinrates = winrates.get(game)!
      assert.equal(gameWinrates.winrateFor(alex.id), 1)
      assert.equal(gameWinrates.winrateFor(john.id), 0)
      assert.equal(gameWinrates.highest?.player.id, alex.id)
      assert.equal(gameWinrates.highest?.winrate, 1)

      const overallWinrates = await insights.stats.overallWinrates()
      assert.equal(overallWinrates.winrateFor(alex.id), 1)
      assert.equal(overallWinrates.winrateFor(john.id), 0)
      assert.equal(overallWinrates.highest?.player.id, alex.id)
      assert.equal(overallWinrates.highest?.winrate, 1)
    })

    it('single game with multiple playthroughs', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, john.id))

      const winrates = await insights.stats.winrates({})
      const gameWinrates = winrates.get(game)!
      assert.equal(gameWinrates.winrateFor(alex.id), 2 / 3)
      assert.equal(gameWinrates.winrateFor(john.id), 1 / 3)
      assert.equal(gameWinrates.highest?.player.id, alex.id)
      assert.equal(gameWinrates.highest?.winrate, 2 / 3)

      const overallWinrates = await insights.stats.overallWinrates()
      assert.equal(overallWinrates.winrateFor(alex.id), 2 / 3)
      assert.equal(overallWinrates.winrateFor(john.id), 1 / 3)
      assert.equal(overallWinrates.highest?.player.id, alex.id)
      assert.equal(overallWinrates.highest?.winrate, 2 / 3)
    })

    it('tied games should be ignored for winrates', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, null)) // tie

      const winrates = await insights.stats.winrates({})
      const gameWinrates = winrates.get(game)!
      assert.equal(gameWinrates.winrateFor(alex.id), 1)
      assert.equal(gameWinrates.winrateFor(john.id), 0)
      assert.equal(gameWinrates.highest?.player.id, alex.id)
      assert.equal(gameWinrates.highest?.winrate, 1)

      const overallWinrates = await insights.stats.overallWinrates()
      assert.equal(overallWinrates.winrateFor(alex.id), 1)
      assert.equal(overallWinrates.winrateFor(john.id), 0)
      assert.equal(overallWinrates.highest?.player.id, alex.id)
      assert.equal(overallWinrates.highest?.winrate, 1)
    })

    it('multiple games', async function () {
      const { gameplay, insights } = gamekeeper

      const vs1 = await gameplay.games.create(Factory.createGame({ name: 'game1' }))
      const vs2 = await gameplay.games.create(Factory.createGame({ name: 'game2' }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(vs1.id, alex.id))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(vs1.id, john.id))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(vs2.id, john.id))

      const winrates = await insights.stats.winrates({})
      const vs1Winrates = winrates.get(vs1)!
      assert.equal(vs1Winrates.winrateFor(alex.id), 1 / 2)
      assert.equal(vs1Winrates.winrateFor(john.id), 1 / 2)
      assert.equal(vs1Winrates.highest?.winrate, 1 / 2)

      const vs2Winrates = winrates.get(vs2)!
      assert.equal(vs2Winrates.winrateFor(alex.id), 0)
      assert.equal(vs2Winrates.winrateFor(john.id), 1)
      assert.equal(vs2Winrates.highest?.player.id, john.id)
      assert.equal(vs2Winrates.highest?.winrate, 1)

      const overallWinrates = await insights.stats.overallWinrates()
      assert.equal(overallWinrates.winrateFor(alex.id), 1 / 3)
      assert.equal(overallWinrates.winrateFor(john.id), 2 / 3)
      assert.equal(overallWinrates.highest?.player.id, john.id)
      assert.equal(overallWinrates.highest?.winrate, 2 / 3)
    })

    it('coop games', async function () {
      const { gameplay, insights } = gamekeeper

      const vs = await gameplay.games.create(Factory.createGame({ name: 'vs', type: GameType.VS }))
      const coop = await gameplay.games.create(Factory.createGame({ name: 'coop', type: GameType.COOP }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(vs.id, alex.id))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough(coop.id, false))

      const winrates = await insights.stats.winrates({})
      const vsWinrates = winrates.get(vs)!
      assert.equal(vsWinrates.winrateFor(alex.id), 1)
      assert.equal(vsWinrates.winrateFor(john.id), 0)
      assert.equal(vsWinrates.highest?.player.id, alex.id)
      assert.equal(vsWinrates.highest?.winrate, 1)

      const coopWinrates = winrates.get(coop)!
      assert.equal(coopWinrates.winrateFor(alex.id), 0)
      assert.equal(coopWinrates.winrateFor(john.id), 0)
      assert.equal(coopWinrates.highest?.winrate, 0)

      const overallWinrates = await insights.stats.overallWinrates()
      assert.equal(overallWinrates.winrateFor(alex.id), 1 / 2)
      assert.equal(overallWinrates.winrateFor(john.id), 0)
      assert.equal(overallWinrates.highest?.player.id, alex.id)
      assert.equal(overallWinrates.highest?.winrate, 1 / 2)
    })

    it('winrate using latest playthroughs', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, john.id))

      const winrates = await insights.stats.winrates({})
      const gameWinrates = winrates.get(game)!
      assert.equal(gameWinrates.winrateFor(alex.id), 2 / 3)
      assert.equal(gameWinrates.winrateFor(john.id), 1 / 3)
      assert.equal(gameWinrates.highest?.player.id, alex.id)
      assert.equal(gameWinrates.highest?.winrate, 2 / 3)

      const overallWinrates = await insights.stats.overallWinrates()
      assert.equal(overallWinrates.winrateFor(alex.id), 2 / 3)
      assert.equal(overallWinrates.winrateFor(john.id), 1 / 3)
      assert.equal(overallWinrates.highest?.player.id, alex.id)
      assert.equal(overallWinrates.highest?.winrate, 2 / 3)

      const latestWinrates = await insights.stats.winrates({ latestPlaythroughs: 2 })
      const latestGameWinrates = latestWinrates.get(game)!
      assert.equal(latestGameWinrates.winrateFor(alex.id), 1, 'winrate for alex')
      assert.equal(latestGameWinrates.winrateFor(john.id), 0, 'winrate for john')
      assert.equal(latestGameWinrates.highest?.player.id, alex.id, 'winner should be alex')
      assert.equal(latestGameWinrates.highest?.winrate, 1, 'winners winrate should be 100%')

      const latestOverallWinrates = await insights.stats.overallWinrates({ latestPlaythroughs: 2 })
      assert.equal(latestOverallWinrates.winrateFor(alex.id), 1, 'overall winrate for alex')
      assert.equal(latestOverallWinrates.winrateFor(john.id), 0, 'overall winrate for john')
      assert.equal(latestOverallWinrates.highest?.player.id, alex.id, 'overall winner should be alex')
      assert.equal(latestOverallWinrates.highest?.winrate, 1, 'overall highest winrate should be 100%')
    })
  })

  describe('calculating scoring', async function () {
    it('no scores results in undefined score stats', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats, undefined)
    })

    it('game with no scoring type results in undefined score stats', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS, scoring: ScoringType.NO_SCORE }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id, Factory.createScores(10, 20)))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats, undefined)
    })

    it('single vs playthrough with all scores', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id, Factory.createScores(10, 20)))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 15)
      assert.equal(scoreStats!.bestScore.score, 20)
      assert.equal(scoreStats!.bestScore.player!.id, alex.id)
    })

    it('single vs low score playthrough with all scores', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS, scoring: ScoringType.LOWEST_WINS }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id, Factory.createScores(10, 20)))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 15)
      assert.equal(scoreStats!.bestScore.score, 10)
      assert.equal(scoreStats!.bestScore.player!.id, john.id)
    })

    it('multiple coop playthroughs', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.COOP, scoring: ScoringType.LOWEST_WINS }))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough(game.id, true, 20))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough(game.id, true, 10))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough(game.id, false, 30))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough(game.id, false))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 20)
      assert.equal(scoreStats!.bestScore.score, 10)
      assert.equal(scoreStats!.bestScore.player, undefined)
    })

    it('playthroughs with no scores should not effect averages', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS, scoring: ScoringType.HIGHEST_WINS }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id, Factory.createScores(10, 20)))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 15)
    })
  })

  describe('play streak streak', async function () {
    it('no playthroughs should be streak of zero', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS }))

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 0, 'current streak')
      assert.equal(bestStreak, 0, 'best streak')
    })

    it('single playthrough should be streak of one', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough(game.id, alex.id))

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 1, 'current streak')
      assert.equal(bestStreak, 1, 'best streak')
    })

    it('multiple playthroughs on same day should be streak of one', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS }))
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 1)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 1)
      })

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 1, 'current streak')
      assert.equal(bestStreak, 1, 'best streak')
    })

    it('multiple playthroughs on adjacent days', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS }))
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 2)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 1)
      })

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 2, 'current streak')
      assert.equal(bestStreak, 2, 'best streak')
    })

    it('multiple playthroughs on adjacent days with break', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS }))
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 10)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 9)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 3)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 2)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 1)
      })

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 2, 'current streak')
      assert.equal(bestStreak, 3, 'best streak')
    })
  })

  describe('plays by date', async function () {
    it('no playthroughs should be empty array', async function () {
      const { gameplay, insights } = gamekeeper

      const playsByDate = await insights.stats.numPlaysByDate()
      assert.equal(playsByDate.length, 0)
    })

    it('multiple playthroughs on same day', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS }))
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 1)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 1)
      })

      const playsByDate = await insights.stats.numPlaysByDate()
      assert.equal(playsByDate.length, 1, 'one item')
      assert.equal(playsByDate[0].plays, 2, 'num plays')
      assert.equal(playsByDate[0].date.toISOString(), new Date(2000, 0, 1).toISOString(), 'num plays')
    })

    it('multiple playthroughs should have multiple days with num plays', async function () {
      const { gameplay, insights } = gamekeeper

      const game = await gameplay.games.create(Factory.createGame({ type: GameType.VS }))
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 3)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 3)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough(game.id, alex.id),
        playedOn: new Date(2000, 0, 1)
      })

      const playsByDate = await insights.stats.numPlaysByDate()
      assert.equal(playsByDate.length, 2, 'multiple item')
    })
  })

})