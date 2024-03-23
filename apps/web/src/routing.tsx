import { GameId } from '@gamekeeper/core'
import {
  AddGame,
  AddPlaythrough,
  GameDetails,
  GamePlaythroughs,
  Games,
  Stats
} from './screens'


// all possible pages
export type Page =
  | { name: 'Stats' }
  | { name: 'AddPlaythrough' }
  | { name: 'Games' }
  | { name: 'AddGame' }
  | { name: 'GameDetails', props: { gameId: GameId } }
  | { name: 'GamePlaythroughs', props: { gameId: GameId } }


// router
export function router(page: Page) {
  switch (page.name) {
    case 'Stats':
      return <Stats />
    case 'Games':
      return <Games />
    case 'AddPlaythrough':
      return <AddPlaythrough />
    case 'AddGame':
      return <AddGame />
    case 'GameDetails':
      return <GameDetails {...page.props} />
    case 'GamePlaythroughs':
      return <GamePlaythroughs {...page.props} />
  }
}