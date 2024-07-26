import { useGamekeeper, useRouter } from '@app/hooks'
import { type GameId } from '@gamekeeper/core'
import { useMemo, useState } from 'react'


type Props = {
  gameId: GameId
}


export function EditGame({ gameId }: Props) {

  const gamekeeper = useGamekeeper()
  const game = useMemo(() => gamekeeper.games.get(gameId), [gameId])
  const [name, setName] = useState(game.name)
  const [weight, setWeight] = useState(game.weight)
  const router = useRouter()

  async function onUpdate() {
    await gamekeeper.games.update({
      id: gameId,
      name,
      weight
    })

    const updatedxd = gamekeeper.games.get(gameId)
    console.log('>>>> updated game', updatedxd)

    router.toGame(gameId)
  }

  return (
    <form>
      {/* name */}
      <div className="form-control">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>

      {/* weight */}
      <div className="form-control">
        <label>Weight</label>
        <input
          type="number"
          name="weight"
          value={weight?.toString() ?? ''}
          onChange={e => setWeight(Number.parseFloat(e.target.value))}
        />
      </div>

      <button
        onClick={onUpdate}
      >
        Update
      </button>
    </form>
  )
}