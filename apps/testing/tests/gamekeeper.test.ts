import assert from 'assert'
import { Factory } from './Factory'

describe('gamekeeper behaviour', async function () {

  it('creating gamekeeper should not hydrate anything', async function () {
    const gamekeeper = Factory.createGamekeeper(true)

    const players = gamekeeper.players.all()
    const games = gamekeeper.games.all()
    const playthroughs = gamekeeper.playthroughs.all()

    assert.equal(players.length, 0)
    assert.equal(games.length, 0)
    assert.equal(playthroughs.length, 0)
  })

  it('hydrating gamekeeper should not load playthroughs by default', async function () {
    const gamekeeper = Factory.createGamekeeper(true)
    await gamekeeper.hydrate()

    const players = gamekeeper.players.all()
    const games = gamekeeper.games.all()
    const playthroughs = gamekeeper.playthroughs.all()

    assert.ok(players.length > 0)
    assert.ok(games.length > 0)
    assert.ok(playthroughs.length === 0)
  })

  it('hydrating gamekeeper with playthrough options should hydrate playthroughs', async function () {
    const gamekeeper = Factory.createGamekeeper(true)
    await gamekeeper.hydrate({ limit: 1 })

    const players = gamekeeper.players.all()
    const games = gamekeeper.games.all()
    const playthroughs = gamekeeper.playthroughs.all()

    assert.ok(players.length > 0)
    assert.ok(games.length > 0)
    assert.ok(playthroughs.length > 0)
  })

})