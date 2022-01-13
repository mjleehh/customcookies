import PathBrush, {createPathBrush} from './PathBrush'

function numify(arr: string[], num: number): [number[], string[]] {
    if (arr.length < num) {
        console.error('to few elements for numify')
    }
    const numStrs = arr.slice(0, num).map(parseFloat)
    return [numStrs, arr.slice(num)]
}

export function startPath<T extends PathBrush>(str: string, creator: createPathBrush<T>): [T, string[]] {
    const [cmd, ...tail] = str.trim().split(' ').filter((elem) => elem.length)
    if (cmd !== 'm') {
        throw 'path has to start with a move-to command'
    }
    const [[x, y], rest] = numify(tail, 2)
    return [creator(x, y), rest]
}

export function feedCommand(p: PathBrush, tokens: string[]) {
    const [cmd, ...tail] = tokens
    switch (cmd.toLowerCase()) {
        case 'l': {
            const [[x, y], rest] = numify(tail, 2)
            p.lineTo(x, y)
            return rest
        }
        case 'h': {
            const [[x, y], rest] = numify(tail, 2)
            p.lineTo(x, y)
            return rest
        }
        case 'v': {
            const [[x, y], rest] = numify(tail, 2)
            p.lineTo(x, y)
            return rest
        }
        case 'c': {
            const [[c1x, c1y, c2x, c2y, x, y], rest] = numify(tail, 6)
            p.cubicCurveTo(c1x, c1y, c2x, c2y, x, y)
            return rest
        }
        case 's': {
            const [[c2x, c2y, x, y], rest] = numify(tail, 4)
            p.continuousCurveTo(c2x, c2y, x, y)
            return rest
        }
        case 'q': {
            const [[cx, cy, x, y], rest] = numify(tail, 4)
            p.quadricCurveTo(cx, cy, x, y)
            return rest
        }
        case 'z': {
            p.closePath()
            if (tail.length) {
                console.error('z should terminate a path')
            }
            return []
        }
        case 'm': {
            console.error('invalid m command mind path')
            return []
        }
        case 't': {
            console.error('infered CVs not supported')
            return []
        }
        case 'a': {
            console.error('arcs are not supported')
            return []
        }
        default:
            console.error(`unknown command ${cmd}`)
            return []
    }
}