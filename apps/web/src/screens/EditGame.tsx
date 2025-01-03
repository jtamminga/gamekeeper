import { Link } from '@app/components'
import { useGamekeeper, useRouter } from '@app/hooks'
import { type GameId } from '@gamekeeper/core'
import { useMemo, useState } from 'react'


type Props = {
  gameId: GameId
}


export function EditGame({ gameId }: Props) {

  const { gameplay } = useGamekeeper()
  const game = useMemo(() => gameplay.games.get(gameId), [gameId, gameplay])
  const [name, setName] = useState(game.name)
  const [weight, setWeight] = useState(game.weight?.toString() ?? '')
  const router = useRouter()

  async function onUpdate() {
    await game.update({
      name,
      weight: weight === undefined
        ? undefined
        : Number.parseFloat(weight)
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
            value={weight}
            onChange={e => setWeight(e.target.value)}
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