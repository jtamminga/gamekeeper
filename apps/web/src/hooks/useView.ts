import type { GameId, PlaythroughId, PlaythroughQueryOptions } from '@gamekeeper/core'
import { useEffect, useState } from 'react'
import { viewService } from '@app/bootstrap'
import { GamesView, GameView, PlaythroughsView, SummaryView } from '@gamekeeper/views'


export function useSummaryView(year?: number) {
  const [view, setView] = useState<SummaryView>()

  useEffect(() => {
    async function fetchData() {
      const view = await viewService.getSummaryView(year)
      setView(view)
    }
    fetchData()
  }, [year])

  return view
}

export function useGameView(id: GameId) {
  const [view, setView] = useState<GameView>()

  useEffect(() => {
    async function fetchData() {
      const view = await viewService.getGameView(id)
      setView(view)
    }
    fetchData()
  }, [id])

  return view
}

export function useGamesView() {
  const [view, setView] = useState<GamesView>()

  useEffect(() => {
    async function fetchData() {
      const view = await viewService.getGamesView()
      setView(view)
    }
    fetchData()
  }, [])

  return view
}

export function usePlaythroughsView({ fromDate, toDate, gameId, limit }: PlaythroughQueryOptions) {
  const [view, setView] = useState<PlaythroughsView>()

  useEffect(() => {
    async function fetchData() {
      const view = await viewService.getPlaythroughsView({ fromDate, toDate, gameId, limit })
      setView(view)
    }
    fetchData()
  }, [fromDate, toDate, gameId, limit])

  return view
}

export function usePlaythroughView(id: PlaythroughId) {
  return viewService.getPlaythroughView(id)
}