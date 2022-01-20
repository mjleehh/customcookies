import {Face, Mesh, Path, Vector, Vector3} from './geometry/types'
import * as m from 'mathjs'
import * as g from 'src/geometry/operations'
import {OffsetPath} from './state/geometry'

function direction(base: Vector, tip: Vector): Vector {
    const v = g.sub(tip, base)
    const length = g.norm(v)
    if (length <= 0) {
        throw 'degenerate line of length 0'
    }
    return m.divide(v, length) as Vector
}

function rotateCw(v: Vector): Vector {
    const [x, y] = v
    return [y, -x]
}

function rotateCcw(v: Vector): Vector {
    const [x, y] = v
    return [-y, x]
}

const intersectionFunc = m.compile('p + d * (t0 + (1 - t0 * t1) / (e0 * t1) * e0)')
function intersectionPoint(p: Vector, d: number, t0: Vector, t1: Vector, e0: Vector): Vector {
    return intersectionFunc.evaluate({p, d, t0, t1, e0})
}

const offsetFunc = m.compile('p + d t1')
function offsetPoint(p: Vector, d: number, t1: Vector): Vector {
    return offsetFunc.evaluate({p, d, t1})
}

export enum Side {
    right,
    left,
}

export function offset({data, isClosed}: Path, d: number, side: Side): Vector[] {
    if (data.length < 2) {
        throw 'invalid path! at least 2 points required'
    }

    function normalsFromIndex(i: number): [Vector, Vector] {
        const idx = (j: number) => (j + data.length) % data.length
        const p0 = data[idx(i)]
        const p1 = data[idx(i+1)]
        const e0 = direction(p0, p1)
        const t0 = side === Side.right ? rotateCcw(e0) : rotateCw(e0)
        return [e0, t0]
    }

    const res = [] as Vector[]

    for (let i = 0; i < data.length; ++i) {
        const [_, t1] = normalsFromIndex(i)
        const [e0, t0] = normalsFromIndex(i - 1)

        let pi = [0, 0] as Vector
        const p = data[i]
        if (!isClosed && i === 0) {
            pi = offsetPoint(p, d, t1)
        } else  if (!isClosed && i === data.length - 1) {
            pi = offsetPoint(p, d, t0)
        } else {
            pi = intersectionPoint(p, d, t0, t1, e0)
        }
        res.push(pi)
    }
    return res
}

export function generateMesh({profile, left, right}: OffsetPath, height: number): Mesh {
    const length = profile.data.length
    if (right.length != length || left.length != length) {
        throw 'curve lengths missmatch'
    }

    const profileIdx = (i: number) => i % length
    const rightIdx = (i: number) => i % length + length
    const leftIdx  = (i: number) => i % length + 2 * length
    const liftVertex = (height: number) => (v: Vector): Vector3 => [v[0], v[1], height]

    const vertices = [
        ...profile.data.map(liftVertex(0)),
        ...right.map(liftVertex(height)),
        ...left.map(liftVertex(height)),
    ]
    const faces = [] as Face[]

    const generateSegment = (i: number) => {
        faces.push([leftIdx(i + 1), rightIdx(i), leftIdx(i)])
        faces.push([leftIdx(i + 1), rightIdx(i + 1), rightIdx(i)])
        faces.push([profileIdx(i), rightIdx(i), profileIdx(i + 1)])
        faces.push([rightIdx(i), rightIdx(i + 1), profileIdx(i + 1)])
        faces.push([profileIdx(i + 1), leftIdx(i), profileIdx(i)])
        faces.push([profileIdx(i + 1), leftIdx(i + 1), leftIdx(i), ])
    }

    for (let i = 0; i < length - 1; ++i) {
        generateSegment(i)
    }
    if (profile.isClosed) {
        generateSegment(length - 1)
    } else {
        faces.push([profileIdx(0), leftIdx(0), rightIdx(0)])
        faces.push([profileIdx(length -1 ), rightIdx(length - 1), leftIdx( length - 1)])
    }

    return {vertices, faces}
}