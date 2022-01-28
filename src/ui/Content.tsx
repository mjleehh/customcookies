import React, {useRef, useState} from 'react'
import Preview2d from './paths/Preview2d'
import {Mesh} from 'src/geometry/types'
import {Button, InputNumber, Space, Switch} from 'antd'
import serialize_obj from 'src/processing/serializeToObj'
import FileSaver from 'file-saver'
import Preview3d from './Preview3d'
import 'src/state/geometry'
import {useAppSelector} from 'src/state/hooks'
import {resetGeometry, updateAllGeometry} from 'src/state/geometry'
import {dispatch} from 'src/state/store'
import PathView from './paths/PathView'
import {ThreeCacheProvider} from './ThreeCache'
import PathEditor from './paths/PathEditor'
import ParameterBox from './ParameterBox'
import {DeleteOutlined, SaveOutlined} from '@ant-design/icons'

const inputStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'end'
}

export default function Content() {
    const meshes = useAppSelector<Mesh[] | null>(state => state.geometry.meshes)
    const showTesselatedPaths = useAppSelector<boolean>(state => state.view2d.showTessellatedPaths)
    const onReset = () => {dispatch(resetGeometry())}

    const onSave = () => {
        if (!meshes) {
            return
        }
        const fileContents = serialize_obj(meshes)
        FileSaver.saveAs(new Blob([fileContents], {type: "text/plain;charset=utf-8"}), 'cookiecutter.obj')
    }

    const pathView = showTesselatedPaths
        ? <Preview2d size={{width: 300, height: 300}}/>
        : <PathView size={{width: 300, height: 300}}/>

    return <main>
        <ParameterBox/>
        <div className="views">
            <PathEditor size={{width: 300, height: 300}}>{pathView}</PathEditor>
            <ThreeCacheProvider meshes={meshes}>
                <Preview3d size={{width: 300, height: 300}}/>
            </ThreeCacheProvider>
        </div>
        <div style={inputStyle}>
        <Space align={'end'}>
            <Button onClick={onSave} icon={<SaveOutlined/>} disabled={!meshes}>save</Button>
            <Button danger onClick={onReset} icon={<DeleteOutlined/>}>Clear</Button>
        </Space>
        </div>
    </main>
}