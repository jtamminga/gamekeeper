const assert = require('assert')
const { GameFactory, GameType, ScoringType, PlaythroughFactory, Player } = require('../dist')

describe('game', function () {
  describe('vs game', function () {
    describe('with one playthrough', function () {
      const game = GameFactory.create({
        id: 1,
        name: 'test',
        type: GameType.VS,
        scoring: ScoringType.HIGHEST_WINS
      })
  
      const john = new Player({ id: 1, name: 'john' })
      const alex = new Player({ id: 2, name: 'alex' })
      const players = [john, alex]
  
      const scores = new Map()
      scores.set(john, 10)
      scores.set(alex, 20)
      const date = new Date(2000, 0, 1) 
  
      const playthrough = PlaythroughFactory.createVs({
        game,
        players,
        scores,
        winner: alex,
        playedOn: date
      })
  
      game.record(playthrough)
  
      it('should have plays', function () {
        assert.ok(game.hasPlays)
      })
  
      it('last played should be same as playthrough', function () {
        assert.equal(game.getStats().getLastPlayed(), playthrough.playedOn)
      })

      it('should be one played', function () {
        assert.equal(game.getStats().getPlayCount(), 1)
      })

      it('winrates should make sense', function () {
        assert.equal(game.getStats().getWinrates().get(1), 0)
        assert.equal(game.getStats().getWinrates().get(2), 1)
      })
    })
  })
})