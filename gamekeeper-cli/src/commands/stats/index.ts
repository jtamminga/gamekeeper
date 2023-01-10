import { GameKeeperCommand } from '../../GameKeeperCommand'


// command
export default class StatsCommand extends GameKeeperCommand {

  // description
  static description = 'stats of playthroughs for the current year'

  public async run(): Promise<void> {
    
  }

}