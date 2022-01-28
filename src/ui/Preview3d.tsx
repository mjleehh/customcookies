import React, {useEffect, useRef, useState} from 'react'
import {Size, Vector} from 'src/geometry/types'
import {ThreeCacheContext} from './ThreeCache'
import {useAppSelector} from '../state/hooks'
import {
    calculateInitialCamDistance, highlightSelected,
    newThreeCamera,
    newThreeScene,
    viewDistToRotationDelta
} from '../state/three_geometry'
import {dispatch} from '../state/store'
import {setRotations, zoomIn, zoomOut} from '../state/view3d'
import * as t from 'three'
import * as g from 'src/geometry/operations'

type StartDragState = {
    position: Vector
    horizontal: number
    vertical: number
} | null

type Preview3dProps = {
    size: Size
}

export default function Preview3d({size}: Preview3dProps) {
    const horizontal = useAppSelector(state => state.view3d.horizontal)
    const vertical = useAppSelector(state => state.view3d.vertical)
    const zoom = useAppSelector(state => state.view3d.zoom)
    const selectionIndex = useAppSelector(state => state.geometry.selectionIndex)
    const geometry = React.useContext(ThreeCacheContext)

    const camera = newThreeCamera()
    const scene = newThreeScene()

    const [startDragState, setStartDragState] = useState<StartDragState>(null)
    const onStartDrag: React.MouseEventHandler = e => {
        if (e.button === 0) {
            const position: Vector = [e.clientX, e.clientY]
            setStartDragState({position, horizontal, vertical})
        }
    }
    const onDrag: React.MouseEventHandler = e => {
        if (e.button !== 0) {
            setStartDragState(null)
        }

        if (geometry && startDragState !== null) {
            const {radius} = geometry
            const delta = g.sub([e.clientX, e.clientY], startDragState.position)
            const fractionOfViewDistX = g.X(delta) / size.width
            const angleX = viewDistToRotationDelta(fractionOfViewDistX, camera.position.z, radius)
            const fractionOfViewDistY = g.Y(delta) / size.width
            const angleY = viewDistToRotationDelta(fractionOfViewDistY, camera.position.z, radius)
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

    if (geometry) {
        highlightSelected(geometry.group, selectionIndex)
        const {radius} = geometry
        const transformGroup = new t.Group()
        transformGroup.add(geometry.group)
        const camDistance = calculateInitialCamDistance(radius) * zoom
        camera.position.set(0, 0, camDistance)
        transformGroup.rotation.y = g.rad(horizontal)
        transformGroup.rotation.x = g.rad(vertical)
        scene.add(transformGroup)
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
