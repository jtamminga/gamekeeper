const assert = require('assert')
const { createVsHighScoreGame, createPlayers, createPlaythrough } = require('./utils')

describe('game', function () {
  describe('vs game', function () {
    describe('with one playthrough', function () {
      const game = createVsHighScoreGame()
      const players = createPlayers()
  
      const playthrough = createPlaythrough(
        game,
        players,
        new Date(2000, 0, 1),
        10,
        20
      )
  
      game.record(playthrough)
  
      it('should have plays', function () {
        assert.ok(game.hasPlays)
      })
  
      it('last played should be same as playthrough', function () {
        assert.equal(game.createStats().getLastPlayed(), playthrough.playedOn)
      })

      it('should be one played', function () {
        assert.equal(game.createStats().getPlayCount(), 1)
      })

      it('winrates should make sense', function () {
        assert.equal(game.createStats().getWinrates().get(1), 0)
        assert.equal(game.createStats().getWinrates().get(2), 1)
      })
    })

    describe('with multiple playthroughs via record', function () {
      const game = createVsHighScoreGame()
      const players = createPlayers()
      
      // alex won
      const one = createPlaythrough(
        game,
        players,
        new Date(2000, 1, 1),
        10,
        20
      )

      // john won
      const two = createPlaythrough(
        game,
        players,
        new Date(2000, 2, 1),
        30,
        20
      )

      // alex won
      const three = createPlaythrough(
        game,
        players,
        new Date(2000, 3, 1),
        10,
        20
      )

      game.record(one)
      game.record(three)
      game.record(two)

      const stats = game.createStats().getData()

      it('should show multiple playthroughs', function () {
        assert.equal(stats.playCount, 3)
      })

      it('last played should be the played on of last playthrough', function () {
        assert.equal(stats.lastPlayed, three.playedOn)
      })

      it('winrates should make sense', function () {
        assert.equal(stats.winrates.get(1), 1/3)
        assert.equal(stats.winrates.get(2), 2/3)
      })

    })

    describe('with multiple playthroughs via bind', function() {
      const game = createVsHighScoreGame()
      const players = createPlayers()
      
      // alex won
      const one = createPlaythrough(
        game,
        players,
        new Date(2000, 1, 1),
        10,
        20
      )

      // john won
      const two = createPlaythrough(
        game,
        players,
        new Date(2000, 2, 1),
        30,
        20
      )

      // alex won
      const three = createPlaythrough(
        game,
        players,
        new Date(2000, 3, 1),
        10,
        20
      )

      game.bindPlaythroughs([one, three, two])

      const stats = game.createStats().getData()

      it('should show multiple playthroughs', function () {
        assert.equal(stats.playCount, 3)
      })

      it('last played should be the played on of last playthrough', function () {
        assert.equal(stats.lastPlayed, three.playedOn)
      })

      it('winrates should make sense', function () {
        assert.equal(stats.winrates.get(1), 1/3)
        assert.equal(stats.winrates.get(2), 2/3)
      })
    })
  })
})