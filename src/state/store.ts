import {configureStore} from '@reduxjs/toolkit'
import view3dReducer from './view3d'
import view2dReducer from './view2d'
import pathsReducer from './geometry'

const store = configureStore({
    reducer: {
        'view3d': view3dReducer,
        'geometry': pathsReducer,
        'view2d': view2dReducer,
    },
    devTools: true
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export const dispatch = store.dispatch

export default store
