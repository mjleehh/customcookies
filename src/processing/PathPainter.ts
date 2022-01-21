import PathBrush from './PathBrush'
import {Vector} from 'src/geometry/types'
import * as g from 'src/geometry/operations'

export default class PathPainter {
    constructor(b: PathBrush) {
        this.b = b
    }

    begin(x: number, y: number): void {
        this.pos = [x, y]
        this.b.begin(x, y)
    }

    moveTo(x: number, y: number, relative: boolean): void {
        const [xAbs, yAbs] = this.updateAbsolute(x, y, relative)
        this.begin(xAbs, yAbs)
    }

    close() {
        this.b.close()
    }

    finalize() {
        this.b.finalize()
    }

    lineTo(x: number, y: number, relative: boolean): void {
        const [xAbs, yAbs] = this.updateAbsolute(x, y, relative)
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
        this.b.quadricCurveTo(cvAbs[0], cvAbs[1], pAbs[0], pAbs[1])
        this.pos = pAbs
        this.cv = cvAbs
    }

    cubicCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number, relative: boolean): void {
        const c1Abs = this.calculateAbsolute(c1x, c1y, relative)
        const c2Abs = this.calculateAbsolute(c2x, c2y, relative)
        const pAbs = this.updateAbsolute(x, y, relative)
        this.b.cubicCurveTo(c1Abs[0], c1Abs[1], c2Abs[0], c2Abs[1], pAbs[0], pAbs[1])
        this.pos = pAbs
        this.cv = c2Abs
    }

    continuousCubicCurveTo(c2x: number, c2y: number, x: number, y: number, relative: boolean): void {
        if (!this.cv) {
            throw 'no previous CV for continuous curve'
        }
        const c1Abs = g.scale(-1, this.cv)
        this.cubicCurveTo(g.X(c1Abs), g.Y(c1Abs), c2x, c2y, x, y, relative)
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
