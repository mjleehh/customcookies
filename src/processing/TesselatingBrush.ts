import 'src/geometry/splines'
import {cubicSpline, quadricSpline} from 'src/geometry/splines'
import {Vector} from 'src/geometry/types'
import PathBrush from './PathBrush'

export default class TesselatingBrush implements PathBrush {
    constructor(tesselation: number) {
        if (tesselation < 0) {
            throw 'tesselation level must be at least 1'
        }

        this.tesselation = tesselation
    }

    begin(x: number, y: number): void {
        this.addVertex(x, y)
    }

    lineTo(x: number, y: number): void {
        this.addVertex(x, y)
        this.prevCV = null
    }

    quadricCurveTo(cx: number, cy: number, x: number, y: number): void {
        const f = quadricSpline(this.pos, [cx, cy], [x, y])
        for (let i = 1; i < this.tesselation; ++i) {
            const [vx, vy] = f(i/this.tesselation)
            this.addVertex(vx, vy)
        }
        this.addVertex(x, y)
        this.prevCV = [cx, cy]
    }

    cubicCurveTo(c1x: number, c1y: number, c2x: number, c2y: number, x: number, y: number): void {
        const f = cubicSpline(this.pos, [c1x, c1y], [c2x, c2y], [x, y])
        for (let i = 1; i < this.tesselation; ++i) {
            const [vx, vy] = f(i/this.tesselation)
            this.addVertex(vx, vy)
        }
        this.addVertex(x, y)
        this.prevCV = [c2x, c2y]
    }

    continuousCurveTo(c2x: number, c2y: number, x: number, y: number): void {
        throw 'continuous curves not implemented yet'
    }

    close(): void {
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
    private isClosed: boolean = false
    private _path: Vector[] = []
}
