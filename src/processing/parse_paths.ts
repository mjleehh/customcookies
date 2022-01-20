import PathPainter from './PathPainter'

const MOVE_NAMES = 'Mm'
const NON_MOVE_NAMES = 'LlHhVvCcSsQqTtAa'

const MOVE_COMMAND = `[${MOVE_NAMES}]`
const NON_MOVE_COMMAND = `[${NON_MOVE_NAMES}]`
const COMMAND = `[${MOVE_NAMES}${NON_MOVE_NAMES}]`

const NON_COMMAND = '[\-0-9. ,]'
const DELIMITERS = /[ ,]/
const CLOSER = '[Zz]'

const pathPattern = new RegExp(
    `^(${MOVE_COMMAND}${NON_COMMAND}+)((${NON_MOVE_COMMAND}${NON_COMMAND}+)*)(${CLOSER}?)$`)

const commandPattern = new RegExp(`(${COMMAND})(${NON_COMMAND}+)`)

type Command = {
    name: string,
    params: number[]
    isRelative: boolean
}

type SvgPath = {
    move: Command,
    commands: Command[],
    isClosed: boolean,
}

function evaluateCommands(commandsStr: string): Command[] {
    let rest = commandsStr
    const res = [] as Command[]
    while (rest.length) {
        const commandMatch = commandPattern.exec(rest)
        if (!commandMatch) {
            throw `invalid command string encountered: ${rest}`
        }
        const [commandStr, symbol, paramStr] = commandMatch
        const name = symbol.toLowerCase()

        res.push({
            name,
            // FIXME: parseFloat is too sloppy
            params: paramStr.split(DELIMITERS).filter(e => e.length > 0).map(parseFloat) as number[],
            isRelative: name === symbol,
        })
        rest = rest.slice(commandStr.length)
    }
    return res
}

function preEvaluate(str: string): SvgPath  {
    const allMatch = pathPattern.exec(str)
    if (!allMatch) {
        throw `unsupported SVG path: ${str}`
    }
    const [_, moveSection, commandSection, __, closedSection] = allMatch
    return {
        move: evaluateCommands(moveSection)[0],
        commands: evaluateCommands(commandSection),
        isClosed: closedSection.length > 0,
    }
}

export function parsePath(str: string, p: PathPainter) {
    const path = preEvaluate(str.trim())
    feedMoveTo(p, path.move)
    for (let cmd of path.commands) {
        feedCommand(p, cmd)
    }
    if (path.isClosed) {
        p.close()
    }
}

export function feedMoveTo(p: PathPainter, {params, isRelative}: Command): void {
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

function feedHorizontalLine(p: PathPainter, cmd: Command): void {
    throw 'not implemented'
}

function feedVerticalLine(p: PathPainter, cmd: Command): void {
    throw 'not implemented'
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
            throw 'not implemented'
        }
        case 'Q':
        case 'q': {
            throw 'not implemented'
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
            throw `unsupported command ${cmd}`
    }
}