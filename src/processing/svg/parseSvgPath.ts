import {
    CLOSER_SYMS,
    commandRegExp, DELIMITER_SYMS,
    MOVE_NAME_SYMS,
    NON_COMMAND_SYMS,
    NON_MOVE_NAME_SYMS, PATH_PATTERN,
    pathRegExp
} from './regular_expressions'
import {Command, SvgPath} from './types'

function evaluateCommands(commandsStr: string): Command[] {
    let rest = commandsStr
    const res = [] as Command[]
    while (rest.length) {
        const commandMatch = commandRegExp.exec(rest)
        if (!commandMatch) {
            throw `invalid command string encountered: ${rest}`
        }
        const [commandStr, symbol, paramStr] = commandMatch
        const name = symbol.toLowerCase()

        res.push({
            name,
            // FIXME: parseFloat is too sloppy
            params: paramStr.split(DELIMITER_SYMS).filter(e => e.length > 0).map(parseFloat) as number[],
            isRelative: name === symbol,
        })
        rest = rest.slice(commandStr.length)
    }
    return res
}

export default function parseSvgPath(str: string): SvgPath  {
    const allMatch = pathRegExp.exec(str)
    if (!allMatch) {
        const a = PATH_PATTERN
        debugger
        throw `unsupported SVG path: ${str}`
    }
    const [_, moveSection, commandSection, __, closedSection] = allMatch
    return {
        move: evaluateCommands(moveSection)[0],
        commands: evaluateCommands(commandSection),
        isClosed: closedSection.length > 0,
    }
}