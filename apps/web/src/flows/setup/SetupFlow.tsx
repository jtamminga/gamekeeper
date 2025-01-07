import { useGamekeeper } from '@app/hooks'
import { Players } from '@app/screens'
import { useState } from 'react'


export function SetupFlow() {

  const { gameplay } = useGamekeeper()
  const setupPlayers = gameplay.players.all().length === 0
  const [step, setStep] = useState()

  if (setupPlayers) {
    return (
      <>
        <h2>Setup 1 of 2</h2>
        <Players />
        <button onClick={() => console.log('next')}>Next</button>
      </>
    )
  }
}