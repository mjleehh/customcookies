import React, {useEffect, useRef} from 'react'
import {Path, Size, Vec} from '../geometry/types'
import * as colors from '../style/colors'
import * as g from '../geometry/operations'

function drawTesselated({data, isClosed}: Path,p: CanvasRenderingContext2D) {
    p.beginPath()
    const [x0, y0] = data[0]
    p.moveTo(x0, y0)
    for (let vertex of data.slice(1)) {
        const [x, y] = vertex
        p.lineTo(x, y)
    }
    if (isClosed) {
        p.lineTo(x0, y0)
    }
    p.stroke()
}

type Preview2dProps = {
    paths: Path[]
    size: Size
}

export default function Preview2d({paths, size}: Preview2dProps) {
    const canvas = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        // make sure canvas updates properly
        const context = canvas.current?.getContext('2d')
        if (!context) {
            return
        }

        context.resetTransform()
        context.clearRect(0, 0, size.width, size.height)

        if (paths.length > 0) {
            const boundingBox = g.calculateBoundingBox(paths[0])
            const pathCenter = g.center(boundingBox)
            const canvasCenter = Vec(size.width / 2, size.height / 2)
            const pathSize = g.size(boundingBox)

            const canvasAspect = size.width / size.height
            const pathAspect = pathSize.width / pathSize.height

            const scale = (pathAspect > canvasAspect ? size.width / pathSize.width : size.height / pathSize.height) * 0.95
            const translation = g.sub(canvasCenter, g.scale(scale, pathCenter))

            context.setTransform(scale, 0, 0, scale, g.X(translation), g.Y(translation))

            context.strokeStyle = colors.path
            context.lineWidth = 1 / scale
        }

        for (let path of paths) {

            drawTesselated(path, context)
        }
    })

    return <div><canvas ref={canvas} width={size.width} height={size.height}/></div>
}
