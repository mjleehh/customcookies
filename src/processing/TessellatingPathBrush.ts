import 'src/geometry/splines'
import {cubicSpline, quadraticSpline} from 'src/geometry/splines'
import {Path, Vector} from 'src/geometry/types'
import PathBrush from './PathBrush'
import * as g from '../geometry/operations'

export default class TessellatingPathBrush implements PathBrush {
    constructor(tesselation: number) {
        if (tesselation < 0) {
            throw 'tesselation level must be at least 1'
        }

        this.tesselation = tesselation
    }

    begin(x: number, y: number): void {
        this.currentSegment = []
        this.isClosed = false
        this.addVertex(x, y)
    }

    lineTo(x: number, y: number): void {
        this.addVertex(x, y)
        this.prevCV = null
    }

    quadraticCurve(cx: number, cy: number, x: number, y: number): void {
        const f = quadraticSpline(this.pos, [cx, cy], [x, y])
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

    finalize(): void {
        const path = this.currentSegment
        const length = path.length
        if (length < 2) {
            throw `invalid path of length ${length}`
        }

        // make sure first and last point of path are distinguishable
        //
        const deltaLoop = g.norm(g.sub(path[0], path[length - 1])) <= 0

        this._segments.push({
            isClosed: this.isClosed,
            data: deltaLoop ? path.slice(0, length -1) : path.slice()
        })
    }

    get segments(): Path[] {
        return [...this._segments]
    }

    private get pos(): Vector {
        const value =  this.currentSegment.at(-1)
        if (!value) {
            throw 'unexpected empty array'
        }
        return value
    }

    private addVertex(x: number, y: number) {
        this.currentSegment.push([x, y])
    }

    private readonly tesselation: number
    private prevCV: Vector | null = null
    private isClosed: boolean = false
    private currentSegment: Vector[] = []
    private _segments: Path[] = []
}
