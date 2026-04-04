import { CoopWinrates, GameKeeper, Gameplay, Insights, ScoringType, Winrates } from '@gamekeeper/core'
import assert from 'assert'
import { Factory } from './Factory'

const alex = Factory.alex
const john = Factory.john
const otherPlayer = Factory.otherPlayer

describe('stats', function () {

  let gamekeeper: GameKeeper
  let gameplay: Gameplay
  let insights: Insights

  beforeEach(async function () {
    gamekeeper = Factory.createGamekeeper()
    await gamekeeper.gameplay.hydrate()
    
    gameplay = gamekeeper.gameplay
    insights = gamekeeper.insights
  })

  describe('playthrough counts', async function () {
    it('should count 1 playthrough', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))

      const gameStats = insights.stats.forGame(game)
      assert.equal(await gameStats.numPlaythroughs(), 1)
    })

    it('tied games should still count as playthrough', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: null }))

      const gameStats = insights.stats.forGame(game)
      assert.equal(await gameStats.numPlaythroughs(), 2)
    })
  })

  describe('calculating winrates', function () {
    it('no playthroughs should have no winrate', async function() {
      const game = await gameplay.games.create(Factory.createVsGame())

      const winrates = await insights.stats.winrates({})
      const gameWinrates = winrates.get(game)
      assert.equal(gameWinrates, undefined)
    })

    describe('vs games', function () {
      it('single playthrough', async function () {
        const game = await gameplay.games.create(Factory.createVsGame())
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))

        const winrates = await insights.stats.winrates({})
        const gameWinrates = winrates.get(game)!
        assert.ok(gameWinrates instanceof Winrates)
        assert.equal(gameWinrates.winrateFor(alex.id), 1)
        assert.equal(gameWinrates.winrateFor(john.id), 0)
        assert.equal(gameWinrates.highest?.player.id, alex.id)
        assert.equal(gameWinrates.highest?.winrate, 1)
      })

      it('single tied playthrough', async function () {
        const game = await gameplay.games.create(Factory.createVsGame())
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: null }))

        const winrates = await insights.stats.winrates({})
        const gameWinrates = winrates.get(game)!
        assert.ok(gameWinrates instanceof Winrates)
        assert.equal(gameWinrates.for(alex.id), undefined)
        assert.equal(gameWinrates.for(john.id), undefined)
      })

      it('single game with multiple playthroughs', async function () {
        const game = await gameplay.games.create(Factory.createVsGame())
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: john.id }))

        const winrates = await insights.stats.winrates({})
        const gameWinrates = winrates.get(game)!
        assert.ok(gameWinrates instanceof Winrates)
        assert.equal(gameWinrates.winrateFor(alex.id), 2 / 3)
        assert.equal(gameWinrates.winrateFor(john.id), 1 / 3)
        assert.equal(gameWinrates.highest?.player.id, alex.id)
        assert.equal(gameWinrates.highest?.winrate, 2 / 3)
      })

      it('tied games should be ignored for winrates', async function () {
        const game = await gameplay.games.create(Factory.createVsGame())
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: null })) // tie

        const winrates = await insights.stats.winrates({})
        const gameWinrates = winrates.get(game)!
        assert.ok(gameWinrates instanceof Winrates)
        assert.equal(gameWinrates.winrateFor(alex.id), 1)
        assert.equal(gameWinrates.winrateFor(john.id), 0)
        assert.equal(gameWinrates.highest?.player.id, alex.id)
        assert.equal(gameWinrates.highest?.winrate, 1)
      })

      it('multiple games', async function () {
        const vs1 = await gameplay.games.create(Factory.createVsGame({ name: 'game1' }))
        const vs2 = await gameplay.games.create(Factory.createVsGame({ name: 'game2' }))
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: vs1.id, winnerId: alex.id }))
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: vs1.id, winnerId: john.id }))
        await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: vs2.id, winnerId: john.id }))

        const winrates = await insights.stats.winrates({})
        const vs1Winrates = winrates.get(vs1)!
        assert.ok(vs1Winrates instanceof Winrates)
        assert.equal(vs1Winrates.winrateFor(alex.id), 1 / 2)
        assert.equal(vs1Winrates.winrateFor(john.id), 1 / 2)
        assert.equal(vs1Winrates.highest?.winrate, 1 / 2)

        const vs2Winrates = winrates.get(vs2)!
        assert.ok(vs2Winrates instanceof Winrates)
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
    })

    describe('coop games', function () {
      it('single playthrough with players winning', async function() {
        const game = await gameplay.games.create(Factory.createCoopGame())
        await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: true }))

        const winrates = await insights.stats.winrates({})
        const gameWinrates = winrates.get(game)
        assert.ok(gameWinrates instanceof CoopWinrates)
        assert.equal(gameWinrates.for(alex.id)!.winrate, 1)
        assert.equal(gameWinrates.for(alex.id)!.plays, 1)
        assert.equal(gameWinrates.for(john.id)!.winrate, 1)
        assert.equal(gameWinrates.for(john.id)!.plays, 1)
        assert.equal(gameWinrates.game.winrate, 0)
        assert.equal(gameWinrates.game.plays, 1)
        assert.equal(gameWinrates.players.winrate, 1)
        assert.equal(gameWinrates.players.plays, 1)
        assert.equal(gameWinrates.highest.type, 'players')
        assert.equal(gameWinrates.highest.winrate, 1)
        assert.equal(gameWinrates.highest.plays, 1)
      })

      it('single playthrough with game winning', async function() {
        const game = await gameplay.games.create(Factory.createCoopGame())
        await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: false }))

        const winrates = await insights.stats.winrates({})
        const gameWinrates = winrates.get(game)
        assert.ok(gameWinrates instanceof CoopWinrates)
        assert.equal(gameWinrates.for(alex.id)!.winrate, 0)
        assert.equal(gameWinrates.for(alex.id)!.plays, 1)
        assert.equal(gameWinrates.for(john.id)!.winrate, 0)
        assert.equal(gameWinrates.for(john.id)!.plays, 1)
        assert.equal(gameWinrates.game.winrate, 1)
        assert.equal(gameWinrates.game.plays, 1)
        assert.equal(gameWinrates.players.winrate, 0)
        assert.equal(gameWinrates.players.plays, 1)
        assert.equal(gameWinrates.highest.type, 'game')
        assert.equal(gameWinrates.highest.winrate, 1)
        assert.equal(gameWinrates.highest.plays, 1)
      })

      it('multiple playthroughs', async function () {
        const game = await gameplay.games.create(Factory.createCoopGame())
        await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: true, playerIds: [alex.id] }))
        await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: false, playerIds: [john.id] }))
        await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: false, playerIds: [john.id] }))
        await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: false, playerIds: [alex.id, john.id] }))
        await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: true, playerIds: [otherPlayer.id] }))

        const winrates = await insights.stats.winrates({})
        const gameWinrates = winrates.get(game)
        assert.ok(gameWinrates instanceof CoopWinrates)
        assert.equal(gameWinrates.for(alex.id)!.winrate, 1 / 2)
        assert.equal(gameWinrates.for(alex.id)!.plays, 2)
        assert.equal(gameWinrates.for(john.id)!.winrate, 0 / 3)
        assert.equal(gameWinrates.for(john.id)!.plays, 3)
        assert.equal(gameWinrates.for(otherPlayer.id)!.winrate, 1)
        assert.equal(gameWinrates.for(otherPlayer.id)!.plays, 1)
        assert.equal(gameWinrates.game.winrate, 3 / 5)
        assert.equal(gameWinrates.game.plays, 5)
        assert.equal(gameWinrates.players.winrate, 2 / 5)
        assert.equal(gameWinrates.players.plays, 5)
        assert.equal(gameWinrates.highest.type, 'game')
        assert.equal(gameWinrates.highest.winrate, 3 / 5)
        assert.equal(gameWinrates.highest.plays, 5)
      })
    })

    it('overall winrates with mixed game types', async function () {
      const vs = await gameplay.games.create(Factory.createVsGame({ name: 'vs' }))
      const coop = await gameplay.games.create(Factory.createCoopGame({ name: 'coop' }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: vs.id, winnerId: alex.id }))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: coop.id, playersWon: false }))

      const overallWinrates = await insights.stats.overallWinrates()
      assert.ok(overallWinrates instanceof Winrates)
      assert.equal(overallWinrates.winrateFor(alex.id), 1 / 2)
      assert.equal(overallWinrates.winrateFor(john.id), 0)
      assert.equal(overallWinrates.highest?.player.id, alex.id)
      assert.equal(overallWinrates.highest?.winrate, 1 / 2)
    })

    it('winrates using latest playthroughs', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: john.id }))

      const latestWinrates = await insights.stats.winrates({ latestPlaythroughs: 2 })
      const latestGameWinrates = latestWinrates.get(game)!
      assert.ok(latestGameWinrates instanceof Winrates)
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
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats, undefined)
    })

    it('game with no scoring type results in undefined score stats', async function () {
      const game = await gameplay.games.create(Factory.createVsGame({ scoring: ScoringType.NO_SCORE }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id, scores: Factory.createScores(10, 20) }))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats, undefined)
    })

    it('single vs playthrough with all scores', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id, scores: Factory.createScores(10, 20) }))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 15)
      assert.equal(scoreStats!.bestScore.score, 20)
      assert.equal(scoreStats!.bestScore.player!.id, alex.id)
    })

    it('single vs low score playthrough with all scores', async function () {
      const game = await gameplay.games.create(Factory.createVsGame({ scoring: ScoringType.LOWEST_WINS }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id, scores: Factory.createScores(10, 20) }))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 15)
      assert.equal(scoreStats!.bestScore.score, 10)
      assert.equal(scoreStats!.bestScore.player!.id, john.id)
    })

    it('multiple coop playthroughs', async function () {
      const game = await gameplay.games.create(Factory.createCoopGame({ scoring: ScoringType.LOWEST_WINS }))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: true, score: 20 }))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: true, score: 10 }))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: false, score: 30 }))
      await gameplay.playthroughs.create(Factory.createCoopPlaythrough({ gameId: game.id, playersWon: false }))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 20)
      assert.equal(scoreStats!.bestScore.score, 10)
      assert.equal(scoreStats!.bestScore.player, undefined)
    })

    it('playthroughs with no scores should not effect averages', async function () {
      const game = await gameplay.games.create(Factory.createVsGame({ scoring: ScoringType.HIGHEST_WINS }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id, scores: Factory.createScores(10, 20) }))
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))

      const scoreStats = await insights.stats.forGame(game).scoreStats()
      assert.equal(scoreStats!.averageScore, 15)
    })
  })

  describe('play streak', async function () {
    it('no playthroughs should be streak of zero', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 0, 'current streak')
      assert.equal(bestStreak, 0, 'best streak')
    })

    it('single playthrough should be streak of one', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create(Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }))

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 1, 'current streak')
      assert.equal(bestStreak, 1, 'best streak')
    })

    it('multiple playthroughs on same day should be streak of one', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 1)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 1)
      })

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 1, 'current streak')
      assert.equal(bestStreak, 1, 'best streak')
    })

    it('multiple playthroughs on adjacent days', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 2)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 1)
      })

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 2, 'current streak')
      assert.equal(bestStreak, 2, 'best streak')
    })

    it('multiple playthroughs on adjacent days with break', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 10)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 9)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 3)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 2)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 1)
      })

      const {currentStreak, bestStreak} = await insights.stats.playStreak()
      assert.equal(currentStreak, 2, 'current streak')
      assert.equal(bestStreak, 3, 'best streak')
    })
  })

  describe('plays by date', async function () {
    it('no playthroughs should be empty array', async function () {
      const playsByDate = await insights.stats.numPlaysByDate()
      assert.equal(playsByDate.length, 0)
    })

    it('multiple playthroughs on same day', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 1)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 1)
      })

      const playsByDate = await insights.stats.numPlaysByDate()
      assert.equal(playsByDate.length, 1, 'one item')
      assert.equal(playsByDate[0].plays, 2, 'num plays')
      assert.equal(playsByDate[0].date.toISOString(), new Date(2000, 0, 1).toISOString(), 'num plays')
    })

    it('multiple playthroughs should have multiple days with num plays', async function () {
      const game = await gameplay.games.create(Factory.createVsGame())
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 3)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 3)
      })
      await gameplay.playthroughs.create({
        ...Factory.createVsPlaythrough({ gameId: game.id, winnerId: alex.id }),
        playedOn: new Date(2000, 0, 1)
      })

      const playsByDate = await insights.stats.numPlaysByDate()
      assert.equal(playsByDate.length, 2, 'multiple item')
    })
  })

})