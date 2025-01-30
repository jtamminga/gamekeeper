import { useState } from 'react'
import { Callback, GameId, PlayerId, PlaythroughFlow } from '@gamekeeper/core'
import { DateSelect, GameSelect, Link, PlayerSelect } from '@app/components'
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

  const defaultPlayers = PlaythroughFlow
    .defaultPlayerSelection(gameplay)
    .map(player => player.id)
    
  const [playerIds, setPlayerIds] = useState<PlayerId[]>(defaultPlayers)
  const [gameId, setGameId] = useState<GameId | undefined>(initialGameId)
  const [playedOn, setPlayedOn] = useState(new Date())

  const noPlayers = gameplay.players.all().length === 0
  const noGames = gameplay.games.all().length === 0

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

  if (noGames || noPlayers) {
    return (
      <>
        <p className="text-muted mb-md">Before you can record you need players and games in the system.</p>
        <div className="link-list">
          {noPlayers &&
            <Link page={{ name: 'AddPlayer' }}>Add player</Link>
          }

          {noGames &&
            <Link page={{ name: 'AddGame' }}>Add game</Link>
          }
        </div>
      </>
    )
  }

  return (
    <>

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

    </>
  )
}