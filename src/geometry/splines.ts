import * as m from 'mathjs'
import {Vector} from './types'

const quadricFunc = m.compile('((1 - t)^2 p1 + 2 (1 - t) t cv + t^2 p2)')

export const quadricSpline = (p1: Vector, cv: Vector, p2: Vector) => (t: number) => {
    return quadricFunc.evaluate({p1, cv, p2, t})
}

const cubicFunc = m.compile('(1-t)^3 p1 + 3 (1-t)^2 t * c1 + 3 (1-t) t^2 c2 + t^3 p2')

export const  cubicSpline = (p1: Vector, c1: Vector, c2: Vector, p2: Vector) => (t: number) => {
    return cubicFunc.evaluate({p1, c1, c2, p2, t})
}
