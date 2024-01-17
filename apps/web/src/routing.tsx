import { AddPlaythrough, Games, Stats } from './screens'


// all possible pages
export type Page =
  | 'Stats'
  | 'AddPlaythrough'
  | 'Games'


// router
export function router(page: Page) {
  switch (page) {
    case 'Stats':
      return <Stats />
    case 'Games':
      return <Games />
    case 'AddPlaythrough':
      return <AddPlaythrough />
  }
}