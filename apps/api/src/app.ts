import { ApiPlaythroughDto, toPlaythroughData, toPlaythroughQueryOptions } from './playthrough'
import { config } from './config'
import { DbServices } from '@gamekeeper/db-services'
import { Route } from '@gamekeeper/api-services'
import { toStatsQuery } from './stats'
import { type GameId } from '@gamekeeper/core'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { InvalidParamsError } from './InvalidParamsError'
import 'express-async-errors'


// setup express app
const app = express()
app.use(express.json())
app.use(cors())

// create and extract services
const {
  gameService,
  playerService,
  playthroughService,
  statsService
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
app.get(Route.PLAYTHROUGHS, async function (req, res) {
  const query = toPlaythroughQueryOptions(req)
  const playthroughs = await playthroughService.getPlaythroughs(query)
  res.json({ data: playthroughs })
})

// create playthrough
app.post(Route.PLAYTHROUGHS, async function (req, res) {
  const dto = req.body as ApiPlaythroughDto
  const data = toPlaythroughData(dto)

  const playthrough = await playthroughService.addPlaythrough(data)
  res.json({ data: playthrough })
})

// stats
app.get(Route.STATS.LAST_PLAYTHROUGHS, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getLastPlaythroughs(query)
  res.json({ data: stats })
})
app.get(Route.STATS.NUM_PLAYTHROUGHS, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getNumPlaythroughs(query)
  res.json({ data: stats })
})
app.get(Route.STATS.WINRATES, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getWinrates(query)
  res.json({ data: stats })
})


// set custom error handling
app.use(errorHandler)

// start listening
app.listen(config.port)
console.info(`listening on ${config.port}`)


// error handling
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  
  if (err instanceof InvalidParamsError) {
    res.status(400)
    res.json({ error: err.message })
  }
  else {
    res.status(500)
    res.json({ error: 'Something went wrong' })
  }

  next(err)
}