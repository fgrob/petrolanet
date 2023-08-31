import { useState } from 'react'
import NavBar from './components/NavBar'
import SideBar from './components/SideBar'
import Home from './views/Home'

function App() {

  return (
    <>
      <NavBar />
      <SideBar />
      <Home />
    </>
  )
}

export default App
