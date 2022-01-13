import * as m from 'mathjs'
import {Vector} from './types'

const cubicFunc = m.parse('(1-t)^3 p1 + 3 (1-t)^2 t * c1 + 3 (1-t) t^2 c2 + t^3 p2')

export const  cubicSpline = (p1: Vector, c1: Vector, c2: Vector, p2: Vector) => (t: number) => {
    return cubicFunc.evaluate({p1, c1, c2, p2, t})
}
