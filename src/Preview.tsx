import React, {useState} from 'react'
import * as t from 'three'
import {useEffect, useRef} from 'react'
import {Mesh} from './types'
import _ from 'lodash'
import {useAppSelector} from './state/hooks'

export default function Preview({mesh}: {mesh: Mesh | null}) {
    const horizontal = useAppSelector(state => state.rotation.horizontal)
    const vertical = useAppSelector(state => state.rotation.vertical)
    const zoom = useAppSelector(state => state.rotation.zoom)

    const viewRef = useRef<HTMLDivElement>(null)

    // hook up three
    const [renderer] = useState(() => new t.WebGLRenderer())
    useEffect(() => {
        viewRef.current?.appendChild(renderer.domElement)
        return () => {viewRef.current?.removeChild(renderer.domElement)}
    }, [renderer])
    useEffect(() => {
        renderer.render(scene, camera)
        renderer.setSize(300, 300)
    })

    const scene = new t.Scene()
    const camera = new t.PerspectiveCamera(20, 1, 0.1, 2000)
    const light = new t.DirectionalLight(0xffffff, 1.0)
    scene.add(light)
    light.position.set(0, 0, 1)
    camera.position.z = zoom

    let solid = null as t.Mesh | null
    if (mesh) {
        const geometry = new t.BufferGeometry()
        geometry.setIndex(_.flatten(mesh.faces))
        geometry.setAttribute( 'position', new t.Float32BufferAttribute(_.flatten(mesh.vertices), 3 ) )
        geometry.center()
        const solidMaterial = new t.MeshBasicMaterial({color: 0x00ff00, wireframe: false, side: t.FrontSide})
        solid = new t.Mesh(geometry, solidMaterial)
        const wireframeMaterial = new t.MeshBasicMaterial({color: 0xff0000, wireframe: true})
        const wireframe = new t.Mesh(geometry, wireframeMaterial)

        const group = new t.Group()
        group.add(solid)
        group.add(wireframe)
        group.rotation.y = horizontal / 180 * Math.PI
        group.rotation.x = vertical / 180 * Math.PI
        scene.add(group)
    }
    return <div ref={viewRef}/>
}
