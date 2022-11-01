"use client";

import { GameData, GameFactory } from 'gamekeeper-core'
import { useMemo } from 'react'

type RecordProps = {
  gameData: GameData
}

export default function Record({ gameData }: RecordProps) {
  const game = useMemo(() => GameFactory.create(gameData), [gameData])

  return (
    <div>
      <span>client stuff: {gameData.name}</span>
    </div>
  )
}