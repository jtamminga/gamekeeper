import { playerColor } from '@app/helpers'
import { useGamekeeper } from '@app/hooks'
import type { PlayerId } from '@gamekeeper/core'
import { FormattedScoreStats } from '@gamekeeper/views'


type Props = {
  scoreStats: FormattedScoreStats
}


// layout constants
const WIDTH = 300
const AXIS_Y = 12
const TICK_H = 4
const PAD = TICK_H + 2
const CONN_Y1 = AXIS_Y + TICK_H + 4
const CONN_Y2 = CONN_Y1 + 8
const LABEL_Y = CONN_Y2 + 13
const HEIGHT = LABEL_Y + 8

const GRAY = 'var(--color-gray)'


/** Maps a score to an X pixel coordinate within the padded canvas width. Falls back to center if all scores are equal. */
function normalize(score: number, min: number, max: number): number {
  if (min === max) return WIDTH / 2
  return PAD + ((score - min) / (max - min)) * (WIDTH - 2 * PAD)
}


// component
export function ScoreScatterPlot({ scoreStats }: Props) {

  // bind
  const { gameplay } = useGamekeeper()

  // setup
  const { best, worst, average, historicalScores } = scoreStats
  const bestScore = Number.parseFloat(best.score)
  const worstScore = Number.parseFloat(worst.score)
  const avgScore = Number.parseFloat(average)
  const [minScore, maxScore] = [bestScore, worstScore].sort((a, b) => a - b)

  const norm = (score: number) => normalize(score, minScore, maxScore)
  const minX = norm(minScore)
  const maxX = norm(maxScore)
  const avgX = norm(avgScore)

  const getColor = (playerId: PlayerId | undefined) =>
    playerColor(playerId ? gameplay.players.get(playerId).color : undefined)
  
  // render
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      style={{ width: '100%', height: 'auto', display: 'block' }}
    >
      {/* axis */}
      <line x1={PAD} y1={AXIS_Y} x2={WIDTH - PAD} y2={AXIS_Y} stroke={GRAY} strokeWidth={0.5} />

      {/* min tick */}
      <line
        x1={minX} y1={AXIS_Y - TICK_H - 1}
        x2={minX} y2={AXIS_Y + TICK_H + 1}
        stroke={GRAY}
        strokeWidth={2}
      />

      {/* max tick */}
      <line
        x1={maxX} y1={AXIS_Y - TICK_H - 1}
        x2={maxX} y2={AXIS_Y + TICK_H + 1}
        stroke={GRAY}
        strokeWidth={2}
      />

      {/* average tick */}
      <line
        x1={avgX} y1={AXIS_Y - TICK_H - 1}
        x2={avgX} y2={AXIS_Y + TICK_H + 1}
        stroke={GRAY}
        strokeWidth={2}
      />

      {/* score marks */}
      {historicalScores.map((s, i) => (
        <line
          key={i}
          x1={norm(s.score)} y1={AXIS_Y - TICK_H}
          x2={norm(s.score)} y2={AXIS_Y + TICK_H}
          stroke={getColor(s.playerId)}
          strokeWidth={2}
        />
      ))}

      {/* connector lines */}
      <line x1={minX} y1={CONN_Y1} x2={minX} y2={CONN_Y2} stroke={GRAY} strokeWidth={1} />
      <line x1={avgX} y1={CONN_Y1} x2={avgX} y2={CONN_Y2} stroke={GRAY} strokeWidth={1} />
      <line x1={maxX} y1={CONN_Y1} x2={maxX} y2={CONN_Y2} stroke={GRAY} strokeWidth={1} />

      {/* labels */}
      <text x={minX - 2} y={LABEL_Y} fill={GRAY} textAnchor="start" fontSize={10}>
        {minScore}
      </text>
      <text x={avgX} y={LABEL_Y} fill={GRAY} textAnchor="middle" fontSize={10}>
        avg {scoreStats.average}
      </text>
      <text x={maxX + 2} y={LABEL_Y} fill={GRAY} textAnchor="end" fontSize={10}>
        {maxScore}
      </text>
    </svg>
  )
}
