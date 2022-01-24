import PathPainter from '../PathPainter'
import {Command, SvgPath, SvgPathSegment} from './types'

export default function paintSvgPath(p: PathPainter, path: SvgPath) {
    if (path.length < 1) {
        throw 'invalid empty path'
    }
    const [first, ...tail] = path
    paintSvgPathSegment(p, first, true)
    for (let segment of tail) {
        paintSvgPathSegment(p, segment, false)
    }
}

function paintSvgPathSegment(p: PathPainter, pathSegment: SvgPathSegment, isFirst: boolean) {
    feedMoveTo(p, pathSegment.move, isFirst)
    for (let cmd of pathSegment.commands) {
        feedCommand(p, cmd)
    }
    if (pathSegment.isClosed) {
        p.close()
    }
    p.finalize()
}

function feedMoveTo(p: PathPainter, {params, isRelative}: Command, isFirst: boolean): void {
    if (params.length % 2 != 0) {
        throw `move command supplied invalid number of arguments: ${params.length}`
    }

    const [xStart, yStart, ...linePoints] = params
    if (isFirst) {
        p.begin(xStart, yStart)
    } else {
        p.moveTo(xStart, yStart, isRelative)
    }

    let remainingLinePoints = linePoints
    while (remainingLinePoints.length > 0) {
        const [x, y] = remainingLinePoints
        p.lineTo(x, y, isRelative)
        remainingLinePoints = remainingLinePoints.slice(2)
    }
}

function feedLineTo(p: PathPainter, {params, isRelative}: Command): void {
    if (params.length % 2 != 0) {
        throw `line to command supplied invalid number of arguments: ${params.length}`
    }

    let linePoints = params
    while (linePoints.length > 0) {
        const [x, y] = linePoints
        p.lineTo(x, y, isRelative)
        linePoints = linePoints.slice(2)
    }
}

function feedHorizontalLine(p: PathPainter, {params, isRelative}: Command): void {
    if (params.length < 1) {
        throw `horizontal line to command supplied invalid number of arguments: ${params.length}`
    }

    for (let x of params) {
        p.horizontalLineTo(x, isRelative)
    }
}

function feedVerticalLine(p: PathPainter, {params, isRelative}: Command): void {
    if (params.length < 1) {
        throw `vertical line to command supplied invalid number of arguments: ${params.length}`
    }

    for (let y of params) {
        p.verticalLineTo(y, isRelative)
    }
}

function feedCubicCurve(p: PathPainter, {params, isRelative}: Command): void {
    if (params.length % 6 != 0) {
        throw `line to command supplied invalid number of arguments: ${params.length}`
    }

    let curvePoints = params
    while (curvePoints.length > 0) {
        const [c1x, c1y, c2x, c2y, x, y] = curvePoints
        p.cubicCurveTo(c1x, c1y, c2x, c2y, x, y, isRelative)
        curvePoints = curvePoints.slice(6)
    }
}

function feedContinuousCubicCurve(p: PathPainter, {params, isRelative}: Command): void {
    if (params.length % 4 != 0) {
        throw `line to command supplied invalid number of arguments: ${params.length}`
    }

    let curvePoints = params
    while (curvePoints.length > 0) {
        const [c1x, c1y, x, y] = curvePoints
        p.continuousCubicCurveTo(c1x, c1y, x, y, isRelative)
        curvePoints = curvePoints.slice(4)
    }
}

function feedQuadraticCurve(p: PathPainter, {params, isRelative}: Command): void {
    if (params.length % 4 != 0) {
        throw `line to command supplied invalid number of arguments: ${params.length}`
    }

    let curvePoints = params
    while (curvePoints.length > 0) {
        const [cx, cy, x, y] = curvePoints
        p.quadraticCurveTo(cx, cy, x, y, isRelative)
        curvePoints = curvePoints.slice(4)
    }
}

function feedCommand(p: PathPainter, cmd: Command): void {
    switch (cmd.name) {
        case 'L':
        case 'l': {
            feedLineTo(p, cmd)
            return
        }
        case 'H':
        case 'h': {
            feedHorizontalLine(p, cmd)
            return
        }
        case 'V':
        case 'v': {
            feedVerticalLine(p, cmd)
            return
        }
        case 'C':
        case 'c': {
            feedCubicCurve(p, cmd)
            return
        }
        case 'S':
        case 's': {
            feedContinuousCubicCurve(p, cmd)
            return
        }
        case 'Q':
        case 'q': {
            feedQuadraticCurve(p, cmd)
            return
        }
        case 'Z':
        case 'z': {
            throw 'close command can only occur on end of path'
        }
        case 'm': {
            throw 'move to command can only occur on end of path'
        }
        case 't': {
            throw 'inferred CVs are note supported'
        }
        case 'a': {
            throw 'arcs are not supported'
        }
        default:
            debugger
            throw `unsupported command ${cmd}`
    }
}