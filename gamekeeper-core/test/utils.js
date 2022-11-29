const { GameFactory, GameType, ScoringType, Player, PlaythroughFactory } = require('../dist')

function createPlayers() {
  const john = new Player({ id: 1, name: 'john' })
  const alex = new Player({ id: 2, name: 'alex' })
  const players = [john, alex]

  return players
}


function createVsHighScoreGame() {
  const game = GameFactory.create({
    id: 1,
    name: 'test',
    type: GameType.VS,
    scoring: ScoringType.HIGHEST_WINS
  })

  return game
}

function createPlaythrough(game, players, playedOn, johnScore, alexScore) {
  const [john, alex] = players
  const scores = new Map()
  scores.set(john, johnScore)
  scores.set(alex, alexScore)
  const winner = johnScore > alexScore ? john : alex

  const playthrough = PlaythroughFactory.createVs({
    game,
    players,
    scores,
    winner,
    playedOn
  })

  return playthrough
}

exports.createPlayers = createPlayers
exports.createVsHighScoreGame = createVsHighScoreGame
exports.createPlaythrough = createPlaythrough