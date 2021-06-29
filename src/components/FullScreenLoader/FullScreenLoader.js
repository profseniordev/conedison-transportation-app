import React from 'react'
import { CircularProgress } from '@material-ui/core'
import './FullScreenLoader.scss'

function FullScreenLoader() {
  return (
    <div className='wrapper'>
      <CircularProgress size={60} style={{ color: '#009ada' }} />
    </div>
  )
}

export default FullScreenLoader
