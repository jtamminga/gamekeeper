/**
 * Value object representing a win rate (as a decimal 0–1) and
 * the number of plays it was calculated from.
 */
export class Winrate {

  public constructor(
    public readonly winrate: number,
    public readonly plays: number
  ) { }
}