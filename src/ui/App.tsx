import React from 'react'
import * as colors from 'src/style/colors'
import Main from './Main'
import UploadSvg from './UploadSvg'
import {useAppSelector} from 'src/state/hooks'

const AppStyle = {
    display: 'inline-block',
    padding: '12px',
    margin: '20px',
    background: colors.background,
}

export default function App() {
    const pathDescriptions = useAppSelector(state => state.geometry.svgPaths)
    const tab = pathDescriptions ? <Main/> : <UploadSvg/>

    return <div style={AppStyle}>{tab}</div>
}
