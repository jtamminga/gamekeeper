import { useState } from 'react'
import type { Callback, GameId, PlayerId, PlaythroughFlow } from '@gamekeeper/core'
import { DateSelect, GameSelect, PlayerSelect } from '@app/components'
import { useGamekeeper, useRouter } from '@app/hooks'


type Props = {
  onComplete: Callback<PlaythroughFlow>
}


export function BaseFlow({ onComplete }: Props) {

  const { page } = useRouter()
  // check for a game id in this page's context
  // then we can set it as the selected game
  const initialGameId = page.name === 'AddPlaythrough'
    ? page.props?.gameId
    : undefined

  const { gameplay } = useGamekeeper()
  // have all players selected by default
  const [playerIds, setPlayerIds] = useState<PlayerId[]>(gameplay.players.all().map(p => p.id))
  const [gameId, setGameId] = useState<GameId | undefined>(initialGameId)
  const [playedOn, setPlayedOn] = useState(new Date())

  function onNext() {
    if (!gameId) {
      return
    }

    if (playerIds.length === 0) {
      return
    }

    const flow = gameplay.playthroughs.startFlow({
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