import assert from 'assert'
import { AddressInfo } from 'net'
import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { ApiServer } from '@gamekeeper/api'
import { GameKeeper, GameKeeperFactory, Gameplay, Scores, ScoringType, VsFlow } from '@gamekeeper/core'
import { Factory } from './Factory'
import { ApiServices } from '@gamekeeper/api-services'
import { ViewService } from '@gamekeeper/views'


describe('e2e', function () {

  let server: http.Server
  let gamekeeper: GameKeeper
  let gameplay: Gameplay
  let viewService: ViewService

  before(function (done) {
    const dirname = path.dirname(fileURLToPath(import.meta.url))
    const initSql = fs.readFileSync(path.resolve(dirname, '../../../packages/db/scripts/create.sql'), 'utf8')
    const app = ApiServer.create({ dbPath: ':memory:', initSql })
    server = app.listen(0, done)
  })

  beforeEach(async function () {
    const { port } = server.address() as AddressInfo
    const services = new ApiServices(`http://localhost:${port}`)
    gamekeeper = GameKeeperFactory.create(services)

    viewService = services.viewService
    gameplay = gamekeeper.gameplay
    await gameplay.hydrate()
  })

  after(function (done) {
    server.close(done)
  })

  it('create a game and view it', async function () {
    const game = await gameplay.games.create(Factory.createVsGame({ name: 'Brass', weight: 1.2 }))
    const gameView = await viewService.getGameView(game.id)
    
    assert.equal(gameView.name, 'Brass')
    assert.equal(gameView.weight, 'Weight: 1.2 / 5')
    assert.equal(gameView.latestPlaythroughs.playthroughs.length, 0)
  })

  it('create a game and update name', async function () {
    const game = await gameplay.games.create(Factory.createVsGame({ name: 'Brass' }))
    game.update({name: 'Brass 2'})
    await gameplay.games.save(game)
    const gameView = await viewService.getGameView(game.id)
    
    assert.equal(gameView.name, 'Brass 2')
    assert.equal(gameView.weight, undefined)
  })

  it('create a vs playthrough', async function () {
    const game = await gameplay.games.create(Factory.createVsGame({ name: 'Brass', scoring: ScoringType.HIGHEST_WINS }))
    const john = await gameplay.players.create({name: 'John'})
    const alex = await gameplay.players.create({name: 'Alex'})
    const flow = await gameplay.playthroughs.startFlow({
      gameId: game.id,
      playedOn: new Date(),
      playerIds: [john.id, alex.id]
    })
    
    assert.ok(flow instanceof VsFlow)
    flow.setScores(new Scores([
      {playerId: john.id, score: 100},
      {playerId: alex.id, score: 90}
    ]))
    const playthrough = await flow.savePlaythrough()
    const playthroughView = await viewService.getPlaythroughView(playthrough.id)

    assert.equal(playthroughView.winnerId, john.id)
    assert.equal(playthroughView.notes, undefined)

    playthrough.update({ notes: 'test' })
    await gameplay.playthroughs.save(playthrough)
    const updatedPlaythroughView = await viewService.getPlaythroughView(playthrough.id)

    assert.equal(updatedPlaythroughView.notes, 'test')
  })

})
