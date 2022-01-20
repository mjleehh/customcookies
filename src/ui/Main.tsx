import React, {useRef, useState} from 'react'
import Preview2d from './Preview2d'
import TesselatingBrush from 'src/processing/TesselatingBrush'
import {parsePath} from 'src/processing/parse_paths'
import {Mesh, Path} from '../geometry/types'
import {Button, InputNumber, Switch} from 'antd'
import serialize_obj from 'src/processing/serialize_obj'
import FileSaver from 'file-saver'
import Preview3d from './Preview3d'
import PathPainter from 'src/processing/PathPainter'
import {generateMesh, offset, Side} from '../generateMesh'
import * as colors from 'src/style/colors'
import 'src/state/geometry'
import {toInteger} from 'lodash'
import {useAppSelector} from '../state/hooks'
import {setGeometry} from 'src/state/geometry'
import {dispatch} from '../state/store'

const AppStyle = {
    display: 'inline-block',
    padding: '12px',
    margin: '20px',
    background: colors.background,
}

export default function Main() {
    const pathDescriptions = useAppSelector<string[] | null>(state => state.geometry.pathDescriptions)
    const meshes = useAppSelector<Mesh[] | null>(state => state.geometry.meshes)
    const paths = useAppSelector<Path[] | null>(state => state.geometry.paths)

    const onUpdate = () => {
        if (!pathDescriptions) {
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
            const tesselatingBrush = new TesselatingBrush(tesellation)
            const painter = new PathPainter(tesselatingBrush)

            let meshes = [] as Mesh[]
            let paths = [] as Path[]
            for (let pathDescription in pathDescriptions) {
                parsePath(pathDescriptions[0], painter)
                const {path} = tesselatingBrush
                paths.push(path, offset(path, thickness, Side.right), offset(path, thickness, Side.left))
                meshes.push(generateMesh(paths[0], paths[1], paths[2], 10))
            }
            dispatch(setGeometry({meshes, paths}))
        } catch (e) {
            console.error(e)
        }
    }

    const onSave = () => {
        if (!meshes) {
            return
        }
        const fileContents = serialize_obj(meshes)
        FileSaver.saveAs(new Blob([fileContents], {type: "text/plain;charset=utf-8"}), 'cookiecutter.obj')
    }

    const thicknessInput = useRef<HTMLInputElement>(null)
    const tesellationInput = useRef<HTMLInputElement>(null)

    const [showOffset, updateShowOffset] = useState(false)

    const visiblePaths = paths || []

    return <main>
        <div className="banner">Cookie Customizer</div>
        <div className="views">
            <Preview2d paths={visiblePaths} size={{width: 300, height: 300}}/>
            <Preview3d meshes={meshes} size={{width: 300, height: 300}}/>
        </div>
        <div className="inputStyle">
            {/*<div><label>path</label><input defaultValue={defaultCmds} ref={cmdsInput}/></div>*/}
            <div><label>tesselation n</label><InputNumber  defaultValue={10} min={1} ref={tesellationInput}/></div>
            <div><label>thickness d</label><InputNumber defaultValue={2} min={1} max={20} ref={thicknessInput}/></div>
            <div><label>show offset</label><Switch onChange={updateShowOffset}/></div>
            <div><Button onClick={onUpdate}>update</Button></div>
            <div><Button onClick={onSave} disabled={!meshes}>save</Button></div>
        </div>
    </main>
}