import assert from 'assert'
import {
  decodeFormatOptions, decodeGoalsQuery, decodeNewGoalBody,
  decodeNewPlaythroughBody, decodePlaythroughQuery, decodeStatsQuery,
  decodeUpdatedGoalBody, encodeFormatOptions, encodeGoalsQuery,
  encodePlaythroughQuery, encodeStatsQuery, InvalidParamsError
} from '@gamekeeper/api-services'
import type { GameId, PlayerId } from '@gamekeeper/core'


describe('api encode/decode', function () {

  describe('PlaythroughQuery', function () {
    it('roundtrip with all properties', function () {
      const query = {
        limit: 10,
        fromDate: new Date('2024-01-01T00:00:00.000Z'),
        toDate: new Date('2024-12-31T00:00:00.000Z'),
        gameId: 'game-1' as GameId,
        playerIds: ['1', '2'] as PlayerId[]
      }
      assert.deepEqual(decodePlaythroughQuery(encodePlaythroughQuery(query)), query)
    })

    it('non-string values are ignored', function () {
      assert.deepEqual(decodePlaythroughQuery({ limit: 10, gameId: 123 }), {})
    })
  })


  describe('FormatOptions', function () {
    it('roundtrip with all properties', function () {
      const options = { gameNames: true, scores: false, notes: true, hasRoundBasedScoring: false }
      assert.deepEqual(decodeFormatOptions(encodeFormatOptions(options)), options)
    })
  })


  describe('StatsQuery', function () {
    it('roundtrip with all properties', function () {
      const query = { year: 2024, gameId: 'game-1' as GameId, latestPlaythroughs: 5 }
      assert.deepEqual(decodeStatsQuery(encodeStatsQuery(query)), query)
    })
  })


  describe('GoalsQuery', function () {
    it('roundtrip with year', function () {
      const query = { year: 2024 }
      assert.deepEqual(decodeGoalsQuery(encodeGoalsQuery(query)), query)
    })
  })


  describe('decodeNewGoalBody', function () {
    it('happy path', function () {
      const body = { type: 1, value: 50, year: 2024 }
      assert.deepEqual(decodeNewGoalBody(body), body)
    })

    it('throws InvalidParamsError when a required field is missing', function () {
      assert.throws(
        () => decodeNewGoalBody({ value: 50, year: 2024 }),
        InvalidParamsError
      )
    })
  })


  describe('decodeUpdatedGoalBody', function () {
    it('happy path with partial fields', function () {
      assert.deepEqual(decodeUpdatedGoalBody({ value: 100 }), { value: 100 })
    })
  })


  describe('decodeNewPlaythroughBody', function () {
    const base = {
      gameId: 'game-1',
      playerIds: ['1', '2'],
      playedOn: '2024-06-15T00:00:00.000Z'
    }

    it('happy path vs playthrough', function () {
      const result = decodeNewPlaythroughBody({ ...base, winnerId: '1' })
      assert.equal(result.type, 'vs')
    })

    it('happy path coop playthrough', function () {
      const result = decodeNewPlaythroughBody({ ...base, playersWon: true, score: 120 })
      assert.equal(result.type, 'coop')
    })

    it('throws when neither winnerId nor playersWon is provided', function () {
      assert.throws(() => decodeNewPlaythroughBody(base))
    })
  })

})
