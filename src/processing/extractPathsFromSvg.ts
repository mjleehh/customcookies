export default function extractPathsFromSvg(svgString: string): string[] {
    const parser = new DOMParser()
    const svg = parser.parseFromString(svgString, "text/xml")
    const tags = svg.getElementsByTagName('path')
    const pathDescriptions = [] as string[]
    for (let i = 0; i < tags.length; ++i) {
        const description = tags[i].getAttribute('d')
        if (description) {
            pathDescriptions.push(description)
        }
    }
    return pathDescriptions
}
