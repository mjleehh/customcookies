import React, {useEffect, useRef} from 'react'
import {Path} from './types'

function drawTesselated({data, isClosed}: Path,p: CanvasRenderingContext2D) {
    p.beginPath()
    const [x0, y0] = data[0]
    p.moveTo(x0, y0)
    for (let vertex of data.slice(1)) {
        const [x, y] = vertex
        p.lineTo(x, y)
    }
    if (isClosed) {
        p.lineTo(x0, y0)
    }
    p.stroke()
}

export default function Renderer({paths}: {paths: Path[]}) {
    const canvas = useRef<HTMLCanvasElement>(null)

    useEffect(() => {
        // make sure canvas updates properly
        const context = canvas.current?.getContext('2d')
        if (!context) {
            return
        }
        context.resetTransform()
        context.clearRect(0, 0, 300, 300)

        for (let path of paths) {
            drawTesselated(path, context)
        }
    })

    return <canvas ref={canvas} width={300} height={300}/>
}
