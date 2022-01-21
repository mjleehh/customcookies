import React, {useEffect, useRef} from 'react'
import {Box, Path, Size, Vec, Vector} from 'src/geometry/types'
import * as colors from 'src/style/colors'
import * as g from 'src/geometry/operations'
import {useAppSelector} from '../state/hooks'
import {SvgPath} from '../processing/svg/types'
import paintSvgPath from '../processing/svg/paintSvgPath'
import CanvasPathBrush from '../processing/CanvasPathBrush'
import PathPainter from '../processing/PathPainter'

type PathViewProps = {
    size: Size
}

export default function PathView({size}: PathViewProps) {
    const canvas = useRef<HTMLCanvasElement>(null)

    const paths = useAppSelector<SvgPath[] | null>(state => state.geometry.svgPaths)
    const boundingBox = useAppSelector<Box | null>(state => state.geometry.boundingBox)
    useEffect(() => {
        // make sure canvas updates properly
        const context = canvas.current?.getContext('2d')
        if (!context) {
            return
        }

        context.resetTransform()
        context.clearRect(0, 0, size.width, size.height)

        if (paths && boundingBox && paths.length > 0) {
            const pathCenter = g.center(boundingBox)
            const canvasCenter = Vec(size.width / 2, size.height / 2)
            const pathSize = g.size(boundingBox)

            const canvasAspect = size.width / size.height
            const pathAspect = pathSize.width / pathSize.height

            const scale = (pathAspect > canvasAspect ? size.width / pathSize.width : size.height / pathSize.height) * 0.95
            const translation = g.sub(canvasCenter, g.scale(scale, pathCenter))

            context.setTransform(scale, 0, 0, scale, g.X(translation), g.Y(translation))

            context.lineWidth = 1 / scale

            const tessellatingBrush = new CanvasPathBrush(context)
            const painter = new PathPainter(tessellatingBrush)
            for (let path of paths) {
                context.strokeStyle = colors.path
                paintSvgPath(painter, path)
            }
        }
    }, [paths, boundingBox])

    return <div><canvas ref={canvas} width={size.width} height={size.height}/></div>
}
