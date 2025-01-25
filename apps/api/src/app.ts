import 'express-async-errors'
import cors from 'cors'
import express, { NextFunction, Request, Response } from 'express'
import { GameId, NewGameData, NewPlayerData, NotFoundError, GameKeeperFactory, PlaythroughId, UpdatedGameData, PlayerId, UpdatedGoalData, GoalId } from '@gamekeeper/core'
import { DbServices, UserId } from '@gamekeeper/db-services'
import { GamekeeperViewService, Route } from '@gamekeeper/views'
import { ApiNewPlaythroughDto, toNewPlaythroughData, toPlaythroughQueryOptions } from './playthrough'
import { config } from './config'
import { InvalidParamsError } from './InvalidParamsError'
import { toStatsQuery } from './stats'
import { toGoalsQuery, toNewGoalData, toUpdatedGoalData } from './goals'
import { auth, UnauthorizedError } from 'express-oauth2-jwt-bearer'


// setup express app
const app = express()
app.use(express.json())
app.use(cors())
app.use(logging)

// static files for certs
app.use(express.static('public', { dotfiles: 'allow' }))

if (config.authEnabled && config.auth0) {
  const jwtCheck = auth({
    audience: config.auth0.audience,
    issuerBaseURL: config.auth0.issuerBaseURL,
    tokenSigningAlg: 'RS256'
  });
  
  app.use(jwtCheck)
  console.info('auth enabled')
}

// create and extract services
const dbServices = new DbServices(config.dbPath)
const {
  gameService,
  playerService,
  playthroughService,
  goalService,
  statsService
} = dbServices


//
// games
// =====


// get all games
app.get(Route.GAMES, async function (req, res) {
  const userId = getUserId(req)
  const games = await gameService.getGames(userId)
  res.json({ data: games })
})

// get game by id
app.get(`${Route.GAMES}/:id`, async function (req, res) {
  const userId = getUserId(req)
  const game = await gameService.getGame(req.params.id as GameId, userId)
  res.json({ data: game })
})

// create game
app.post(Route.GAMES, async function (req, res) {
  const userId = getUserId(req)
  const data = req.body as NewGameData
  const game = await gameService.addGame(data, userId)
  res.json({ data: game })
})

// update game
app.patch(`${Route.GAMES}/:id`, async function (req, res) {
  const userId = getUserId(req)
  const data = req.body as Omit<UpdatedGameData, 'id'>
  const game = await gameService.updateGame({ ...data, id: req.params.id as GameId }, userId)
  res.json({ data: game })
})


//
// players
// =======


// get all players
app.get(Route.PLAYERS, async function (req, res) {
  const userId = getUserId(req)
  const players = await playerService.getPlayers(userId)
  res.json({ data: players })
})

// create player
app.post(Route.PLAYERS, async function (req, res) {
  const userId = getUserId(req)
  const data = req.body as NewPlayerData
  const player = await playerService.addPlayer(data, userId)
  res.json({ data: player })
})

app.patch(`${Route.PLAYERS}/:id`, async function (req, res) {
  const userId = getUserId(req)
  const data = req.body as Omit<UpdatedGameData, 'id'>
  const player = await playerService.updatePlayer({ ...data, id: req.params.id as PlayerId }, userId)
  res.json({ data: player })
})


//
// playthroughs
// ============


// get specific playthrough
app.get(`${Route.PLAYTHROUGHS}/:id`, async function(req, res) {
  const userId = getUserId(req)
  const playthrough = await playthroughService.getPlaythrough(req.params.id as PlaythroughId, userId)
  res.json({ data: playthrough })
})

// get playthroughs
app.get(Route.PLAYTHROUGHS, async function (req, res) {
  const userId = getUserId(req)
  const query = toPlaythroughQueryOptions(req)
  const playthroughs = await playthroughService.getPlaythroughs(query, userId)
  res.json({ data: playthroughs })
})

