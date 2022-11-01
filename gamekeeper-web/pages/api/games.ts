import { Game, GameData, GameId, GameKeeperFactory } from 'gamekeeper-core'
import type { NextApiRequest, NextApiResponse } from 'next'
import pathUtils from 'path'

type Data = {
  games: GameData[]
}

const path = pathUtils.resolve('/home/john/Insync/john.h.tamminga@gmail.com/OneDrive/Documents/gamekeeper.db')
const gamekeeper = GameKeeperFactory.create(path)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {

  if (req.method !== 'GET') {
    throw new Error('only supports GET')
  }

  let gamesData: GameData[] = []

  if (req.query.id) {
    const id = req.query.id as GameId
    const game = await gamekeeper.games.get(req.query.id as GameId)
    gamesData = [toData(game)]
  } else {
    const games = await gamekeeper.games.all()
    gamesData = games.map(game => toData(game))
  }

  res.status(200).json({ games: gamesData })
}


function toData(game: Game): GameData {
  return {
    id: game.id!,
    name: game.name,
    type: game.type,
    scoring: game.scoring
  }
}
