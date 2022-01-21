import React, {useRef, useState} from 'react'
import Preview2d from './Preview2d'
import {Mesh, Path} from 'src/geometry/types'
import {Button, InputNumber, Switch} from 'antd'
import serialize_obj from 'src/processing/serializeToObj'
import FileSaver from 'file-saver'
import Preview3d from './Preview3d'
import PathPainter from 'src/processing/PathPainter'
import {generateMesh, offset, Side} from 'src/processing/generateMesh'
import * as colors from 'src/style/colors'
import 'src/state/geometry'
import {toInteger} from 'lodash'
import {useAppSelector} from 'src/state/hooks'
import {OffsetPath, resetGeometry, updateGeometry} from 'src/state/geometry'
import {dispatch} from 'src/state/store'
import {SvgPath} from '../processing/svg/types'
import PathView from './PathView'

const AppStyle = {
    display: 'inline-block',
    padding: '12px',
    margin: '20px',
    background: colors.background,
}

export default function Main() {
    const svgPaths = useAppSelector<SvgPath[] | null>(state => state.geometry.svgPaths)
    const meshes = useAppSelector<Mesh[] | null>(state => state.geometry.meshes)

    const onReset = () => {dispatch(resetGeometry())}

    const onUpdate = () => {
        const tessellation = toInteger(tessellationInput?.current?.value)
        if (!tessellation) {
            return
        }

        const thickness = toInteger(thicknessInput?.current?.value)
        if (!thickness) {
            return
        }

        dispatch(updateGeometry({tessellation, thickness}))
    }

    const onSave = () => {
        if (!meshes) {
            return
        }
        const fileContents = serialize_obj(meshes)
        FileSaver.saveAs(new Blob([fileContents], {type: "text/plain;charset=utf-8"}), 'cookiecutter.obj')
    }

    const thicknessInput = useRef<HTMLInputElement>(null)
    const tessellationInput = useRef<HTMLInputElement>(null)

    const [showOffsets, updateShowOffsets] = useState(false)
    const [showTessellated, updateShowTessellated] = useState(true)

    const pathView = showTessellated
        ?  <Preview2d size={{width: 300, height: 300}} showOffsets={showOffsets}/>
        : <PathView size={{width: 300, height: 300}}/>

    return <main>
        <div className="banner">Cookie Customizer</div>
        <div className="views">
            {pathView}
            <Preview3d meshes={meshes} size={{width: 300, height: 300}}/>
        </div>
        <div className="inputStyle">
            {/*<div><label>path</label><input defaultValue={defaultCmds} ref={cmdsInput}/></div>*/}
            <div><label>tessellation n</label><InputNumber  defaultValue={10} min={1} ref={tessellationInput}/></div>
            <div><label>thickness d</label><InputNumber defaultValue={2} min={1} max={20} ref={thicknessInput}/></div>
            <div><label>show offset</label><Switch onChange={updateShowOffsets}/></div>
            <div><label>show tesselated</label><Switch onChange={updateShowTessellated}/></div>
            <Button onClick={onUpdate}>update</Button>
            <Button onClick={onSave} disabled={!meshes}>save</Button>
            <Button onClick={onReset}>reset</Button>
        </div>
    </main>
}