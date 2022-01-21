import * as m from 'mousetrap'
import {rotateLeft, rotateRight, rotateUp, rotateDown, zoomIn, zoomOut} from 'src/state/view3d'
import {dispatch} from './state/store'

m.bind('left', e => {
    e.preventDefault()
    dispatch(rotateLeft())
})
m.bind('right', e => {
    e.preventDefault()
    dispatch(rotateRight())
})
m.bind('up', e => {
    e.preventDefault()
    dispatch(rotateUp())
})
m.bind('down', e => {
    e.preventDefault()
    dispatch(rotateDown())
})
m.bind('+', e => {
    e.preventDefault()
    dispatch(zoomIn())
})
m.bind('-', e => {
    e.preventDefault()
    dispatch(zoomOut())
})