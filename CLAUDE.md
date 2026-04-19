# Gamekeeper

## Project structure
Monorepo with `packages/` (core, db, api, views) and `apps/` (web, api, testing).
After modifying packages, run `yarn build:packages` before the app and api will pick up changes.
To build the API run `yarn build:api`. To build the web app run `yarn build:web`.

## Highlevel Architecture
- API is a simple express node app, located `/apps/api`
- web app is a single page app that uses Vite. Makes calls to API. Located at `/apps/web`
- core domain is located in `/packages/core`

## Testing
Run `yarn test` from root to test.
Tests live in `apps/testing/tests/`. Use `Factory` helpers — `Factory.createVsGame()`,
`Factory.createCoopGame()`, `Factory.createScores(johnsScore, alexsScore)`, etc.
Players `john` (id `'1'`), `alex` (id `'2'`), `otherPlayer` (id `'3'`) are pre-seeded.

## Web app routing
Screen components read their own page props via `useRouter()` rather than through prop drilling — e.g. `BaseFlow` reads `gameId` directly from `page.props` when `page.name === 'AddPlaythrough'`. To pre-select something in a flow, stamp the value onto the page props via `setPage`.

## Repository hydration pattern
`Playthroughs` (and other domain collections) use a two-phase pattern: `hydrate*()` loads from DB into memory (async), `get*()` reads from memory (sync). For on-demand single-record loading, use `playthroughs.fetch(id)` — checks memory first, hydrates from DB only if missing.
`PlaythroughQueryOptions` is for list/filter queries only — primary-key lookups go through `hydratePlaythrough(id)` or `fetch(id)`.

## Adding a new stat
Touch these files in order:
1. `packages/core/src/services/stats/WinrateData.ts` — add the data type
2. `packages/core/src/services/stats/StatsService.ts` — add to the interface
3. `packages/core/src/services/stats/InMemoryStats.ts` — implement computation
4. `packages/core/src/services/stats/InMemoryStatsService.ts` — delegate to InMemoryStats
5. `packages/db/src/DbInMemoryStatsService.ts` — delegate to InMemoryStats
6. `packages/core/src/domains/insights/stats/GameStats.ts` — expose on domain object
7. `packages/views/src/Route.ts` — add route constant
8. `apps/api/src/app.ts` — add Express endpoint
9. `packages/api/src/StatsService.ts` — add API client method