import React from 'react'
import Sidebar from '../Sidebar/Sidebar.jsx'
import Product from '../Product/Product.jsx'
import Navbar from '../Navbar/Navbar.jsx'

const Home = () => {
  return (
    <div className=' bg-amber-500 h-full w-full flex flex-row'>
      <Sidebar/>
      <div className='flex flex-col bg-amber-50 h-full w-full'>
        <Navbar/>
        <Product/>
      </div>
    </div>
  )
}

export default Home
