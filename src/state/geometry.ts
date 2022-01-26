import {createSlice, Draft, PayloadAction} from '@reduxjs/toolkit'
import {Box, Mesh, Path, PathVertices, Vector} from 'src/geometry/types'
import {SvgPath} from 'src/processing/svg/types'
import TessellatingPathBrush from 'src/processing/TessellatingPathBrush'
import PathPainter from 'src/processing/PathPainter'
import paintSvgPath from 'src/processing/svg/paintSvgPath'
import {generateMesh, offset, Side} from 'src/processing/generateMesh'
import _ from 'lodash'
import {calculateBoundingBox, mergeBoxes} from '../geometry/operations'
import * as g from '../geometry/operations'

const TESSELLATION_FOR_BOUNDING_BOX = 100

export interface OffsetPath {
    profile: Path
    left: PathVertices
    right: PathVertices
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

function offsetPathBoundingBox({profile, left, right}: OffsetPath) {
    return mergeBoxes(calculateBoundingBox(profile.data),
        mergeBoxes(calculateBoundingBox(left), calculateBoundingBox(right)))
}

function updateGeometryReducer(state: Draft<GeometryState>, {payload}: PayloadAction<UpdateGeometryActionPayload>) {
    const {tessellation, thickness} = payload
    if (!state.svgPaths) {
        return
    }

    let meshes: Mesh[] = []
    let paths: OffsetPath[] = []
    for (let pathDescription of state.svgPaths) {
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
            meshes.push(generateMesh(offsetPath, 10))
        }
    }

    state.meshes = meshes
    state.paths = paths
    state.boundingBox = paths.map(offsetPathBoundingBox).reduce(mergeBoxes)
}

function setPathsDescriptionsReducer(state: Draft<GeometryState>, {payload}: PayloadAction<SvgPath[]>) {
    state.svgPaths = payload

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
    // state.boundingBox = _.transform(paths,
    //     (box, path) => mergeBoxes(box, calculateBoundingBox(path))
    //     , g.calculateBoundingBox(paths[0]))
    state.boundingBox = paths.map(calculateBoundingBox).reduce(mergeBoxes)

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
        'updateGeometry': updateGeometryReducer,
    }
})

export const {setPathsDescriptions, resetGeometry, updateGeometry} = geometrySlice.actions

export default geometrySlice.reducer