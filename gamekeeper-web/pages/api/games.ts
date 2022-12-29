import type { NextApiRequest, NextApiResponse } from 'next'
import { GameData, GameId } from 'gamekeeper-core'
import { GameApiResponse, gamekeeper } from 'utils'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GameApiResponse>
) {

  if (req.method !== 'GET') {
    throw new Error('only supports GET')
  }

  let games: GameData[] = []

  if (req.query.id) {
    const id = req.query.id as GameId
    const game = await gamekeeper.games.get(id)
    games = [game.toData()]
  } else {
    games = (await gamekeeper.games.all()).map(g => g.toData())
  }

  res.status(200).json({ games })
}