import React from 'react'
import ReactDOM from 'react-dom/client'
import './main.scss'
import 'flowbite'
import { Context } from './Context'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Context />
  </React.StrictMode>,
)
