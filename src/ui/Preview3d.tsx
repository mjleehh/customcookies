import React, {useState} from 'react'
import * as t from 'three'
import {useEffect, useRef} from 'react'
import {Mesh, Size} from '../geometry/types'
import _ from 'lodash'
import {useAppSelector} from '../state/hooks'
import * as colors from '../style/colors'

const CAMERA_FOV = 50

type Preview3dProps = {
    meshes: Mesh[] | null
    size: Size
}

export default function Preview3d({meshes, size}: Preview3dProps) {
    const horizontal = useAppSelector(state => state.rotation.horizontal)
    const vertical = useAppSelector(state => state.rotation.vertical)
    const zoom = useAppSelector(state => state.rotation.zoom)

    const viewRef = useRef<HTMLDivElement>(null)
    const scene = new t.Scene()
    scene.background = new t.Color(colors.background)
    const camera = new t.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 2000)
    const light = new t.DirectionalLight(0xffffff, 1.0)
    camera.position.z = 0

    let solid = null as t.Mesh | null

    // FIXME: can only display one path in 3D
    if (meshes) {
        const mesh = meshes[0]
        const geometry = new t.BufferGeometry()
        geometry.setIndex(_.flatten(mesh.faces))
        geometry.setAttribute( 'position', new t.Float32BufferAttribute(_.flatten(mesh.vertices), 3 ) )
        geometry.center()
        geometry.computeBoundingSphere()
        const {radius} = geometry.boundingSphere as  t.Sphere
        const camDistance = radius / Math.tan(t.MathUtils.degToRad(CAMERA_FOV) / 2) * zoom
        camera.position.set(0, 0, camDistance)
        const solidMaterial = new t.MeshBasicMaterial({color: colors.surface, wireframe: false, side: t.FrontSide})
        solid = new t.Mesh(geometry, solidMaterial)
        const wireframeMaterial = new t.MeshBasicMaterial({color: colors.wireframe, wireframe: true})
        const wireframe = new t.Mesh(geometry, wireframeMaterial)

        const group = new t.Group()
        group.add(solid)
        group.add(wireframe)
        group.rotation.y = horizontal / 180 * Math.PI
        group.rotation.x = vertical / 180 * Math.PI
        scene.add(group)
    }

    // hook up three
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

    return <div ref={viewRef}/>
}
