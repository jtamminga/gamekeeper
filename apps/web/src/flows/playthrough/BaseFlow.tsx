import { useState } from 'react'
import { Callback, CoopFlow, GameId, PlayerId, VsFlow } from '@gamekeeper/core'
import { DateSelect, GameSelect, PlayerSelect } from '@app/components'
import { useGamekeeper } from '@app/hooks'


type Props = {
  onComplete: Callback<VsFlow | CoopFlow>
}


export function BaseFlow({ onComplete }: Props) {

  const gamekeeper = useGamekeeper()

  const [playerIds, setPlayerIds] = useState<PlayerId[]>([])
  const [gameId, setGameId] = useState<GameId>()
  const [playedOn, setPlayedOn] = useState(new Date())

  function onNext() {
    if (!gameId) {
      return
    }

    if (playerIds.length === 0) {
      return
    }

    const flow = gamekeeper.playthroughs.startFlow({
      playerIds,
      gameId,
      playedOn
    })

    onComplete(flow)
  }

  return (
    <div>

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

      <button
        type="button"
        onClick={onNext}
      >Next</button>

    </div>
  )
}