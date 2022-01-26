import React, {useEffect, useRef, useState} from 'react'
import {Box, Size} from 'src/geometry/types'
import setViewWindow from './setViewWindow'
import CanvasPathBrush from '../../processing/CanvasPathBrush'
import PathPainter from '../../processing/PathPainter'
import paintSvgPath from '../../processing/svg/paintSvgPath'
import {useAppDispatch, useAppSelector} from '../../state/hooks'
import {SvgPath} from '../../processing/svg/types'
import {View2dState} from '../../state/view2d'
import {useDispatch} from 'react-redux'
import {setSelection} from '../../state/parameters'

function indexToRgb(index: number) {
    if (index < 0 || index > 255) {
        throw `invalid hit map index ${index}`
    }
    return `rgb(${index}, 50, 50)`
}

function rgbToIndex(rgba: Uint8ClampedArray) {
    const [r, , , a] = rgba
    if (a < 255) {
        return -1
    }
    return r
}


interface PathEditorProps {
    size: Size
}

export default function PathEditor({size, children}: React.PropsWithChildren<PathEditorProps>) {
    const paths = useAppSelector<SvgPath[] | null>(state => state.geometry.svgPaths)
    const boundingBox = useAppSelector<Box | null>(state => state.geometry.boundingBox)
    const view = useAppSelector<View2dState>(state => state.view2d)
    const dispatch = useAppDispatch()

    const [offscreenCanvas] = useState<HTMLCanvasElement>(() => {
        const canvas = document.createElement('canvas')
        canvas.width = size.width
        canvas.height = size.height
        return canvas
    })

    useEffect(() => {
        return () => {if (offscreenCanvas) {document.removeChild(offscreenCanvas)}}
    }, [])
    useEffect(() => {
        // make sure canvas updates properly
        const context = offscreenCanvas.getContext('2d')
        if (!context) {
            return
        }

        if (boundingBox) {
            setViewWindow(context, size, boundingBox, view)
        }

        if (paths) {
            // very important: no antialiasing
            context.imageSmoothingEnabled = false
            const tessellatingBrush = new CanvasPathBrush(context)
            const painter = new PathPainter(tessellatingBrush)

            context.lineWidth = context.lineWidth * 10
            for (let i = 0; i < paths.length; ++i) {
                context.strokeStyle = indexToRgb(i)
                paintSvgPath(painter, paths[i])
            }
        }
    })

    const onClick: React.MouseEventHandler = (e) => {
        const {left, top} = e.currentTarget.getBoundingClientRect()
        const {pageX, pageY} = e
        const x = pageX - left
        const y = pageY - top
        const context = offscreenCanvas.getContext('2d')
        if (!context) {
            return
        }
        const {data} = context.getImageData(x, y, 1, 1)
        dispatch(setSelection(rgbToIndex(data)))
    }

    const style: React.CSSProperties = {
        zIndex: 20,
        position: 'absolute',
        left: 0,
        top: 0,
        ...size,
    }
    return <div style={{position: 'relative'}}>
        <div onClick={onClick} style={style}/>
        {children}
    </div>
}