import { Link } from '@app/components'
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

    router.toGame(gameId)
  }

  return (
    <>
      <h1>{game.name}</h1>

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
          type="button"
          className="mr-lg"
        >
          Update
        </button>

        <Link page={{ name: 'GameDetails', props: { gameId }}}>
          Back
        </Link>
      </form>
    </>
  )
}