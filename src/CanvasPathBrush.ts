import {Vector} from './types'

class CanvasPathBrush {
    constructor(p: CanvasRenderingContext2D, x: number, y: number) {
        this.p = p
        this.p.beginPath()
        this.p.moveTo(x, y)
        this.pos = [x, y]
        this.prevCV = null
    }

    lineTo(x: number, y: number): void {
        this.p.lineTo(x, y)
        this.pos = [x, y]
        this.prevCV = null
    }

    horizontalLineTo(x: number): void {
        const [_, y] = this.pos
        this.p.lineTo(x, y)
        this.pos = [x, y]
        this.prevCV = null
    }

    verticalLineTo(y: number): void {
        const [x, _] = this.pos
        this.p.lineTo(x, y)
        this.prevCV = null
        this.pos = [x, y]
    }

    quadricCurveTo(cx: number, cy: number, x: number, y: number): void {
        this.p.quadraticCurveTo(cx, cy, x, y)
        this.prevCV = [cx, cy]
        this.pos = [x, y]
    }

    cubicCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void {
        this.p.bezierCurveTo(c1x, c1y, c2x, c2y, x, y)
        this.pos = [x, y]
        this.prevCV = [c2x, c2y]
    }

    continuousCurveTo(c2x: number, c2y: number, x: number, y: number): void {

    }

    closePath(): void {
        this.p.closePath()
    }

    finalize(): void {
        this.p.stroke()
    }

    private p: CanvasRenderingContext2D
    private pos: Vector
    private prevCV: Vector | null
}

const canvasPathBrushCreator = (p: CanvasRenderingContext2D) => (x: number, y: number): CanvasPathBrush => {
    return new CanvasPathBrush(p, x, y)
}
export default canvasPathBrushCreator