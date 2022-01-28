import React from 'react'
import * as colors from 'src/style/colors'
import Content from './Content'
import UploadSvg from './UploadSvg'
import {useAppSelector} from 'src/state/hooks'
import {Button, Dropdown, Space} from 'antd'
import Options from './Options'
import {MenuOutlined} from '@ant-design/icons'

const appStyle: React.CSSProperties = {
    display: 'block',
    width: '640px',
    margin: '20px',
    background: colors.background,
}

const bannerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontFamily: 'Arial, sans-serif',
    color: colors.bannerText,
    background: colors.banner,
    fontSize: '30px',
    width: '100%',
    padding: '10px'
}

const mainStyle: React.CSSProperties = {
    height: '100%',
    padding: '12px',
}

const footerStyle: React.CSSProperties = {
    height: '10px',
    background: colors.banner,
}

export default function App() {
    const pathDescriptions = useAppSelector(state => state.geometry.svgPaths)
    const tab = pathDescriptions ? <Content/> : <UploadSvg/>

    const menu=<div>foo</div>

    return <div style={appStyle}>
        <header style={bannerStyle}>
            <Dropdown overlay={<Options/>}><MenuOutlined/></Dropdown>
            <div>COOKIE CUSTOMIZER</div>
            <div> </div>
        </header>
        <main style={mainStyle}>{tab}</main>
        <footer style={footerStyle}/>
    </div>
}
