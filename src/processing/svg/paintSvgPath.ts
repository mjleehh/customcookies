import PathPainter from '../PathPainter'
import parseSvgPath from './parseSvgPath'
import {Command, SvgPath} from './types'

export default function paintSvgPath(path: SvgPath, p: PathPainter) {
    feedMoveTo(p, path.move)
    for (let cmd of path.commands) {
        feedCommand(p, cmd)
    }
    if (path.isClosed) {
        p.close()
    }
}

function feedMoveTo(p: PathPainter, {params, isRelative}: Command): void {
    if (params.length % 2 != 0) {
        throw `move command supplied invalid number of arguments: ${params.length}`
    }

    const [xStart, yStart, ...linePoints] = params
    p.begin(xStart, yStart)

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

function feedQuadricCurve(p: PathPainter, {params, isRelative}: Command): void {
    if (params.length % 4 != 0) {
        throw `line to command supplied invalid number of arguments: ${params.length}`
    }

    let curvePoints = params
    while (curvePoints.length > 0) {
        const [cx, cy, x, y] = curvePoints
        p.quadricCurveTo(cx, cy, x, y, isRelative)
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
            feedQuadricCurve(p, cmd)
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