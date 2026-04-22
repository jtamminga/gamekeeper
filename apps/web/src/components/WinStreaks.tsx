import { useRouter } from '@app/hooks'
import { FormattedWinStreakForGame } from '@gamekeeper/views'
import { PlayerColor } from './PlayerColor'


type Props = {
  winStreaks: FormattedWinStreakForGame[]
}


export function WinStreaks({ winStreaks }: Props) {
  const { toGame, toPlayer } = useRouter()

  return (
    <table>
      <thead>
        <tr>
          <th>Streak</th>
          <th>Player</th>
          <th>Game</th>
        </tr>
      </thead>
      <tbody>
        {winStreaks.map(({ streak, playerId, playerName, gameId, gameName }) =>
          <tr key={`streak-${gameId}-${playerId}`}>
            <td>{streak}</td>
            <td onClick={() => toPlayer(playerId)}>
              <PlayerColor playerId={playerId}>{playerName}</PlayerColor>
            </td>
            <td onClick={() => toGame(gameId)}>
              {gameName}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}