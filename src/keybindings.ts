import * as m from 'mousetrap'
import {rotateLeft, rotateRight, rotateUp, rotateDown, zoomIn, zoomOut} from 'src/state/view3d'
import {dispatch} from 'src/state/store'
import {enlarge, moveDown, moveLeft, moveRight, moveUp, shrink} from 'src/state/view2d'

// 3d view

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

// 2d view

m.bind('a', e => {
    e.preventDefault()
    dispatch(moveLeft())
})
m.bind('d', e => {
    e.preventDefault()
    dispatch(moveRight())
})
m.bind('w', e => {
    e.preventDefault()
    dispatch(moveUp())
})
m.bind('s', e => {
    e.preventDefault()
    dispatch(moveDown())
})
m.bind('q', e => {
    e.preventDefault()
    dispatch(shrink())
})
m.bind('e', e => {
    e.preventDefault()
    dispatch(enlarge())
})
