import { ApiPlaythroughDto, toPlaythroughData } from './playthrough'
import { config } from './config'
import { DbServices } from '@gamekeeper/db-services'
import { type GameId } from '@gamekeeper/core'
import express from 'express'
import { Route } from '@gamekeeper/api-services'
import cors from 'cors'


// setup express app
const app = express()
app.use(express.json())
app.use(cors())


// create and extract services
const {
  gameService,
  playerService,
  playthroughService
} = new DbServices(config.dbPath)


// get all games
app.get(Route.GAMES, async function (_, res) {
  const games = await gameService.getGames()
  res.json({ data: games })
})

// get game by id
app.get(`${Route.GAMES}/:id`, async function (req, res) {
  const game = await gameService.getGame(req.params.id as GameId)
  res.json({ data: game })
})

// get all players
app.get(Route.PLAYERS, async function (_, res) {
  const players = await playerService.getPlayers()
  res.json({ data: players })
})

// get playthroughs
app.get(Route.PLAYTHROUGHS, async function (_, res) {
  const playthroughs = await playthroughService.getPlaythroughs()
  res.json({ data: playthroughs })
})

// create playthrough
app.post(Route.PLAYTHROUGHS, async function (req, res) {
  const dto = req.body as ApiPlaythroughDto
  const data = toPlaythroughData(dto)

  const playthrough = await playthroughService.addPlaythrough(data)
  res.json({ data: playthrough })
})


// start listening
app.listen(config.port)
console.info(`listening on ${config.port}`)