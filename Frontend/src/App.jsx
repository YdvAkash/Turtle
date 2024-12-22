import React from 'react'
import {BrowserRouter, Routes ,Route} from 'react-router-dom'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='' element={<Layout/>}>
       <Route path='' element={<Home/>}/>
       <Route path='' element={<Home/>}/>
       <Route path='' element={<Home/>}/>
       <Route path='' element={<Home/>}/>
      </Route>
    </Routes>

    </BrowserRouter>
  )
}

export default App