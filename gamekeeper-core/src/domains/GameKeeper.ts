import { GameRepository, PlayerRepository, PlaythroughRepository } from '@repos'
import { Games } from './game'
import { Players } from './player'
import { Playthrough, Playthroughs } from './playthrough'


// type
export type GameKeeperProps = {
  gameRepo: GameRepository
  playerRepo: PlayerRepository
  playthroughRepo: PlaythroughRepository
}


// game keeper
export class GameKeeper {
  
  public readonly games: Games
  public readonly players: Players
  public readonly playthroughs: Playthroughs

  public constructor({
    gameRepo,
    playerRepo,
    playthroughRepo
  }: GameKeeperProps) {
    this.games = new Games(gameRepo, playthroughRepo)
    this.players = new Players(playerRepo)
    this.playthroughs = new Playthroughs(playthroughRepo)
  }

}