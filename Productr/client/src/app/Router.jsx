import React, { useContext } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from '../component/Hero/Hero.jsx';
import Home from '../component/Home/Home.jsx';
import { AuthContext } from '../context/AuthContext.jsx';

const Router = () => {

  const { user } = useContext(AuthContext)

  return (
    <BrowserRouter>
    <Routes>
        <Route path="/auth" element={user ? <Home/> : <Hero/>} />
        <Route path="*" element={user ? <Home/> : <Hero/>} />
    </Routes>
    </BrowserRouter>
  )
}


export default Router
