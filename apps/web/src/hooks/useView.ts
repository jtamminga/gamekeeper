import { useEffect, useMemo, useState } from 'react'
import { useGamekeeper } from './useGamekeeper'
import type { HydratableView } from '@gamekeeper/core'


export function useView<T extends HydratableView<Awaited<ReturnType<T['hydrate']>>>>(createView: () => T, deps: React.DependencyList = []) {

    const gamekeeper = useGamekeeper()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const view = useMemo(createView, deps)
    const [hydratedView, setHydratedView] = useState<Awaited<ReturnType<T['hydrate']>>>()

    // fetch data
    useEffect(() => {
      async function fetchData() {
        const hydratedView = await view.hydrate(gamekeeper)
        setHydratedView(hydratedView)
      }
      fetchData()
    }, [gamekeeper, view])

    return {
      view,
      hydratedView
    }
}