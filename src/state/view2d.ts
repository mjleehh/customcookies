import {createSlice, PayloadAction} from '@reduxjs/toolkit'

export interface View2dState {
    translateX: number
    translateY: number
    zoom: number
    showPathOffsets: boolean
    showTessellatedPaths: boolean
}

const initialState: View2dState = {
    translateX: 0,
    translateY: 0,
    zoom: 1,
    showPathOffsets: false,
    showTessellatedPaths: true,
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
        'updateShowPathOffsets': (state, {payload}: PayloadAction<boolean>) => {state.showPathOffsets = payload},
        'updateShowTessellatedPaths': (state, {payload}: PayloadAction<boolean>) => {state.showTessellatedPaths = payload},
    }
})

export const {moveLeft, moveRight, moveUp, moveDown, enlarge, shrink, updateShowPathOffsets, updateShowTessellatedPaths} = view2dSlice.actions
export default view2dSlice.reducer