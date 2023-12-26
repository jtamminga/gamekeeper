import { useMemo, useState } from 'react'
import { GameId, PlayerId, VsFlow } from '@gamekeeper/core'
import { DateSelect, GameSelect, PlayerSelect } from '@app/components'
import { useGamekeeper } from '@app/hooks'
import { VsFlowPartial } from './VsFlow'



export function PlaythroughFlow() {

  const gamekeeper = useGamekeeper()

  const [playerIds, setPlayerIds] = useState<PlayerId[]>([])
  const [gameId, setGameId] = useState<GameId>()
  const [playedOn, setPlayedOn] = useState(new Date())

  const flow = useMemo(() => {
    if (!gameId) {
      return
    }

    return gamekeeper.playthroughs.startFlow({
      playerIds,
      gameId,
      playedOn
    })
  }, [playerIds, gameId, playedOn])

  return (
    <form>

      <PlayerSelect
        playerIds={playerIds}
        onChange={playerIds => setPlayerIds(playerIds)}
      />
      
      <DateSelect
        date={playedOn}
        onChange={date => setPlayedOn(date)}
      />

      <GameSelect
        gameId={gameId}
        onChange={gameId => setGameId(gameId)}
      />

      {flow instanceof VsFlow &&
        <VsFlowPartial flow={flow} />
      }

    </form>
  )
}