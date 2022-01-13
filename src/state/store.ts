import {configureStore} from '@reduxjs/toolkit'
import rotationReducer from './rotation'

const store = configureStore({
    reducer: {
        'rotation': rotationReducer
    },
    devTools: true
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const dispatch = store.dispatch

export default store