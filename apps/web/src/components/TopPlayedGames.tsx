import type { GameId, PlayerId } from '@gamekeeper/core'
import { useRouter } from '@app/hooks'
import { PlayerColor } from './PlayerColor'


type Props = {
  topPlayed: {
    gameId: GameId
    gameName: string
    numPlays: number
    highestWinrate: {
      playerId: PlayerId
      playerName: string
      percentage: string
    } | undefined
  }[]
}


export function TopPlayedGames({ topPlayed }: Props) {
  const { toGame } = useRouter()

  return (
    <table>
      <thead>
        <tr>
          <th>#</th>
          <th>Game</th>
          <th className="num">Plays</th>
          <th>Best Winrate</th>
        </tr>
      </thead>
      <tbody>
        {topPlayed.map(({ gameId, gameName, numPlays, highestWinrate }, index) =>
          <tr key={gameId} onClick={() => toGame(gameId)}>
            <td>{index + 1}</td>
            <td>{gameName}</td>
            <td className="num">{numPlays}</td>
            <td>
              {highestWinrate &&
                <PlayerColor playerId={highestWinrate.playerId}>
                  {highestWinrate.playerName} {highestWinrate.percentage}
                </PlayerColor>
              }
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}