import type {
  GameId,
  GoalId,
  PlayerId,
  PlaythroughId,
  PlaythroughQueryOptions
} from '@gamekeeper/core'
import {
  AddGame,
  AddGoal,
  AddPlayer,
  AddPlaythrough,
  EditGame,
  EditGoal,
  EditPlayer,
  GameDetails,
  GamePlaythroughs,
  Games,
  Goals,
  Landing,
  Players,
  PlaythroughDetails,
  Playthroughs,
  Profile,
  Settings,
  Summary
} from './screens'


// all possible pages
export type Page =
  | { name: 'Landing' }
  | { name: 'Profile' }
  | { name: 'Summary' }
  | { name: 'AddPlaythrough', props?: { gameId?: GameId } }
  | { name: 'PlaythroughDetails', props: { playthroughId: PlaythroughId }}
  | { name: 'Games' }
  | { name: 'AddGame' }
  | { name: 'GameDetails', props: { gameId: GameId } }
  | { name: 'GamePlaythroughs', props: { gameId: GameId } }
  | { name: 'EditGame', props: { gameId: GameId } }
  | { name: 'Playthroughs', props: PlaythroughQueryOptions & { desc?: string } }
  | { name: 'Settings' }
  | { name: 'Players' }
  | { name: 'AddPlayer' }
  | { name: 'EditPlayer', props: { playerId: PlayerId } }
  | { name: 'Goals' }
  | { name: 'AddGoal' }
  | { name: 'EditGoal', props: { goalId: GoalId } }


// router
export function router(page: Page) {
  switch (page.name) {
    case 'Landing':
      return <Landing />
    case 'Profile':
      return <Profile />
    case 'Summary':
      return <Summary />
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
    case 'Settings':
      return <Settings />
    case 'Players':
      return <Players />
    case 'AddPlayer':
      return <AddPlayer />
    case 'EditPlayer':
      return <EditPlayer {...page.props} />
    case 'Goals':
      return <Goals />
    case 'AddGoal':
      return <AddGoal />
    case 'EditGoal':
      return <EditGoal {...page.props} />
  }
}