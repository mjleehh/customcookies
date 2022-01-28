import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {Vector} from 'src/geometry/types'

export interface UiState {
    parameterBoxPosition: Vector | null

}

const initialState: UiState = {
    parameterBoxPosition: null,
}

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        'showParameterBox': (state, {payload}: PayloadAction<Vector>) => {state.parameterBoxPosition = payload},
        'hideParameterBox': (state) => {state.parameterBoxPosition = null}
    }
})

export const {showParameterBox, hideParameterBox} = uiSlice.actions
export default uiSlice.reducer