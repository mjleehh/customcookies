import React, {useRef, useState} from 'react'
import Renderer from './Renderer'
import tesselatingBrushCreator from './TesselatingBrush'
import {feedCommand, startPath} from './parse_paths'
import {Mesh, Path} from './types'
import {Simulate} from 'react-dom/test-utils'
import {toInteger} from 'lodash'
import {Button, InputNumber} from 'antd'
import {generateMesh, offset, Side} from './generateMesh'
import serializeObj from './serializeObj'
import FileSaver from 'file-saver'
import Preview from './Preview'
import input = Simulate.input

//const cmds = "M 0   0.123 L 100 55 L 100 100 z"
const defaultCmds = 'm 30 100 c 30 200 130 200 130 100 l 200 50 l 150 50 z'


type AppState = {
    paths: Path[]
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
            const [brush, tail] = startPath(cmds, tesselatingBrushCreator(tesellation))
            let rest = tail
            while (rest.length) {
                rest = feedCommand(brush, rest)
            }
            brush.finalize()
            const {path} = brush
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

    const [state, updateState] = useState<AppState>({paths: [], mesh: null})

    return <main className="app">
        <div className="banner">Cookie Customizer</div>
        <div className="views">
            <Renderer paths={state.paths}/>
            <Preview mesh={state.mesh}/>
        </div>
        <div className="inputs">
            <div><label>path</label><input defaultValue={defaultCmds} ref={cmdsInput}/></div>
            <div><label>tesselation n</label><InputNumber  defaultValue={10} min={1} ref={tesellationInput}/></div>
            <div><label>thickness d</label><InputNumber defaultValue={10} min={1} max={20} ref={thicknessInput}/></div>
            <div><Button onClick={onUpdate}>update</Button></div>
            <div><Button onClick={onSave} disabled={!state.mesh}>save</Button></div>
        </div>
    </main>
}