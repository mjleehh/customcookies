import React, {useRef, useState} from 'react'
import Renderer from './Renderer'
import TesselatingBrush from './TesselatingBrush'
import {parsePath} from './parse_paths'
import {Mesh, Path} from './geometry/types'
import {Simulate} from 'react-dom/test-utils'
import {toInteger} from 'lodash'
import {Button, InputNumber, Switch} from 'antd'
import serializeObj from './serializeObj'
import FileSaver from 'file-saver'
import Preview from './Preview'
import input = Simulate.input
import PathPainter from './PathPainter'
import {generateMesh, offset, Side} from './generateMesh'
import * as colors from './style/colors'

const defaultCmds = 'm 6.8433272,24.792858 c 0,0 3.1714928,17.570452 9.7589998,17.647531 6.587508,0.07708 13.696621,-19.181449 15.389679,-9.959668 1.693058,9.221779 -8.27226,25.043359 4.13862,20.523337 12.410882,-4.520025 4.355238,-30.528855 12.468027,-20.675833 8.112786,9.853023 19.258526,6.858942 19.258526,6.858942'
//const defaultCmds = 'm 9.4619843,23.104784 l 10.8360987,29.89163 l 24.756645,5.588153 c 0,0 27.749394,-2.1006684 26.311492,-13.516551 c 69.928318,33.558151 25.003825,13.253423 32.271745,30.34081 39.539666,47.428197 53.201069,48.210938 53.201069,48.210938 l 50.851522,37.871857'
//const defaultCmds = 'm 30 100 c 30 200 130 200 130 100 l 200 50 l 150 50 z'

const AppStyle = {
    display: 'inline-block',
    padding: '12px',
    margin: '20px',
    background: colors.background,
}


type AppState = {
    paths: Path[] | null
    mesh: Mesh | null
}
export default function App() {
    const onUpdate = () => {
        const cmds = cmdsInput?.current?.value
        if (!cmds) {
            return
        }

        const tesellation = toInteger(tesellationInput?.current?.value)
        if (!tesellation) {
            return
        }

        const thickness = toInteger(thicknessInput?.current?.value)
        if (!thickness) {
            return
        }

        try {
            const lines = new TesselatingBrush(tesellation)
            const painter = new PathPainter(lines)
            parsePath(cmds, painter)
            const {path} = lines
            const paths = [path, offset(path, thickness, Side.right), offset(path, thickness, Side.left)]
            const mesh = generateMesh(paths[0], paths[1], paths[2], 10)
            updateState({paths, mesh})
        } catch (e) {
            console.error(e)
        }
    }

    const onSave = () => {
        if (!state.mesh) {
            return
        }
        const fileContents = serializeObj(state.mesh)
        FileSaver.saveAs(new Blob([fileContents], {type: "text/plain;charset=utf-8"}), 'cookiecutter.obj')
    }

    const cmdsInput = useRef<HTMLInputElement>(null)
    const thicknessInput = useRef<HTMLInputElement>(null)
    const tesellationInput = useRef<HTMLInputElement>(null)

    const [state, updateState] = useState<AppState>({paths: null, mesh: null})
    const [showOffset, updateShowOffset] = useState(false)

    const paths = state.paths ? (showOffset ? state.paths : [state.paths[0]]) : []

    return <main style={AppStyle}>
        <div className="banner">Cookie Customizer</div>
        <div className="views">
            <Renderer paths={paths}/>
            <Preview mesh={state.mesh}/>
        </div>
        <div className="inputStyle">
            <div><label>path</label><input defaultValue={defaultCmds} ref={cmdsInput}/></div>
            <div><label>tesselation n</label><InputNumber  defaultValue={10} min={1} ref={tesellationInput}/></div>
            <div><label>thickness d</label><InputNumber defaultValue={2} min={1} max={20} ref={thicknessInput}/></div>
            <div><label>show offset</label><Switch onChange={updateShowOffset}/></div>
            <div><Button onClick={onUpdate}>update</Button></div>
            <div><Button onClick={onSave} disabled={!state.mesh}>save</Button></div>
        </div>
    </main>
}