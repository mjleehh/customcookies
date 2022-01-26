import {Box, PathVertices, Size, Vector} from './types'
import {SkeletonUtils} from 'three/examples/jsm/utils/SkeletonUtils'
import findBoneTrackData = SkeletonUtils.findBoneTrackData

export function X(v: Vector) {
    return v[0]
}

export function Y(v: Vector) {
    return v[1]
}

export function calculateBoundingBox(path: PathVertices): Box {
    let [left, top] = path[0]
    let [right, bottom] = path[0]

    for (let i = 1; i < path.length; ++i) {
        const [x, y] = path[i]
        left = x < left ? x : left
        right = x > right ? x : right
        top = y < top ? y : top
        bottom = y > bottom ? y : bottom
    }
    return {left, top, right, bottom}
}

export function center(box: Box): Vector {
    const {left, top, right, bottom} = box
    return [(right - left) / 2 + left, (bottom - top) / 2 + top]
}

export function size(box: Box): Size {
    const {left, top, right, bottom} = box
    return {
        width: right - left,
        height: bottom - top,
    }
}

export function mergeBoxes(fst: Box, snd: Box): Box {
    return {
        left:   Math.min(fst.left,   snd.left),
        right:  Math.max(fst.right,  snd.right),
        top:    Math.min(fst.top,    snd.top),
        bottom: Math.max(fst.bottom, snd.bottom),
    }
}

export function add(lhs: Vector, rhs: Vector): Vector {
    return [X(lhs) + X(rhs), Y(lhs) + Y(rhs)]
}

export function sub(lhs: Vector, rhs: Vector): Vector {
    return [X(lhs) - X(rhs), Y(lhs) - Y(rhs)]
}

export function norm(v: Vector): number {
    return Math.sqrt(X(v) * X(v) + Y(v) * Y(v))
}

export function scale(s: number, v : Vector): Vector {
    return [s * X(v), s * Y(v)]
}

export function deg(angle: number) {
    return angle / Math.PI * 180
}

export function rad(angle: number) {
    return angle / 180 * Math.PI
}
