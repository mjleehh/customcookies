import React, {useRef, useState} from 'react'
import {useAppDispatch, useAppSelector} from '../state/hooks'
import {contextBackground} from '../style/colors'
import zOrder from './zOrder'
import {Button, InputNumber} from 'antd'
import geometry, {
    DEPTH_STEP,
    MAX_DEPTH,
    MAX_TESSELLATION,
    MAX_THICKNESS,
    MIN_DEPTH, MIN_TESSELLATION,
    MIN_THICKNESS, TESSELLATION_STEP, THICKNESS_STEP, updateAllGeometry, updateParameters,
} from '../state/geometry'
import {hideParameterBox} from '../state/ui'

const inputsStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: '[labels] 6em [inputs] auto',
}

export default function ParameterBox() {
    const dispatch = useAppDispatch()
    const position = useAppSelector(state => state.ui.parameterBoxPosition)
    const parameters = useAppSelector(({geometry: {selectionIndex, parameters}}) => {
        if (selectionIndex < 0 || !parameters) {
            return null
        }
        return parameters[selectionIndex]
    })
    if (!position || !parameters) {
        return <></>
    }

    function onClose() {
        dispatch(hideParameterBox())
    }

    function onThicknessChange(thickness: number) {
        dispatch(updateParameters({thickness, depth, tessellation}))
    }

    function onDepthChange(depth: number) {
        dispatch(updateParameters({thickness, depth, tessellation}))
    }

    function onTesselationChange(tessellation: number) {
        dispatch(updateParameters({thickness, depth, tessellation}))
    }

    const style: React.CSSProperties = {
        display: 'inline-block',
        position: 'absolute',
        padding: '10px',
        left: position[0],
        top: position[1],
        background: contextBackground,
        zIndex: zOrder.context,
    }
    const {thickness, depth, tessellation} = parameters
    return <div style={style}>
        <div style={inputsStyle}>
            <label>thickness d</label>
            <InputNumber value={thickness} onChange={onThicknessChange}
                         step={THICKNESS_STEP} min={MIN_THICKNESS} max={MAX_THICKNESS}/>
            <label>depth n</label>
            <InputNumber value={depth} onChange={onDepthChange}
                         step={DEPTH_STEP} min={MIN_DEPTH} max={MAX_DEPTH}/>
            <label>tesselation</label>
            <InputNumber value={tessellation} onChange={onTesselationChange}
                         step={TESSELLATION_STEP} min={MIN_TESSELLATION} max={MAX_TESSELLATION}/>
        </div>
        <Button onClick={onClose}>Close</Button>
    </div>
}