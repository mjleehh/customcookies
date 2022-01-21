import {createSlice, PayloadAction} from '@reduxjs/toolkit'

interface View3dState {
    horizontal: number
    vertical: number
    zoom: number
}

const initialState: View3dState = {
    horizontal: 0,
    vertical: 0,
    zoom: 1,
}

const ROTATION_STEP = 5
const ZOOM_FACTOR = 1.2

const view3dSlice = createSlice({
    name: 'view3d',
    initialState,
    reducers: {
        'rotateLeft': state => {state.horizontal = state.horizontal = (state.horizontal + ROTATION_STEP) % 360},
        'rotateRight': state => {state.horizontal = (state.horizontal - ROTATION_STEP) % 360},
        'setRotations': (state, {payload}: PayloadAction<[number, number]>) => {
            const [angleX, angleY] = payload
            state.horizontal = angleX % 360
            state.vertical = angleY % 360
        },
        'rotateUp': state => {state.vertical = (state.vertical + ROTATION_STEP) % 360},
        'rotateDown': state => {state.vertical = (state.vertical - ROTATION_STEP) % 360},
        'zoomIn': state => {state.zoom *= ZOOM_FACTOR},
        'zoomOut': state => {state.zoom /= ZOOM_FACTOR},
    }
})

export const {rotateLeft, rotateRight, setRotations, rotateUp, rotateDown, zoomIn, zoomOut} = view3dSlice.actions
export default view3dSlice.reducer