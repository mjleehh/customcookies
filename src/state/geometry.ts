import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Mesh, Path, Vector} from 'src/geometry/types'
import {SvgPath} from 'src/processing/svg/types'

export interface OffsetPath {
    profile: Path
    left: Vector[]
    right: Vector[]
}

interface GeometryState {
    svgPaths: SvgPath[] | null
    meshes: Mesh[] | null
    paths: OffsetPath[] | null
}

const initialState: GeometryState = {
    svgPaths: null,
    meshes: null,
    paths: null
}

type GeometryActionPayload = {
    meshes: Mesh[]
    paths: OffsetPath[]
}

const geometrySlice = createSlice({
    name: 'geometry',
    initialState,
    reducers: {
        'setPathsDescriptions': (state, {payload}: PayloadAction<SvgPath[]>) => {state.svgPaths = payload},
        'setGeometry': (state, {payload: {meshes, paths}}: PayloadAction<GeometryActionPayload>) => {
            state.meshes = meshes
            state.paths = paths
        },
        'resetGeometry': state => {
            state.svgPaths = null
            state.paths = null
            state.meshes = null
        }
    }
})

export const {setPathsDescriptions, setGeometry, resetGeometry} = geometrySlice.actions
export default geometrySlice.reducer