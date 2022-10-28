-- create schema

CREATE TABLE games (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name" TEXT NOT NULL,
  "type" INTEGER NOT NULL,
	"scoring" INTEGER
);

CREATE TABLE players (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"name" TEXT NOT NULL
);

CREATE TABLE playthroughs (
	"id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	"game_id" INTEGER NOT NULL,
	"played_on" TEXT NOT NULL,
	"players" TEXT NOT NULL,
	"result" INTEGER,
	"scores" TEXT
);

-- seed database

INSERT INTO players ("id", "name") VALUES (1, "John");
INSERT INTO players ("id", "name") VALUES (2, "Alex");