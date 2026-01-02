import { RouterContext } from '@app/providers'
import { useContext } from 'react'
import type { Page } from '@app/routing'
import type { GameId, PlayerId, PlaythroughId } from '@gamekeeper/core'


// hook
export function useRouter() {
  const { context, setContext, completed } = useContext(RouterContext)

  return {
    context,
    page: context,
    setPage: (page: Page) => setContext(page),
    toGame: (gameId: GameId) => setContext({ name: 'GameDetails', props: { gameId }}),
    toPlaythrough: (playthroughId: PlaythroughId) => setContext({ name: 'PlaythroughDetails', props: { playthroughId }}),
    toPlayer: (playerId: PlayerId | undefined) => {
      if (playerId !== undefined) {
        setContext({ name: 'PlayerDetails', props: { playerId }})
      }
    },
    completed 
  }
}