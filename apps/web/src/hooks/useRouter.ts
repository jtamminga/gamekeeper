import { RouterContext } from '@app/providers'
import { useContext } from 'react'
import type { Page } from '@app/routing'
import type { GameId, PlaythroughId } from '@gamekeeper/core'


// hook
export function useRouter() {
  const { context, setContext, completed } = useContext(RouterContext)

  return {
    context,
    page: context,
    setPage: (page: Page) => setContext(page),
    toGame: (id: GameId) => setContext({ name: 'GameDetails', props: { gameId: id }}),
    toPlaythrough: (id: PlaythroughId) => setContext({ name: 'PlaythroughDetails', props: { playthroughId: id }}),
    completed 
  }
}