# Gamekeeper Domains

Gamekeeper is a board game tracking app. The domain layer is organized around
**Domain-Driven Design** with two bounded contexts, each with its own aggregate root.

```
GameKeeper
├── gameplay  (aggregate root: Gameplay)
│   ├── games
│   ├── players
│   └── playthroughs
│       └── flow
└── insights  (aggregate root: Insights)
    ├── stats
    └── goals
```

---

## Gameplay

**Aggregate root:** `Gameplay`

The Gameplay context is responsible for the core act of recording board game sessions.
It owns three collections that are always hydrated together — players and games load in
parallel first, then playthroughs (which depend on both).

### Game

A board game in the library. Two subtypes:

- **`VsGame`** — competitive games where one player wins against the others
- **`CoopGame`** — cooperative games where the group wins or loses together

Each game stores metadata: name, weight (complexity), scoring type (highest wins /
lowest wins / most rounds / no score), and whether the user owns it.

### Player

A person who participates in playthroughs. Stores a name and optional color.
Players can look up all playthroughs they have been part of.

### Playthrough

A recorded session of playing a game. Two subtypes mirror the game types:

- **`VsPlaythrough`** — records the winner (or null for a tie) and optional
  per-player scores via `VsPlaythroughScores`
- **`CoopPlaythrough`** — records whether the group won or lost, and an optional
  shared score

#### Playthrough Flow

New playthroughs are created through a **builder flow** rather than all at once.
`Playthroughs.startFlow()` returns a `PlaythroughFlow` (`VsFlow` or `CoopFlow`)
that lets the caller set data progressively (players, scores, outcome) and commit
with `build()`.

The `VsFlow` supports **implicit winner detection**: if all player scores are
entered and they are not tied, the winner is determined automatically from the
game's scoring type.

`Scores` is the mutable scratch pad used inside a flow; once saved, scores become
the immutable `VsPlaythroughScores` record on the playthrough.

---

## Insights

**Aggregate root:** `Insights`

The Insights context surfaces derived knowledge from the recorded play history.
It does not own any raw data — it reads from Gameplay via the stats service.

### Stats

The entry point for aggregated statistics. All queries are async and delegate to the
stats service. Key metrics include:

- Play counts and last-played dates per game
- Win rates (see below)
- Plays by month and by date
- Unique games played
- Play streaks

`Stats.forGame()` returns a `GameStats` instance scoped to a single game, which
adds score stats (best score, worst score, average).

#### Winrates

Win rates come in two flavours depending on game type:

- **`Winrates`** (vs games) — a collection of `PlayerWinrate` objects, one per player,
  with a pre-computed `highest`
- **`CoopWinrates`** (coop games) — tracks both the overall game win rate (across all
  sessions) and per-player win rates (sessions that player participated in).
  `HighestCoopWinrate` surfaces whichever perspective has the higher rate.

### Goals

Yearly goals the user sets for themselves. Two types:

- **`NumberOfPlaysGoal`** — target total play sessions in the year
- **`UniqueGamesPlayedGoal`** — target number of distinct game titles played

Each goal tracks progress against the stats service and computes an expected pace
based on how far through the year it currently is, letting the user see whether they
are ahead or behind.

The `Goals` collection enforces that there is at most one goal of each type per year,
and at most three goals per year total.
