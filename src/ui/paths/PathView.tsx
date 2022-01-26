import React, {useEffect, useRef} from 'react'
import {Box, Size, Vec} from 'src/geometry/types'
import * as colors from 'src/style/colors'
import * as g from 'src/geometry/operations'
import {useAppSelector} from '../../state/hooks'
import {SvgPath} from '../../processing/svg/types'
import paintSvgPath from '../../processing/svg/paintSvgPath'
import CanvasPathBrush from '../../processing/CanvasPathBrush'
import PathPainter from '../../processing/PathPainter'
import setViewWindow from './setViewWindow'
import {View2dState} from '../../state/view2d'

type PathViewProps = {
    size: Size
}

export default function PathView({size}: PathViewProps) {
    const canvas = useRef<HTMLCanvasElement>(null)

    const paths = useAppSelector<SvgPath[] | null>(state => state.geometry.svgPaths)
    const boundingBox = useAppSelector<Box | null>(state => state.geometry.boundingBox)
    const view = useAppSelector<View2dState>(state => state.view2d)
    const selectionIndex = useAppSelector<number>(state => state.parameters.selectionIndex)

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
            const tessellatingBrush = new CanvasPathBrush(context)
            const painter = new PathPainter(tessellatingBrush)
            for (let i = 0; i < paths.length; ++i) {
                context.strokeStyle = i === selectionIndex ? colors.selectedPath : colors.path
                paintSvgPath(painter, paths[i])
            }
        }
    }, [paths, boundingBox, view, selectionIndex])

    return <div><canvas ref={canvas} width={size.width} height={size.height}/></div>
}
