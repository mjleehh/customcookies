import {pathsRegExp} from './regular_expressions'
import parseSvgPath from './parseSvgPath'
import {SvgPath} from './types'


function processPaths(description: string): SvgPath {
    if (!pathsRegExp.test(description)) {
        throw `bad SVG path ${description}`
    }

    const pathStrs = []
    let rest = description
    for (let item of Array.from(description.matchAll(/[mM]/g)).reverse()) {
        pathStrs.push(rest.slice(item.index).trim())
        rest = rest.slice(0, item.index)
    }
    return pathStrs.map(parseSvgPath).reverse()
}


export default function extractPathsFromSvg(svgString: string): SvgPath[] {
    const parser = new DOMParser()
    const svg = parser.parseFromString(svgString, "text/xml")
    const tags = svg.getElementsByTagName('path')
    let paths: SvgPath[] = []
    for (let i = 0; i < tags.length; ++i) {
        const description = tags[i].getAttribute('d')
        if (description) {
            paths.push(processPaths(description))
        }
    }
    return paths
}
