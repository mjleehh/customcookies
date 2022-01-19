export type Vector = [number, number]

export function Vec(x: number, y: number): Vector {
    return [x, y]
}

export type Vector3 = [number, number, number]

export type Face = number[]

export type Path = {
    isClosed: boolean
    data: Vector[]
}

export type Mesh = {
    vertices: Vector3[]
    faces: Face[]
}

export type Box = {
    left: number
    top: number
    right: number
    bottom: number
}

export type Size = {
    width: number,
    height: number,
}
