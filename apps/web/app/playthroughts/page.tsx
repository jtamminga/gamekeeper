import { gamekeeper } from 'utils'

export default async function PlaythroughPage() {
  const [playthroughs, games, players] = await Promise.all([
    gamekeeper.playthroughs.all({ limit: 10 }),
    gamekeeper.games.asMap(),
    gamekeeper.players.asMap()
  ])

  return (
    <div>

      <table>
        {playthroughs.map(play =>
          <tr>
            <td></td>
          </tr>
        )}
      </table>
      
    </div>
  )
}