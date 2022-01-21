import React, {useState} from 'react'
import * as t from 'three'
import {useEffect, useRef} from 'react'
import {Mesh, Size, Vector} from 'src/geometry/types'
import _ from 'lodash'
import {useAppSelector} from 'src/state/hooks'
import * as colors from 'src/style/colors'
import {dispatch} from 'src/state/store'
import {setRotations, zoomIn, zoomOut} from 'src/state/rotation'
import * as g from 'src/geometry/operations'

const CAMERA_FOV = 50



function viewDistToRotationDelta(fractionOfViewDist: number, cameraDist: number, radius: number): number {
    return g.deg(Math.atan(fractionOfViewDist * (cameraDist / radius - 1) * Math.tan(CAMERA_FOV)))
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


function setupGeometry(meshes: Mesh[]): {group: t.Group, radius: number} {
    const geometry = meshesToThreeGeometry(meshes)
    const {radius} = geometry.boundingSphere as  t.Sphere

    const solidMaterial = new t.MeshBasicMaterial({color: colors.surface, wireframe: false, side: t.FrontSide})
    //const solidMaterial = new t.MeshNormalMaterial({wireframe: false, side: t.FrontSide})
    const solid = new t.Mesh(geometry, solidMaterial)
    const wireframeMaterial = new t.MeshBasicMaterial({color: colors.wireframe, wireframe: true})
    const wireframe = new t.Mesh(geometry, wireframeMaterial)

    const group = new t.Group()
    group.add(solid)
    group.add(wireframe)

    return {group, radius}
}

type Preview3dProps = {
    meshes: Mesh[] | null
    size: Size
}

type StartDragState = {
    position: Vector
    horizontal: number
    vertical: number
} | null

export default function Preview3d({meshes, size}: Preview3dProps) {
    const horizontal = useAppSelector(state => state.rotation.horizontal)
    const vertical = useAppSelector(state => state.rotation.vertical)
    const zoom = useAppSelector(state => state.rotation.zoom)

    const scene = new t.Scene()
    scene.background = new t.Color(colors.background)
    const camera = new t.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 2000)
    let viewRadius = -1

    const [startDragState, setStartDragState] = useState<StartDragState>(null)
    const onStartDrag: React.MouseEventHandler = e => {
        if (e.button === 0) {
            const position: Vector = [e.clientX, e.clientY]
            setStartDragState({position, horizontal, vertical})
            console.log('start drag', e)
        }
    }
    const onDrag: React.MouseEventHandler = e => {
        if (e.button !== 0) {
            setStartDragState(null)
        }

        if (viewRadius > 0 && startDragState !== null) {
            const delta = g.sub([e.clientX, e.clientY], startDragState.position)
            const fractionOfViewDistX = g.X(delta) / size.width
            const angleX = viewDistToRotationDelta(fractionOfViewDistX, camera.position.z, viewRadius)
            const fractionOfViewDistY = g.Y(delta) / size.width
            const angleY = viewDistToRotationDelta(fractionOfViewDistY, camera.position.z, viewRadius)
            dispatch(setRotations([
                -10 * angleX + startDragState.horizontal,
                -10 * angleY + startDragState.vertical,
            ]))
        }
    }
    const onStopDrag: React.MouseEventHandler = e => {
        setStartDragState(null)
    }
    const onMouseWheel: React.WheelEventHandler = e => {
        if (e.deltaY < 0) {
            dispatch(zoomIn())
        } else if (e.deltaY > 0) {
            dispatch(zoomOut())
        }
    } 

    if (meshes) {
        const {group, radius} = setupGeometry(meshes)
        scene.add(group)
        const camDistance = radius / Math.tan(t.MathUtils.degToRad(CAMERA_FOV) / 2) * zoom
        camera.position.set(0, 0, camDistance)
        group.rotation.y = g.rad(horizontal)
        group.rotation.x = g.rad(vertical)
        viewRadius = radius
    }

    // hook up three
    const viewRef = useRef<HTMLDivElement>(null)
    const [renderer] = useState(() => new t.WebGLRenderer())
    useEffect(() => {
        viewRef.current?.appendChild(renderer.domElement)
        renderer.render(scene, camera)
        renderer.setSize(size.width, size.height)
        return () => {viewRef.current?.removeChild(renderer.domElement)}
    }, [renderer])
    useEffect(() => {
        renderer.render(scene, camera)
        renderer.setSize(size.width, size.height)
    })

    return <div ref={viewRef}
                onMouseDown={onStartDrag}
                onMouseMove={onDrag}
                onMouseUp={onStopDrag}
                onMouseLeave={onStopDrag}
                onWheel={onMouseWheel}
    />
}
