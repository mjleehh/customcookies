import {
    commandRegExp, DELIMITER_CHARS,
    pathRegExp
} from './regular_expressions'
import {Command, SvgPathSegment} from './types'

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
            params: paramStr.split(DELIMITER_CHARS).filter(e => e.length > 0).map(parseFloat) as number[],
            isRelative: name === symbol,
        })
        rest = rest.slice(commandStr.length)
    }
    return res
}

export default function parseSvgPath(str: string): SvgPathSegment  {
    const allMatch = pathRegExp.exec(str)
    if (!allMatch) {
        throw `unsupported SVG path: ${str}`
    }
    const [, moveSection, commandSection, , closedSection] = allMatch
    return {
        move: evaluateCommands(moveSection)[0],
        commands: evaluateCommands(commandSection),
        isClosed: closedSection.length > 0,
    }
}