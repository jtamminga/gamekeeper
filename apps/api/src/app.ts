import { ApiPlaythroughDto, toPlaythroughData, toPlaythroughQueryOptions } from './playthrough'
import { config } from './config'
import { DbServices } from '@gamekeeper/db-services'
import { toStatsQuery } from './stats'
import { type GameId, Route, NewGameData, NewPlayerData } from '@gamekeeper/core'
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


//
// games
// =====


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

// create game
app.post(Route.GAMES, async function (req, res) {
  const data = req.body as NewGameData
  const game = await gameService.addGame(data)
  res.json({ data: game })
})


//
// players
// =======


// get all players
app.get(Route.PLAYERS, async function (_, res) {
  const players = await playerService.getPlayers()
  res.json({ data: players })
})

// create player
app.post(Route.PLAYERS, async function (req, res) {
  const data = req.body as NewPlayerData
  const player = await playerService.addPlayer(data)
  res.json({ data: player })
})


//
// playthroughs
// ============


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


//
// stats
// =====


app.get(Route.STATS.LAST_PLAYTHROUGHS, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getLastPlayed(query)
  res.json({ data: stats })
})
app.get(Route.STATS.NUM_PLAYTHROUGHS, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getNumPlays(query)
  res.json({ data: stats })
})
app.get(Route.STATS.WINRATES, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getWinrates(query)
  res.json({ data: stats })
})
app.get(Route.STATS.PLAYS_BY_MONTH, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getNumPlaysByMonth(query)
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