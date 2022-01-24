import {Box, Size, Vector} from './types'

export function X(v: Vector) {
    return v[0]
}

export function Y(v: Vector) {
    return v[1]
}

export function calculateBoundingBox(path: Vector[]): Box {
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

export function mergeBoxes(...boxes: Box[]): Box {
    if (boxes.length < 1) {
        throw 'no boxes provided to merge'
    }
    let {left, top, right, bottom} = boxes[0]
    for (let i = 1; i < boxes.length; ++i) {
        const box = boxes[0]
        left = box.left < left ? box.left : left
        right = box.right > right ? box.right : right
        top = box.top < top ? box.top : top
        bottom = box.bottom > bottom ? box.bottom : bottom
    }
    return {left, top, right, bottom}
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
