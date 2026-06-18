import assert from 'assert'
import { AddressInfo } from 'net'
import http from 'http'
import { ApiServer } from '@gamekeeper/api'
import { GameKeeper, GameKeeperFactory, Gameplay } from '@gamekeeper/core'
import { Factory } from './Factory'
import { ApiServices } from '@gamekeeper/api-services'
import { ViewService } from '@gamekeeper/views'


describe('e2e', function () {

  let server: http.Server
  let gamekeeper: GameKeeper
  let gameplay: Gameplay
  let viewService: ViewService

  before(function (done) {
    const app = ApiServer.create({ dbPath: ':memory:' })
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

})
