import { useMemo, useState } from 'react'
import { useGamekeeper, useRouter } from '@app/hooks'
import type { CallbackPageProps } from '@app/routing'
import type { GameId } from '@gamekeeper/core'


type Props = {
  gameId: GameId
} & CallbackPageProps


export function EditGame({ gameId, callback = { name: 'GameDetails', props: { gameId }} }: Props) {

  const { gameplay } = useGamekeeper()
  const game = useMemo(() => gameplay.games.get(gameId), [gameId, gameplay])
  const [name, setName] = useState(game.name)
  const [weight, setWeight] = useState(game.weight?.toString() ?? '')
  const [own, setOwn] = useState(game.own)
  const router = useRouter()

  async function onUpdate() {
    game.update({
      name,
      weight: weight === undefined
        ? undefined
        : Number.parseFloat(weight),
      own
    })
    await gameplay.games.save(game)

    router.setPage(callback)
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

        {/* own */}
        <div className="form-control">
          <label>Own</label>
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="own"
              checked={own}
              onChange={e => setOwn(e.target.checked)}
            />
            This game is in my collection
          </label>
        </div>

        <button
          onClick={onUpdate}
          type="button"
          className="mr-lg"
        >
          Update
        </button>
      </form>
    </>
  )
}