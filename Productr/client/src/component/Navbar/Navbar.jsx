import React, { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'

const Navbar = () => {

 const { logoutUser } = useContext(AuthContext);

 const logoutHandler = async() => {
    const res = await logoutUser();
 }

  return (
    <div className='h-[64px] w-full bg-[#D1D5DB] flex flex-row justify-between pl-5 pr-5 items-center'>
      <div className='flex flex-row items-center space-x-2'>
        <ion-icon className="text-[#344054]" name="bag-outline"></ion-icon>
        <p className='text-[14px] text-[#344054]'>Product</p>
      </div>
      <div className='flex flex-row items-center h-[45px] w-[45px rounded-2xl'>
        <ion-icon onClick={() => logoutHandler()} className="text-2xl cursor-pointer" name="log-out-outline"></ion-icon>
      </div>
    </div>
  )
}

export default Navbar
