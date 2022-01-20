import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Mesh, Path} from 'src/geometry/types'

interface GeometryState {
    pathDescriptions: string[] | null
    meshes: Mesh[] | null
    paths: Path[] | null
}

const initialState = {
    pathDescriptions: null,
    meshes: null,
    paths: null
}

type GeometryActionPayload = {
    meshes: Mesh[]
    paths: Path[]
}

const geometrySlice = createSlice({
    name: 'geometry',
    initialState,
    reducers: {
        'setPathsDescriptions': (state: GeometryState, {payload}: PayloadAction<string[]>) => {state.pathDescriptions = payload},
        'setGeometry': (state: GeometryState, {payload: {meshes, paths}}: PayloadAction<GeometryActionPayload>) => {
            state.meshes = meshes
            state.paths = paths
        },
    }
})

export const {setPathsDescriptions, setGeometry} = geometrySlice.actions
export default geometrySlice.reducer