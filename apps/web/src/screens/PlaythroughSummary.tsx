import { HydratedPlaythroughView } from '@gamekeeper/core'
import { Fragment } from 'react'


export type Props = {
  view: HydratedPlaythroughView
}


export function PlaythroughSummary({ view }: Props) {

  return (
    <div>
      <p>winner is {view.winner}</p>

      <table>
        <tbody>
          <tr>
            <td>Plays</td>
            <td>{view.numPlaythroughs}</td>
          </tr>
          <tr>
            <td>Winrate</td>
            <td>
              <ul>
                {view.winrates.map((winrate, index) =>
                  <li key={`winrate-${index}`}>
                    {winrate.name} {winrate.winrate}
                  </li>
                )}
              </ul>
            </td>
          </tr>
          <tr>
            <td>Lastest Plays</td>
            <td>
              <ul>
                {view.latestPlaythroughs.map(playthrough =>
                  <Fragment key={playthrough.id}>
                    <div>date {playthrough.playedOn}</div>
                    <div>winner {playthrough.winner}</div>
                    <div>
                      <ul>
                        {playthrough.scores.map((score, index) =>
                          <li key={`score-${playthrough.id}-${index}`}>
                            {score.name} {score.score}
                          </li>
                        )}
                      </ul>
                    </div>
                  </Fragment>
                )}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )

}