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

function meshToThreeGeometry(mesh: Mesh): t.BufferGeometry {
    const geometry = new t.BufferGeometry()

    const faces = _.flatten(mesh.faces)
    const vertices = _.flatten(mesh.vertices)

    geometry.setIndex(faces)
    geometry.setAttribute( 'position', new t.Float32BufferAttribute(vertices, 3 ) )
    geometry.computeVertexNormals()
    geometry.computeBoundingSphere()
    return geometry
}

export type CachedGeometry = {
    group: t.Group
    radius: number
}

export function updateThreeCache(meshes: Mesh[]): CachedGeometry {
    const group = new t.Group()
    const selectedMaterial = new t.MeshBasicMaterial({color: colors.selectedSurface, wireframe: false, side: t.FrontSide})
    const solidMaterial = new t.MeshBasicMaterial({color: colors.surface, wireframe: false, side: t.FrontSide})
    const wireframeMaterial = new t.MeshBasicMaterial({color: colors.wireframe, wireframe: true})

    let sphere: t.Sphere | null = null
    for (let mesh of meshes) {
        const subgroup = new t.Group()
        const geometry = meshToThreeGeometry(mesh)
        const selected = new t.Mesh(geometry, selectedMaterial)
        const solid = new t.Mesh(geometry, solidMaterial)
        const wireframe = new t.Mesh(geometry, wireframeMaterial)
        subgroup.add(selected)
        subgroup.add(solid)
        subgroup.add(wireframe)

        group.add(subgroup)

        const {boundingSphere} = geometry
        if (!boundingSphere) {
            throw 'unexpected invalid bounding sphere'
        }
        sphere = sphere ? sphere.union(boundingSphere) : boundingSphere
    }

    if (!sphere) {
        throw 'failed to calculate overall bounding sphere'
    }
    // center the geometry
    group.translateX(-sphere.center.x)
    group.translateY(-sphere.center.y)
    return {group, radius: sphere.radius}
}

export function highlightSelected(geometry: t.Group, selectionIndex: number) {
    const paths = geometry.children
    for (let i = 0; i < paths.length; ++i) {
        const [selected, unselected] = paths[i].children
        if (i === selectionIndex) {
            selected.visible = true
            unselected.visible = false
        } else {
            selected.visible = false
            unselected.visible = true
        }
    }
}