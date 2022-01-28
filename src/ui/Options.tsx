import {Menu, Space, Switch} from 'antd'
import React from 'react'
import {useAppDispatch, useAppSelector} from '../state/hooks'
import {updateShowPathOffsets, updateShowTessellatedPaths} from '../state/view2d'

export default function Options() {
    const showOffsets = useAppSelector<boolean>(state => state.view2d.showPathOffsets)
    const showTessellated = useAppSelector<boolean>(state => state.view2d.showTessellatedPaths)
    const dispatch = useAppDispatch()

    function updateShowOffsets(value: boolean) {
        dispatch(updateShowPathOffsets(value))
    }
    function updateShowTessellated(value: boolean) {
        dispatch(updateShowTessellatedPaths(value))
    }

    return <Menu>
        <Menu.Item key={1}>
            <Space>
                <Switch checked={showOffsets} onChange={updateShowOffsets}/>
                <label>show offset paths</label>
            </Space>
        </Menu.Item>
        <Menu.Item key={2}>
            <Space>
                <Switch checked={showTessellated} onChange={updateShowTessellated}/>
                <label>show tessellated curves</label>
            </Space>
        </Menu.Item>
    </Menu>
}
