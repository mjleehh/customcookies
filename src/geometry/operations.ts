import {Box, Path, Size, Vector} from './types'

export function X(v: Vector) {
    return v[0]
}

export function Y(v: Vector) {
    return v[1]
}

export function calculateBoundingBox(path: Path): Box {
    let [left, top] = path.data[0]
    let [right, bottom] = path.data[0]

    for (let i = 1; i < path.data.length; ++i) {
        const [x, y] = path.data[i]
        left = x < left ? x : left
        right = x > right ? x : right
        top = y > top ? y : top
        bottom = y < bottom ? y : bottom
    }
    return {left, top, right, bottom}
}

export function center(box: Box): Vector {
    const {left, top, right, bottom} = box
    return [(right - left) / 2 + left, (top - bottom) / 2 + bottom]
}

export function size(box: Box): Size {
    const {left, top, right, bottom} = box
    return {
        width: right - left,
        height: top - bottom,
    }
}

export function add(lhs: Vector, rhs: Vector): Vector {
    return [X(lhs) + X(rhs), Y(lhs) + Y(rhs)]
}

export function sub(lhs: Vector, rhs: Vector): Vector {
    return [X(lhs) - X(rhs), Y(lhs) - Y(rhs)]
}

export function scale(s: number, v : Vector): Vector {
    return [s * X(v), s * Y(v)]
}