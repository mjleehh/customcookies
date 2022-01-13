import './splines'
import {cubicSpline} from './splines'
import {Vector} from './types'

export class TesselatingBrush {
    constructor(x: number, y: number, tesselation: number) {
        if (tesselation < 0) {
            throw 'tesselation level must be at least 1'
        }

        this.tesselation = tesselation
        this.prevCV = null
        this.isClosed = false
        this._path = [[x, y]]
    }

    lineTo(x: number, y: number): void {
        this.addVertex(x, y)
        this.prevCV = null
    }

    horizontalLineTo(x: number): void {
        const [_, y] = this.pos
        this.addVertex(x, y)
        this.prevCV = null
    }

    verticalLineTo(y: number): void {
        const [x, _] = this.pos
        this.addVertex(x, y)
        this.prevCV = null
    }

    quadricCurveTo(cx: number, cy: number, x: number, y: number): void {
        this.addVertex(x, y)
        this.prevCV = [cx, cy]
        // this.p.quadraticCurveTo(cx, cy, x, y)
        // this.prevCV = [cx, cy]
    }

    cubicCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void {
        const f = cubicSpline(this.pos, [c1x, c1y], [c2x, c2y], [x, y])
        for (let i = 1; i < this.tesselation; ++i) {
            const [vx, vy] = f(i/this.tesselation)
            this.addVertex(vx, vy)
        }
        // this.p.bezierCurveTo(c1x, c1y, c2x, c2y, x, y)
        // this.prevCV = [c2x, c2y]
        this.addVertex(x, y)
        this.prevCV = [c2x, c2y]
    }

    continuousCurveTo(c2x: number, c2y: number, x: number, y: number): void {

    }

    closePath(): void {
        this.isClosed = true
    }

    finalize(): void {}

    get path() {
        return {
            isClosed: this.isClosed,
            data: [...this._path],
        }
    }

    private get pos(): Vector {
        const value =  this._path.at(-1)
        if (!value) {
            throw 'unexpected empty array'
        }
        return value
    }

    private addVertex(x: number, y: number) {
        this._path.push([x, y])
    }

    private tesselation: number
    private prevCV: Vector | null = null
    private isClosed: boolean
    private _path: Vector[]
}

const tesselatingBrushCreator = (tesellation: number) => (x: number, y: number): TesselatingBrush => {
    return new TesselatingBrush(x, y, tesellation)
}
export default tesselatingBrushCreator