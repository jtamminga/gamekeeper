import { container } from 'tsyringe'
import {
  DbGameRepository,
  DbPlayerRepository,
  DbPlaythroughRepository,
  GameRepository,
  PlayerRepository,
  PlaythroughRepository,
} from '@repos'


// register repositories
container.registerSingleton<PlaythroughRepository>('PlaythroughRepository', DbPlaythroughRepository)
container.registerSingleton<GameRepository>('GameRepository', DbGameRepository)
container.registerSingleton<PlayerRepository>('PlayerRepository', DbPlayerRepository)