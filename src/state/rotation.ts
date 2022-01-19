import {createSlice} from '@reduxjs/toolkit'

interface RotationState {
    horizontal: number
    vertical: number
    zoom: number
}

const initialState = {
    horizontal: 0,
    vertical: 0,
    zoom: 1,
} as RotationState

const ROTATION_STEP = 5
const ZOOM_FACTOR = 1.2

const rotationSlice = createSlice({
    name: 'rotation',
    initialState,
    reducers: {
        'rotateLeft': state => {state.horizontal = state.horizontal = (state.horizontal + ROTATION_STEP) % 360},
        'rotateRight': state => {state.horizontal = (state.horizontal - ROTATION_STEP) % 360},
        'rotateUp': state => {state.vertical = (state.vertical + ROTATION_STEP) % 360},
        'rotateDown': state => {state.vertical = (state.vertical - ROTATION_STEP) % 360},
        'zoomIn': state => {state.zoom *= ZOOM_FACTOR},
        'zoomOut': state => {state.zoom /= ZOOM_FACTOR},
    }
})

export const {rotateLeft, rotateRight, rotateUp, rotateDown, zoomIn, zoomOut} = rotationSlice.actions
export default rotationSlice.reducer