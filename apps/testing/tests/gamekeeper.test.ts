import assert from 'assert'
import { Factory } from './Factory'

describe('gameplay behaviour', async function () {

  it('creating gameplay should not hydrate anything', async function () {
    const {gameplay} = Factory.createGamekeeper(true)

    const players = gameplay.players.all()
    const games = gameplay.games.all()
    const playthroughs = gameplay.playthroughs.all()

    assert.equal(players.length, 0)
    assert.equal(games.length, 0)
    assert.equal(playthroughs.length, 0)
  })

  it('hydrating gameplay should not load playthroughs by default', async function () {
    const {gameplay} = Factory.createGamekeeper(true)
    await gameplay.hydrate()

    const players = gameplay.players.all()
    const games = gameplay.games.all()
    const playthroughs = gameplay.playthroughs.all()

    assert.ok(players.length > 0)
    assert.ok(games.length > 0)
    assert.ok(playthroughs.length === 0)
  })

  it('hydrating gameplay with playthrough options should hydrate playthroughs', async function () {
    const {gameplay} = Factory.createGamekeeper(true)
    await gameplay.hydrate({ limit: 1 })

    const players = gameplay.players.all()
    const games = gameplay.games.all()
    const playthroughs = gameplay.playthroughs.all()

    assert.ok(players.length > 0)
    assert.ok(games.length > 0)
    assert.ok(playthroughs.length > 0)
  })

})