// create playthrough
app.post(Route.PLAYTHROUGHS, async function (req, res) {
  const userId = getUserId(req)
  const dto = req.body as ApiNewPlaythroughDto
  const data = toNewPlaythroughData(dto)

  const playthrough = await playthroughService.addPlaythrough(data, userId)
  res.json({ data: playthrough })
})

// remove playthrough
app.delete(`${Route.PLAYTHROUGHS}/:id`, async function(req, res) {
  const userId = getUserId(req)
  await playthroughService.removePlaythrough(req.params.id as PlaythroughId, userId)
  res.json({ data: null })
})


//
// goals
// =====


app.get(`${Route.GOALS}/:id`, async function (req, res) {
  const userId = getUserId(req)
  const goal = await goalService.getGoal(req.params.id as GoalId, userId)
  res.json({ data: goal })
})
app.get(Route.GOALS, async function (req, res) {
  const userId = getUserId(req)
  const query = toGoalsQuery(req)
  const goals = await goalService.getGoals(query, userId)
  res.json({ data: goals })
})
app.post(Route.GOALS, async function (req, res) {
  const userId = getUserId(req)
  const data = toNewGoalData(req)
  const goal = await goalService.addGoal(data, userId)
  res.json({ data: goal })
})
app.patch(`${Route.GOALS}/:id`, async function (req, res) {
  const userId = getUserId(req)
  const data = toUpdatedGoalData(req)
  const goal = await goalService.updateGoal({ ...data, id: req.params.id as GoalId }, userId)
  res.json({ data: goal })
})
app.delete(`${Route.GOALS}/:id`, async function (req, res) {
  const userId = getUserId(req)
  await goalService.removeGoal(req.params.id as GoalId, userId)
  res.json({ data: null })
})


//
// stats
// =====


app.get(Route.STATS.LAST_PLAYTHROUGHS, async function (req, res) {
  const userId = getUserId(req)
  const query = toStatsQuery(req)
  const stats = await statsService.getLastPlayed(query, userId)
  res.json({ data: stats })
})
app.get(Route.STATS.NUM_PLAYTHROUGHS, async function (req, res) {
  const userId = getUserId(req)
  const query = toStatsQuery(req)
  const stats = await statsService.getNumPlays(query, userId)
  res.json({ data: stats })
})
app.get(Route.STATS.WINRATES, async function (req, res) {
  const userId = getUserId(req)
  const query = toStatsQuery(req)
  const stats = await statsService.getWinrates(query, userId)
  res.json({ data: stats })
})
app.get(Route.STATS.PLAYS_BY_MONTH, async function (req, res) {
  const userId = getUserId(req)
  const query = toStatsQuery(req)
  const stats = await statsService.getNumPlaysByMonth(query, userId)
  res.json({ data: stats })
})
app.get(Route.STATS.OVERALL_WINRATES, async function (req, res) {
  const userId = getUserId(req)
  const query = toStatsQuery(req)
  const stats = await statsService.getOverallWinrates(query, userId)
  res.json({ data: stats })
})
app.get(Route.STATS.NUM_UNIQUE_GAMES_PLAYED, async function (req, res) {
  const userId = getUserId(req)
  const query = toStatsQuery(req)
  const stats = await statsService.getNumUniqueGamesPlayed(query.year, userId)
  res.json({ data: stats })
})
app.get(Route.STATS.SCORE_STATS, async function (req, res) {
  const userId = getUserId(req)
  const query = toStatsQuery(req)
  const stats = await statsService.getScoreStats(query, userId)
  res.json({ data: stats })
})
app.get(Route.STATS.NUM_PLAYS_BY_DATE, async function (req, res) {
  const userId = getUserId(req)
  const query = toStatsQuery(req)
  const stats = await statsService.getNumPlaysByDate(query, userId)
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
  else if (err instanceof UnauthorizedError) {
    res.status(401)
    res.json({ error: 'unauthorized' })
  }
  else {
    res.status(500)
    res.json({ error: 'something went wrong' })
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

function getUserId(req: Request): UserId | undefined {
  return req.auth?.payload.sub as UserId | undefined
}