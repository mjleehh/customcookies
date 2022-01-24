import React, {useEffect, useRef} from 'react'
import {Box, Size, Vec, Vector} from '../geometry/types'
import * as colors from 'src/style/colors'
import * as g from 'src/geometry/operations'
import {OffsetPath} from 'src/state/geometry'
import {useAppSelector} from '../state/hooks'
import {View2dState} from '../state/view2d'

function drawTessellated(p: CanvasRenderingContext2D, vertices: Vector[], isClosed = false) {
    p.beginPath()
    const [x0, y0] = vertices[0]
    p.moveTo(x0, y0)
    for (let vertex of vertices.slice(1)) {
        const [x, y] = vertex
        p.lineTo(x, y)
    }
    if (isClosed) {
        p.lineTo(x0, y0)
    }
    p.stroke()
}

type Preview2dProps = {
    size: Size
    showOffsets: boolean
}

export default function Preview2d({size, showOffsets}: Preview2dProps) {
    const canvas = useRef<HTMLCanvasElement>(null)

    const paths = useAppSelector<OffsetPath[] | null>(state => state.geometry.paths)
    const boundingBox = useAppSelector<Box | null>(state => state.geometry.boundingBox)
    const {translateX, translateY, zoom} = useAppSelector<View2dState>(state => state.view2d)

    useEffect(() => {
        // make sure canvas updates properly
        const context = canvas.current?.getContext('2d')
        if (!context) {
            return
        }

        context.resetTransform()
        context.clearRect(0, 0, size.width, size.height)

        if (paths && boundingBox && paths.length > 0) {
            const pathCenter = g.add(g.center(boundingBox), [translateX, translateY])
            const canvasCenter = Vec(size.width / 2, size.height / 2)
            const pathSize = g.size(boundingBox)

            const canvasAspect = size.width / size.height
            const pathAspect = pathSize.width / pathSize.height

            const scale = (pathAspect > canvasAspect ? size.width / pathSize.width : size.height / pathSize.height) * 0.95 * zoom
            const translation = g.sub(canvasCenter, g.scale(scale, pathCenter))

            context.setTransform(scale, 0, 0, scale, g.X(translation), g.Y(translation))

            context.lineWidth = 1 / scale

            for (let path of paths) {
                const {data, isClosed} = path.profile
                context.strokeStyle = colors.path
                drawTessellated(context, data, isClosed)

                if (showOffsets) {
                    context.strokeStyle = colors.pathOffset
                    drawTessellated(context, path.right, isClosed)
                    drawTessellated(context, path.left, isClosed)
                }
            }
        }
    }, [paths, boundingBox, translateX, translateY, zoom])

    return <div><canvas ref={canvas} width={size.width} height={size.height}/></div>
}
