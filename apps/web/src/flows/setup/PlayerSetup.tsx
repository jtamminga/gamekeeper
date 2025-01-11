import { PlayerForm } from '@app/components'
import { useGamekeeper } from '@app/hooks'
import { Action, Player } from '@gamekeeper/core'
import { useState } from 'react'


type Props = {
  onComplete: Action
}


export function PlayerSetup({ onComplete }: Props) {
  const { gameplay } = useGamekeeper()
  const players = gameplay.players.all()
  const [player, setPlayer] = useState<Player>()
  const [showList, setShowList] = useState(false)

  function editPlayer(player: Player) {
    setPlayer(player)
    setShowList(false)
  }

  if (showList) {
    return (
      <div>
        <div className="link-list">
          {players.map(player => 
            <a onClick={() => editPlayer(player)}>{player.name}</a>
          )}
        </div>
        <button onClick={onComplete}>Next</button>
      </div>
    )
  }
  else {
    return (
      <PlayerForm
        player={player}
        submitText={player ? 'Update' : 'Create'}
        onComplete={async data => {
          await gameplay.players.create(data)
          setShowList(true)
        }}
      />
    )
  }
  
}