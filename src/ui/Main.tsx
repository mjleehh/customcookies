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
import {OffsetPath, resetGeometry, setGeometry} from 'src/state/geometry'
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
    const paths = useAppSelector<OffsetPath[] | null>(state => state.geometry.paths)

    const onReset = () => {dispatch(resetGeometry())}

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
            let paths = [] as OffsetPath[]
            for (let pathDescription of pathDescriptions) {
                parsePath(pathDescription, painter)
                const {path} = tesselatingBrush
                const offsetPath = {
                    profile: path,
                    right: offset(path, thickness, Side.right),
                    left: offset(path, thickness, Side.left)
                }
                paths.push(offsetPath)
                meshes.push(generateMesh(offsetPath, 10))
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

    const [showOffsets, updateShowOffsets] = useState(false)

    return <main>
        <div className="banner">Cookie Customizer</div>
        <div className="views">
            <Preview2d paths={paths} size={{width: 300, height: 300}} showOffsets={showOffsets}/>
            <Preview3d meshes={meshes} size={{width: 300, height: 300}}/>
        </div>
        <div className="inputStyle">
            {/*<div><label>path</label><input defaultValue={defaultCmds} ref={cmdsInput}/></div>*/}
            <div><label>tesselation n</label><InputNumber  defaultValue={10} min={1} ref={tesellationInput}/></div>
            <div><label>thickness d</label><InputNumber defaultValue={2} min={1} max={20} ref={thicknessInput}/></div>
            <div><label>show offset</label><Switch onChange={updateShowOffsets}/></div>
            <Button onClick={onUpdate}>update</Button>
            <Button onClick={onSave} disabled={!meshes}>save</Button>
            <Button onClick={onReset}>reset</Button>
        </div>
    </main>
}