import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit'
import {Box, Mesh, Path, PathVertices, Vector} from 'src/geometry/types'
import {SvgPath} from 'src/processing/svg/types'
import TessellatingPathBrush from 'src/processing/TessellatingPathBrush'
import PathPainter from 'src/processing/PathPainter'
import paintSvgPath from 'src/processing/svg/paintSvgPath'
import {generateMesh, offset, Side} from 'src/processing/generateMesh'
import {calculateBoundingBox, mergeBoxes} from '../geometry/operations'

export const THICKNESS_STEP = 0.1
export const MIN_THICKNESS = 0.1
export const MAX_THICKNESS = 10
export const DEPTH_STEP = 1
export const MIN_DEPTH = 1
export const MAX_DEPTH = 100
export const TESSELLATION_STEP = 1
export const MIN_TESSELLATION = 1
export const MAX_TESSELLATION = 1000

const TESSELLATION_FOR_BOUNDING_BOX = 100
const DEFAULT_THICKNESS = 1
const DEFAULT_DEPTH = 10
const DEFAULT_TESSELLATION = 10

export interface OffsetPath {
    profile: Path
    left: PathVertices
    right: PathVertices
}

interface Paramters {
    thickness: number,
    depth: number,
    tessellation: number,
}

const initialParameters = {
    thickness: DEFAULT_THICKNESS,
    depth: DEFAULT_DEPTH,
    tessellation: DEFAULT_TESSELLATION,
}

interface GeometryState {
    svgPaths: SvgPath[] | null
    meshes: Mesh[] | null
    paths: OffsetPath[] | null
    parameters: Paramters[] | null
    boundingBox: Box | null
    selectionIndex: number,
}

const initialState: GeometryState = {
    svgPaths: null,
    meshes: null,
    paths: null,
    parameters: null,
    boundingBox: null,
    selectionIndex: -1
}

function offsetPathBoundingBox({profile, left, right}: OffsetPath) {
    return mergeBoxes(calculateBoundingBox(profile.data),
        mergeBoxes(calculateBoundingBox(left), calculateBoundingBox(right)))
}

function updateParametersReducer(state: Draft<GeometryState>, {payload}: PayloadAction<Paramters>) {
    const {selectionIndex} = state
    if (selectionIndex < 0 || !state.parameters) {
        return
    }
    state.parameters[selectionIndex] = payload
    updateAllGeometryReducer(state)
}

function updateAllGeometryReducer(state: Draft<GeometryState>) {
    if (!state.svgPaths || !state.parameters) {
        return
    }

    let meshes: Mesh[] = []
    let paths: OffsetPath[] = []
    for (let i = 0;  i < state.svgPaths.length; ++i) {
        const pathDescription = state.svgPaths[i]
        const {thickness, depth, tessellation} = state.parameters[i]
        const tessellatingBrush = new TessellatingPathBrush(tessellation)
        const painter = new PathPainter(tessellatingBrush)
        paintSvgPath(painter, pathDescription)
        const {segments} = tessellatingBrush
        for (let segment of segments) {
            const offsetPath = {
                profile: segment,
                right: offset(segment, thickness, Side.right),
                left: offset(segment, thickness, Side.left)
            }
            paths.push(offsetPath)
            meshes.push(generateMesh(offsetPath, depth))
        }
    }

    state.meshes = meshes
    state.paths = paths
    state.boundingBox = paths.map(offsetPathBoundingBox).reduce(mergeBoxes)
}

function setPathsDescriptionsReducer(state: Draft<GeometryState>, {payload}: PayloadAction<SvgPath[]>) {
    state.svgPaths = payload
    state.parameters = new Array<Paramters>(payload.length).fill(initialParameters)

    const tessellatingBrush = new TessellatingPathBrush(TESSELLATION_FOR_BOUNDING_BOX)
    const painter = new PathPainter(tessellatingBrush)

    if (!state.svgPaths) {
        return
    }

    const paths: PathVertices[] = []
    for (let pathDescription of state.svgPaths) {
        paintSvgPath(painter, pathDescription)
        const {segments} = tessellatingBrush
        for (let segment of segments) {
            paths.push(segment.data)
        }
    }
    state.boundingBox = paths.map(calculateBoundingBox).reduce(mergeBoxes)
    updateAllGeometryReducer(state)
}

const geometrySlice = createSlice({
    name: 'geometry',
    initialState,
    reducers: {
        'setPathsDescriptions': setPathsDescriptionsReducer,
        'resetGeometry': state => {
            state.svgPaths = null
            state.paths = null
            state.meshes = null
        },
        'updateAllGeometry': updateAllGeometryReducer,
        'setSelection': (state, {payload}) => {state.selectionIndex = payload},
        'updateParameters': updateParametersReducer
    }
})

export const {setPathsDescriptions, resetGeometry, updateAllGeometry, setSelection, updateParameters} = geometrySlice.actions

export default geometrySlice.reducer