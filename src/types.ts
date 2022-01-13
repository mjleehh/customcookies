export type Vector = [number, number]

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