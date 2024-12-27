import 'express-async-errors'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { GameId, NewGameData, NewPlayerData, NotFoundError, GameKeeperFactory, PlaythroughId, UpdatedGameData } from '@gamekeeper/core'
import { DbServices } from '@gamekeeper/db-services'
import { GamekeeperViewService, Route } from '@gamekeeper/views'
import { ApiNewPlaythroughDto, toNewPlaythroughData, toPlaythroughQueryOptions } from './playthrough'
import { config } from './config'
import { InvalidParamsError } from './InvalidParamsError'
import { toStatsQuery } from './stats'


// setup express app
const app = express()
app.use(express.json())
app.use(cors())
app.use(logging)

// create and extract services
const dbServices = new DbServices(config.dbPath)
const {
  gameService,
  playerService,
  playthroughService,
  statsService
} = dbServices


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

// update game
app.patch(`${Route.GAMES}/:id`, async function (req, res) {
  const data = req.body as Omit<UpdatedGameData, 'id'>
  const game = await gameService.updateGame({ ...data, id: req.params.id as GameId })
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


// get specific playthrough
app.get(`${Route.PLAYTHROUGHS}/:id`, async function(req, res) {
  const playthrough = await playthroughService.getPlaythrough(req.params.id as PlaythroughId)
  res.json({ data: playthrough })
})

// get playthroughs
app.get(Route.PLAYTHROUGHS, async function (req, res) {
  const query = toPlaythroughQueryOptions(req)
  const playthroughs = await playthroughService.getPlaythroughs(query)
  res.json({ data: playthroughs })
})

// create playthrough
app.post(Route.PLAYTHROUGHS, async function (req, res) {
  const dto = req.body as ApiNewPlaythroughDto
  const data = toNewPlaythroughData(dto)

  const playthrough = await playthroughService.addPlaythrough(data)
  res.json({ data: playthrough })
})

// remove playthrough
app.delete(`${Route.PLAYTHROUGHS}/:id`, async function(req, res) {
  await playthroughService.removePlaythrough(req.params.id as PlaythroughId)
  res.json({ data: null })
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
app.get(Route.STATS.OVERALL_WINRATES, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getOverallWinrates(query)
  res.json({ data: stats })
})
app.get(Route.STATS.NUM_UNIQUE_GAMES_PLAYED, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getNumUniqueGamesPlayed(query.year)
  res.json({ data: stats })
})
app.get(Route.STATS.SCORE_STATS, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getScoreStats(query)
  res.json({ data: stats })
})
app.get(Route.STATS.NUM_PLAYS_BY_DATE, async function (req, res) {
  const query = toStatsQuery(req)
  const stats = await statsService.getNumPlaysByDate(query)
  res.json({ data: stats })
})


//
// views
// =====


app.get('/stats', async function (req, res) {
  const gamekeeper = GameKeeperFactory.create(dbServices)
  await gamekeeper.gameplay.hydrate()
  const gamekeeperViews = new GamekeeperViewService(gamekeeper)
  const summaryView = await gamekeeperViews.getSummaryView()
  res.json({ data: summaryView })
})


//
// dashboard image
// ===============


// app.get('/dashboard-image', async function (req, res) {
//   const imageBuffer = await dashboardImage()
//   res.set('Content-type', 'image/png')
//   res.set('Content-Disposition', 'inline; filename="dashboard.png"')
//   res.send(imageBuffer)
// })


//
// init
// ====


// note: error handling has to be after app.get
app.use(errorHandler)

// start listening
app.listen(config.port)
console.info(`listening on ${config.port}`)


//
// custom middleware
// =================


function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err)
  }
  
  if (err instanceof InvalidParamsError) {
    res.status(400)
    res.json({ error: err.message })
  }
  else if (err instanceof NotFoundError) {
    res.status(404)
    res.json({ error: 'could not find resource' })
  }
  else {
    res.status(500)
    res.json({ error: 'Something went wrong' })
  }

  next(err)
}

// function cacheHandler(req: Request, res: Response, next: NextFunction) {
//   res.setHeader('Cache-Control', 'public, max-age=60')
//   next()
// }

function logging(req: Request, res: Response, next: NextFunction) {
  console.info(`${req.method}: ${req.url}`)
  if (Object.keys(req.body).length > 0) {
    console.info(` > body:`, req.body)
  }
  next()
}