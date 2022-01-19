import PathBrush from './PathBrush'
import {Vector} from './geometry/types'

export default class PathPainter {
    constructor(b: PathBrush) {
        this.b = b
    }

    begin(x: number, y: number): void {
        this.pos = [x, y]
        console.log('begin', [x, y])
        this.b.begin(x, y)
    }

    close() {
        this.b.close()
    }

    lineTo(x: number, y: number, relative: boolean): void {
        const [xAbs, yAbs] = this.updateAbsolute(x, y, relative)
        console.log('line to', [xAbs, yAbs], relative)
        this.b.lineTo(xAbs, yAbs)
        this.cv = null
    }

    horizontalLineTo(x: number, relative: boolean): void {
        const [_, yPos] = this.pos
        this.lineTo(x, relative ? 0 : yPos, relative)
    }

    verticalLineTo(y: number, relative: boolean): void {
        const [xPos, _] = this.pos
        this.lineTo(relative ? 0 : xPos, y, relative)
    }

    quadricCurveTo(cx: number, cy: number, x: number, y: number, relative: boolean): void {
        const cvAbs = this.calculateAbsolute(cx, cy, relative)
        const pAbs = this.updateAbsolute(x, y, relative)
        console.log('quadric', [cvAbs[0], cvAbs[1]], [pAbs[0], pAbs[1]])
        this.b.quadricCurveTo(cvAbs[0], cvAbs[1], pAbs[0], pAbs[1])
        this.pos = pAbs
        this.cv = cvAbs
    }

    cubicCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number, relative: boolean): void {
        const c1Abs = this.calculateAbsolute(c1x, c1y, relative)
        const c2Abs = this.calculateAbsolute(c2x, c2y, relative)
        const pAbs = this.updateAbsolute(x, y, relative)
        console.log('cubic', [c1Abs[0], c1Abs[1]], [c2Abs[0], c2Abs[1]], [pAbs[0], pAbs[1]])
        this.b.cubicCurveTo(c1Abs[0], c1Abs[1], c2Abs[0], c2Abs[1], pAbs[0], pAbs[1])
        this.pos = pAbs
        this.cv = c2Abs
    }

    continuousCurveTo(c2x: number, c2y: number, x: number, y: number, relative: boolean): void {
        throw 'continuous curves are not yet implemented'
    }

    private calculateAbsolute(x: number, y: number, relative: boolean): Vector {
        if (relative) {
            const [xPos, yPos] = this.pos
            return [xPos + x, yPos + y]
        } else {
            return [x, y]
        }
    }

    private updateAbsolute(x: number, y: number, relative: boolean): Vector {
        this.pos = this.calculateAbsolute(x, y, relative)
        return this.pos
    }

    private b: PathBrush
    private pos: Vector = [0, 0]
    private cv: Vector | null = null
}
