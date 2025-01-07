-- playthroughs
PRAGMA foreign_keys = 0;
CREATE TABLE sqlitestudio_temp_table AS SELECT * FROM playthroughs;
DROP TABLE playthroughs;
CREATE TABLE playthroughs (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, user_id TEXT, game_id INTEGER NOT NULL, played_on TEXT NOT NULL, players TEXT NOT NULL, result INTEGER, scores TEXT);
INSERT INTO playthroughs (id, game_id, played_on, players, result, scores) SELECT id, game_id, played_on, players, result, scores FROM sqlitestudio_temp_table;
DROP TABLE sqlitestudio_temp_table;
PRAGMA foreign_keys = 1;

-- games
PRAGMA foreign_keys = 0;
CREATE TABLE sqlitestudio_temp_table AS SELECT * FROM games;
DROP TABLE games;
CREATE TABLE games (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, user_id TEXT, name TEXT NOT NULL, type INTEGER NOT NULL, scoring INTEGER, weight REAL);
INSERT INTO games (id, name, type, scoring, weight) SELECT id, name, type, scoring, weight FROM sqlitestudio_temp_table;
DROP TABLE sqlitestudio_temp_table;
PRAGMA foreign_keys = 1;

-- goals
PRAGMA foreign_keys = 0;
CREATE TABLE sqlitestudio_temp_table AS SELECT * FROM goals;
DROP TABLE goals;
CREATE TABLE goals (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, user_id TEXT, type INTEGER NOT NULL, year INTEGER NOT NULL, value REAL);
INSERT INTO goals (id, type, year, value) SELECT id, type, year, value FROM sqlitestudio_temp_table;
DROP TABLE sqlitestudio_temp_table;
PRAGMA foreign_keys = 1;

-- players
PRAGMA foreign_keys = 0;
CREATE TABLE sqlitestudio_temp_table AS SELECT * FROM players;
DROP TABLE players;
CREATE TABLE players (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, user_id TEXT, name TEXT NOT NULL, color INTEGER);
INSERT INTO players (id, name) SELECT id, name FROM sqlitestudio_temp_table;
DROP TABLE sqlitestudio_temp_table;
PRAGMA foreign_keys = 1;