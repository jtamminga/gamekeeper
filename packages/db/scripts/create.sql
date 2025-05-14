CREATE TABLE games (
    id      INTEGER NOT NULL
                    PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    name    TEXT    NOT NULL,
    type    INTEGER NOT NULL,
    scoring INTEGER,
    weight  REAL
);

CREATE TABLE players (
    id      INTEGER NOT NULL
                    PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    name    TEXT    NOT NULL,
    color   INTEGER
);

CREATE TABLE playthroughs (
    id         INTEGER NOT NULL
                      PRIMARY KEY AUTOINCREMENT,
    user_id    TEXT,
    game_id    INTEGER NOT NULL,
    played_on  TEXT    NOT NULL,
    players    TEXT    NOT NULL,
    result     INTEGER,
    scores     TEXT,
    notes      TEXT,
    started_on TEXT,
    ended_on   TEXT
);

CREATE TABLE goals (
    id      INTEGER NOT NULL
                    PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    type    INTEGER NOT NULL,
    year    INTEGER NOT NULL,
    value   REAL
);