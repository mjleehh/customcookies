import React, {useRef, useState} from 'react'
import Preview2d from './Preview2d'
import TesselatingPathBrush from 'src/processing/TesselatingPathBrush'
import paintSvgPath from 'src/processing/svg/paintSvgPath'
import {Mesh, Path} from 'src/geometry/types'
import {Button, InputNumber, Switch} from 'antd'
import serialize_obj from 'src/processing/serializeToObj'
import FileSaver from 'file-saver'
import Preview3d from './Preview3d'
import PathPainter from 'src/processing/PathPainter'
import {generateMesh, offset, Side} from 'src/generateMesh'
import * as colors from 'src/style/colors'
import 'src/state/geometry'
import {toInteger} from 'lodash'
import {useAppSelector} from 'src/state/hooks'
import {OffsetPath, resetGeometry, setGeometry} from 'src/state/geometry'
import {dispatch} from 'src/state/store'
import {SvgPath} from '../processing/svg/types'

const AppStyle = {
    display: 'inline-block',
    padding: '12px',
    margin: '20px',
    background: colors.background,
}

export default function Main() {
    const svgPaths = useAppSelector<SvgPath[] | null>(state => state.geometry.svgPaths)
    const meshes = useAppSelector<Mesh[] | null>(state => state.geometry.meshes)
    const paths = useAppSelector<OffsetPath[] | null>(state => state.geometry.paths)

    const onReset = () => {dispatch(resetGeometry())}

    const onUpdate = () => {
        if (!svgPaths) {
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
            const tesselatingBrush = new TesselatingPathBrush(tesellation)
            const painter = new PathPainter(tesselatingBrush)

            let meshes = [] as Mesh[]
            let paths = [] as OffsetPath[]
            for (let pathDescription of svgPaths) {
                paintSvgPath(painter, pathDescription)
                const {segments} = tesselatingBrush
                for (let segment of segments) {
                    const offsetPath = {
                        profile: segment,
                        right: offset(segment, thickness, Side.right),
                        left: offset(segment, thickness, Side.left)
                    }
                    paths.push(offsetPath)
                    meshes.push(generateMesh(offsetPath, 10))
                }
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