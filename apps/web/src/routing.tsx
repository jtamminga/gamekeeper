import { GameId, PlaythroughId, PlaythroughQueryOptions } from '@gamekeeper/core'
import {
  AddGame,
  AddPlaythrough,
  EditGame,
  GameDetails,
  GamePlaythroughs,
  Games,
  PlaythroughDetails,
  Playthroughs,
  Stats
} from './screens'


// all possible pages
export type Page =
  | { name: 'Stats' }
  | { name: 'AddPlaythrough', props?: { gameId?: GameId } }
  | { name: 'PlaythroughDetails', props: { playthroughId: PlaythroughId }}
  | { name: 'Games' }
  | { name: 'AddGame' }
  | { name: 'GameDetails', props: { gameId: GameId } }
  | { name: 'GamePlaythroughs', props: { gameId: GameId } }
  | { name: 'EditGame', props: { gameId: GameId } }
  | { name: 'Playthroughs', props: PlaythroughQueryOptions & { desc?: string } }


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
    case 'PlaythroughDetails':
      return <PlaythroughDetails {...page.props} />
    case 'Playthroughs':
      return <Playthroughs {...page.props} />
    case 'EditGame':
      return <EditGame {...page.props} />
  }
}