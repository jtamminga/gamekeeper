import { AddPlaythrough } from './screens'


// all possible pages
export type Page =
  | 'Stats'
  | 'AddPlaythrough'
  | 'Games'


// router
export function router(page: Page) {
  switch (page) {
    case 'Stats':
      return <div>stats</div>
    case 'Games':
      return <div>games</div>
    case 'AddPlaythrough':
      return <AddPlaythrough />
  }
}