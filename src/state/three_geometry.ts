import {Mesh} from '../geometry/types'
import * as t from 'three'
import _ from 'lodash'
import * as colors from '../style/colors'
import * as g from '../geometry/operations'

const CAMERA_FOV = 50

export function viewDistToRotationDelta(fractionOfViewDist: number, cameraDist: number, radius: number): number {
    return g.deg(Math.atan(fractionOfViewDist * (cameraDist / radius - 1) * Math.tan(CAMERA_FOV)))
}

export function calculateInitialCamDistance(radius: number) {
    return radius / Math.tan(t.MathUtils.degToRad(CAMERA_FOV) / 2)
}

export function newThreeCamera(): t.Camera {
    return new t.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 2000)
}

export function newThreeScene() {
    const scene = new t.Scene()
    scene.background = new t.Color(colors.background)
    return scene
}

export function newEmptyThreeGeometry(): t.Group {
    return new t.Group()
}

function meshesToThreeGeometry(meshes: Mesh[]): t.BufferGeometry {
    const geometry = new t.BufferGeometry()

    let offset = 0
    let allFaces = [] as number[]
    let allVertices = [] as number[]

    for (let mesh of meshes) {
        const {vertices} = mesh
        allFaces = allFaces.concat(_.flatten(mesh.faces).map(idx => idx + offset))
        allVertices = allVertices.concat(_.flatten(vertices))
        offset += vertices.length
    }
    geometry.setIndex(allFaces)
    geometry.setAttribute( 'position', new t.Float32BufferAttribute(allVertices, 3 ) )
    geometry.center()
    geometry.computeVertexNormals()
    geometry.computeBoundingSphere()
    return geometry
}

export type CachedGeometry = {
    group: t.Group
    radius: number
}

export function updateThreeCache(meshes: Mesh[]): CachedGeometry {
    const geometry = meshesToThreeGeometry(meshes)
    const {radius} = geometry.boundingSphere as t.Sphere

    const solidMaterial = new t.MeshBasicMaterial({color: colors.surface, wireframe: false, side: t.FrontSide})
    const solid = new t.Mesh(geometry, solidMaterial)
    const wireframeMaterial = new t.MeshBasicMaterial({color: colors.wireframe, wireframe: true})
    const wireframe = new t.Mesh(geometry, wireframeMaterial)

    const group = new t.Group()
    group.add(solid)
    group.add(wireframe)

    return {group, radius}
}