import React, {useRef, useState} from 'react'
import Preview2d from './paths/Preview2d'
import {Mesh} from 'src/geometry/types'
import {Button, InputNumber, Switch} from 'antd'
import serialize_obj from 'src/processing/serializeToObj'
import FileSaver from 'file-saver'
import Preview3d from './Preview3d'
import 'src/state/geometry'
import {toInteger} from 'lodash'
import {useAppSelector} from 'src/state/hooks'
import {resetGeometry, updateGeometry} from 'src/state/geometry'
import {dispatch} from 'src/state/store'
import PathView from './paths/PathView'
import {ThreeCacheProvider} from './ThreeCache'
import PathEditor from './paths/PathEditor'



export default function Main() {
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
        ? <Preview2d size={{width: 300, height: 300}} showOffsets={showOffsets}/>
        : <PathView size={{width: 300, height: 300}}/>

    return <main>
        <div className="banner">Cookie Customizer</div>
        <div className="views">
            <PathEditor size={{width: 300, height: 300}}>{pathView}</PathEditor>
            <ThreeCacheProvider meshes={meshes}>
                <Preview3d size={{width: 300, height: 300}}/>
            </ThreeCacheProvider>
            {/*<Preview3d meshes={meshes} size={{width: 300, height: 300}}/>*/}
        </div>
        <div className="inputStyle">
            <div><label>tessellation n</label><InputNumber  defaultValue={10} min={1} ref={tessellationInput}/></div>
            <div><label>thickness d</label><InputNumber defaultValue={2} min={1} max={20} ref={thicknessInput}/></div>
            <div><label>show offset</label><Switch onChange={updateShowOffsets}/></div>
            <div><label>show tessellated</label><Switch defaultChecked={showTessellated} onChange={updateShowTessellated}/></div>
            <Button onClick={onUpdate}>update</Button>
            <Button onClick={onSave} disabled={!meshes}>save</Button>
            <Button onClick={onReset}>reset</Button>
        </div>
    </main>
}