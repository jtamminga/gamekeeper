import type { NextApiRequest, NextApiResponse } from 'next'
import { gamekeeper, RecordApiResponse } from 'utils'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RecordApiResponse>
) {

  if (req.method === 'GET') {

    const games = await gamekeeper.games.all()
    const players = await gamekeeper.players.all()

    res.status(200).json({
      games: games.map(g => g.toData()),
      players: players.map(p => p.toData())
    })
  }
}
