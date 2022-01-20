import React from 'react'
import ReactDOM from 'react-dom'
import App from 'src/ui/App'

import 'antd/dist/antd.css'
import {Provider} from 'react-redux'
import store from 'src/state/store'
import 'src/keybindings'
import 'src/style/index.css'


ReactDOM.render(
    <Provider store={store}><App/></Provider>,
    document.getElementById('app-root'))
