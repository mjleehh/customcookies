import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit'
import {Box, Mesh, Path, Vector} from 'src/geometry/types'
import {SvgPath} from 'src/processing/svg/types'
import TessellatingPathBrush from 'src/processing/TessellatingPathBrush'
import PathPainter from 'src/processing/PathPainter'
import paintSvgPath from 'src/processing/svg/paintSvgPath'
import {generateMesh, offset, Side} from 'src/processing/generateMesh'
import _ from 'lodash'
import {mergeBoxes} from '../geometry/operations'
import * as g from '../geometry/operations'

export interface OffsetPath {
    profile: Path
    left: Vector[]
    right: Vector[]
}

interface GeometryState {
    svgPaths: SvgPath[] | null
    meshes: Mesh[] | null
    paths: OffsetPath[] | null
    boundingBox: Box | null
}

const initialState: GeometryState = {
    svgPaths: null,
    meshes: null,
    paths: null,
    boundingBox: null,
}

type UpdateGeometryActionPayload = {
    tessellation: number
    thickness: number
}

function updateGeometryReducer(state: Draft<GeometryState>, {payload}: PayloadAction<UpdateGeometryActionPayload>) {
    const {tessellation, thickness} = payload
    const tessellatingBrush = new TessellatingPathBrush(tessellation)
    const painter = new PathPainter(tessellatingBrush)

    if (!state.svgPaths) {
        return
    }

    let meshes = [] as Mesh[]
    let paths = [] as OffsetPath[]
    for (let pathDescription of state.svgPaths) {
        paintSvgPath(painter, pathDescription)
        const {segments} = tessellatingBrush
        for (let segment of segments) {
            const offsetPath = {
                profile: segment,
                right: offset(segment, thickness, Side.right),
                left: offset(segment, thickness, Side.left)
            }
            paths.push(offsetPath)
            meshes.push(generateMesh(offsetPath, 10))
        }
    }
    const boundingBox = _.transform(paths, (box, path) =>
            mergeBoxes(box, g.calculateBoundingBox(path.profile.data),
                g.calculateBoundingBox(path.right),
                g.calculateBoundingBox(path.left))
        , g.calculateBoundingBox(paths[0].profile.data))

    state.meshes = meshes
    state.paths = paths
    state.boundingBox = boundingBox
}

const geometrySlice = createSlice({
    name: 'geometry',
    initialState,
    reducers: {
        'setPathsDescriptions': (state, {payload}: PayloadAction<SvgPath[]>) => {state.svgPaths = payload},
        'resetGeometry': state => {
            state.svgPaths = null
            state.paths = null
            state.meshes = null
        },
        'updateGeometry': updateGeometryReducer,
    }
})

export const {setPathsDescriptions, resetGeometry, updateGeometry} = geometrySlice.actions

export default geometrySlice.reducer