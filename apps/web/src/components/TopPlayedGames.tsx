import { useRouter } from '@app/hooks'
import { GameId } from '@gamekeeper/core'

type Props = {
  topPlayed: {
    gameId: GameId
    gameName: string
    numPlays: number
  }[]
}

export function TopPlayedGames({ topPlayed }: Props) {
  const { toGame } = useRouter()

  return (
    <table>
      <thead>
        <tr>
          <th className="num">Plays</th>
          <th>Game</th>
        </tr>
      </thead>
      <tbody>
        {topPlayed.map(({ gameId, gameName, numPlays }) =>
          <tr key={gameId} onClick={() => toGame(gameId)}>
            <td className="num">{numPlays}</td>
            <td>{gameName}</td>
          </tr>
        )}
      </tbody>
    </table>
  )
}