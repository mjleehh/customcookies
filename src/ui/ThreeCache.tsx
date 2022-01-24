import React from 'react'
import {Mesh} from 'src/geometry/types'
import {CachedGeometry, updateThreeCache} from 'src/state/three_geometry'


export const ThreeCacheContext = React.createContext<CachedGeometry | null>(null)

type ThreeCacheProps = React.PropsWithChildren<{meshes: Mesh[] | null}>

export function ThreeCacheProvider({meshes, children}: ThreeCacheProps) {
    const threeCache = meshes ? updateThreeCache(meshes) : null
    return <ThreeCacheContext.Provider value={threeCache}>
        {children}
    </ThreeCacheContext.Provider>
}
