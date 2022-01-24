import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface View2dState {
    translateX: number
    translateY: number
    zoom: number
}

const initialState: View2dState = {
    translateX: 0,
    translateY: 0,
    zoom: 1,
}

const TRANSLATION_STEP = 5
const ZOOM_FACTOR = 1.2

const view2dSlice = createSlice({
    name: 'view2d',
    initialState,
    reducers: {
        'moveLeft': state => {state.translateX += TRANSLATION_STEP},
        'moveRight': state => {state.translateX -= TRANSLATION_STEP},
        'moveUp': state => {state.translateY += TRANSLATION_STEP},
        'moveDown': state => {state.translateY -= TRANSLATION_STEP},
        'enlarge': state => {state.zoom *= ZOOM_FACTOR},
        'shrink': state => {state.zoom /= ZOOM_FACTOR},
    }
})

export const {moveLeft, moveRight, moveUp, moveDown, enlarge, shrink} = view2dSlice.actions
export default view2dSlice.reducer