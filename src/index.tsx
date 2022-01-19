import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import 'antd/dist/antd.css'
import {Provider} from 'react-redux'
import store from './state/store'
import './keybindings'
import './style/index.css'


ReactDOM.render(
    <Provider store={store}><App/></Provider>,
    document.getElementById('app-root'))
