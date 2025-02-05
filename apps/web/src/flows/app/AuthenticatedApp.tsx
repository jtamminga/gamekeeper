import { useState } from 'react'
import { useGamekeeper } from '@app/hooks'
import { MainLayout, SetupLayout } from '@app/layouts'
import { RouterProvider } from '@app/providers'


export function AuthenticatedAppFlow() {
  const { gameplay } = useGamekeeper()
  const [showSetup, setShowSetup] = useState(gameplay.players.all().length === 0)

  if (showSetup) {
    return (
      <RouterProvider
        key='setup-flow'
        initialPage={{ name: 'Setup' }}
        onComplete={() => setShowSetup(false)}
      >
        <SetupLayout />
      </RouterProvider>
    )
  }
  else {
    return (
      <RouterProvider
        key='main-app'
        initialPage={{ name: 'Summary' }}
      >
        <MainLayout />
      </RouterProvider>
    )
  }
}