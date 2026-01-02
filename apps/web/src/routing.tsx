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
  Setup,
  Landing,
  Players,
  PlayerDetails,
  PlaythroughDetails,
  Playthroughs,
  Profile,
  Settings,
  Summary
} from './screens'


export type CallbackPageProps = {
  callback?: Page
}


// all possible pages
export type Page =
  | { name: 'Landing' }
  | { name: 'Setup' }
  | { name: 'Profile' }
  | { name: 'Summary' }
  | { name: 'AddPlaythrough', props?: { gameId?: GameId } }
  | { name: 'PlaythroughDetails', props: { playthroughId: PlaythroughId }}
  | { name: 'Games' }
  | { name: 'AddGame', props?: CallbackPageProps }
  | { name: 'GameDetails', props: { gameId: GameId } }
  | { name: 'GamePlaythroughs', props: { gameId: GameId } }
  | { name: 'EditGame', props: { gameId: GameId } & CallbackPageProps }
  | { name: 'Playthroughs', props: PlaythroughQueryOptions & { desc?: string } }
  | { name: 'Settings' }
  | { name: 'Players' }
  | { name: 'PlayerDetails', props: { playerId: PlayerId }}
  | { name: 'AddPlayer', props?: CallbackPageProps }
  | { name: 'EditPlayer', props: { playerId: PlayerId } & CallbackPageProps }
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
      return <AddGame {...page.props} />
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
      return <AddPlayer {...page.props} />
    case 'PlayerDetails':
      return <PlayerDetails {...page.props} />
    case 'EditPlayer':
      return <EditPlayer {...page.props} />
    case 'Goals':
      return <Goals />
    case 'AddGoal':
      return <AddGoal />
    case 'EditGoal':
      return <EditGoal {...page.props} />
    case 'Setup':
      return <Setup />
  }
}