import {Vector} from '../geometry/types'

export default class CanvasPathBrush {
    constructor(p: CanvasRenderingContext2D) {
        this.p = p
    }

    begin(x: number, y: number) {
        this.p.beginPath()
        this.p.moveTo(x, y)
    }

    lineTo(x: number, y: number): void {
        this.p.lineTo(x, y)
    }

    quadricCurveTo(cx: number, cy: number, x: number, y: number): void {
        this.p.quadraticCurveTo(cx, cy, x, y)
    }

    cubicCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void {
        this.p.bezierCurveTo(c1x, c1y, c2x, c2y, x, y)
    }

    close(): void {
        this.p.closePath()
        this.p.stroke()
    }

    private p: CanvasRenderingContext2D
}
