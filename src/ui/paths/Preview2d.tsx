import React, {useEffect, useRef} from 'react'
import {Box, Size, Vec, Vector} from '../../geometry/types'
import * as colors from 'src/style/colors'
import * as g from 'src/geometry/operations'
import {OffsetPath} from 'src/state/geometry'
import {useAppSelector} from '../../state/hooks'
import {View2dState} from '../../state/view2d'
import setViewWindow from './setViewWindow'

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
    const view = useAppSelector<View2dState>(state => state.view2d)
    const selectionIndex = useAppSelector<number>(state => state.geometry.selectionIndex)

    useEffect(() => {
        // make sure canvas updates properly
        const context = canvas.current?.getContext('2d')
        if (!context) {
            return
        }

        if (boundingBox) {
            setViewWindow(context, size, boundingBox, view)
        }

        if (paths) {
            for (let i = 0; i < paths.length; ++i) {
                const path = paths[i]
                const {data, isClosed} = path.profile
                context.strokeStyle = i === selectionIndex ? colors.selectedPath : colors.path
                drawTessellated(context, data, isClosed)

                if (showOffsets) {
                    context.strokeStyle = colors.pathOffset
                    drawTessellated(context, path.right, isClosed)
                    drawTessellated(context, path.left, isClosed)
                }
            }
        }
    }, [paths, boundingBox, view, selectionIndex])

    return <div><canvas ref={canvas} width={size.width} height={size.height}/></div>
}
