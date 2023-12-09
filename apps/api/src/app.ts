import { config } from './config'
import { type GameId, GameKeeperFactory } from '@gamekeeper/core'
import { DbServices } from '@gamekeeper/db-services'
import express from 'express'
import { ApiPlaythroughDto, toPlaythroughData } from './playthrough'


const app = express()
app.use(express.json())

const dbServices = new DbServices(config.dbPath)
const gamekeeper = GameKeeperFactory.create(dbServices)

gamekeeper.hydrate()

// get all games
app.get('/games', function (_, res) {
  const games = gamekeeper.games.toData()
  res.json({ games })
})

// get game by id
app.get('/games/:id', function (req, res) {
  const game = gamekeeper.games
    .get(req.params.id as GameId)
    .toData()

  res.json({ game })
})

// get all players
app.get('/players', function (_, res) {
  const players = gamekeeper.players.toData()
  res.json({ players })
})

app.post('/playthrough', async function (req, res) {
  const dto = req.body as ApiPlaythroughDto
  const data = toPlaythroughData(dto)
  
  const playthrough = await gamekeeper.playthroughs.create(data)
  res.json({ playthrough: playthrough.toData() })
})

app.listen(config.port)
console.info(`listening on ${config.port}`)