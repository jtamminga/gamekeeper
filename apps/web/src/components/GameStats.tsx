import { useGamekeeper } from '@app/hooks'
import { Game, Winrates } from '@gamekeeper/core'
import { useEffect, useState } from 'react'


export type Props = {
  game: Game
}
type StatsData = {
  numPlaythroughs: number,
  winrates: Winrates
}


export function GameStats({ game }: Props) {

  const gamekeeper = useGamekeeper()
  const [data, setData] = useState<StatsData>()

  useEffect(() => {
    async function loadData() {
      const stats = gamekeeper.stats.forGame(game)
      const [numPlaythroughs, winrates] = await Promise.all([
        stats.getNumPlaythroughs(),
        stats.getWinrates(),
        gamekeeper.playthroughs.hydrate({ gameId: game.id, limit: 5 })
      ])

      setData({ numPlaythroughs, winrates })
    }
    loadData()
  }, [game, gamekeeper])

  if (!data) {
    return null
  }

  return (
    <div>
      <table>
        <tbody>
          <tr>
            <td>Plays</td>
            <td>{data.numPlaythroughs}</td>
          </tr>
          <tr>
            <td>Winrate</td>
            <td>
              <ul>
                {data.winrates.winrates.map((winrate, index) =>
                  <li key={`winrate-${index}`}>
                    {winrate.player.name} {winrate.winrate}
                  </li>
                )}
              </ul>
            </td>
          </tr>
          <tr>
            <td>Lastest Plays</td>
            <td>
              <ul>
                {gamekeeper.playthroughs.latest(5).map(playthrough =>
                  <>
                    <div>date {playthrough.playedOn.toISOString()}</div>
                    <div>winner {playthrough.winnerName}</div>
                    {/* scores */}
                  </>
                )}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )

}