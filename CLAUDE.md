# Gamekeeper

## Project structure
Monorepo with `packages/` (core, db, api, views) and `apps/` (web, api, testing).
After modifying packages, run `yarn build:packages` before the app and api will pick up changes.
Run `yarn build:api` to build the api. Run `yarn build:web` to build the Vite app.

## Testing
Tests live in `apps/testing/tests/`. Use `Factory` helpers — `Factory.createVsGame()`,
`Factory.createCoopGame()`, `Factory.createScores(johnsScore, alexsScore)`, etc.
Players `john` (id `'1'`), `alex` (id `'2'`), `otherPlayer` (id `'3'`) are pre-seeded.

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