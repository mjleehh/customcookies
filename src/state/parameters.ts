import {createSlice} from '@reduxjs/toolkit'

export interface ParameterState {
    selectionIndex: number
}

const initialState: ParameterState = {
    selectionIndex: -1
}

const parameterSlice = createSlice({
    name: 'parameters',
    initialState,
    reducers: {
        'setSelection': (state, {payload}) => {state.selectionIndex = payload},
    }
})

export const {setSelection} = parameterSlice.actions
export default parameterSlice.reducer