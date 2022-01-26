import * as g from 'src/geometry/operations'
import {Box, Size, Vec} from 'src/geometry/types'
import {View2dState} from '../../state/view2d'

export default function setViewWindow(context: CanvasRenderingContext2D, canvasSize: Size, boundingBox: Box, view: View2dState) {
    const {width, height} = canvasSize
    const {translateX, translateY, zoom} = view

    context.resetTransform()
    context.clearRect(0, 0, width, height)

    const pathCenter = g.add(g.center(boundingBox), [translateX, translateY])
    const canvasCenter = Vec(width / 2, height / 2)
    const pathSize = g.size(boundingBox)

    const canvasAspect = width / height
    const pathAspect = pathSize.width / pathSize.height

    const scale = (pathAspect > canvasAspect ? width / pathSize.width : height / pathSize.height) * 0.95 * zoom
    const translation = g.sub(canvasCenter, g.scale(scale, pathCenter))

    context.setTransform(scale, 0, 0, scale, g.X(translation), g.Y(translation))
    context.lineWidth = 1 / scale
}