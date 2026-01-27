import React from 'react'

const Sidebar = () => {
    return (
        <div className='w-[240px] h-full bg-[#1D222B] flex flex-col justify-start'>
            <div className='h-[112px] w-[240px] flex flex-col justify-around items-start'>
                <div className='flex flex-row  w-full pl-2'>
                    <div className="p-1 h-10 w-32  flex flex-row justify-start items-center">
                        <p className="text-[#ffff] text-[24px] font-extrabold relative pr-1">Productr</p>
                        <p className="text-[#ff662B] text-[20px] -rotate-45 font-extrabold relative">8</p>
                    </div>
                </div>
                <div className='w-full flex flex-row justify-center items-center'>
                    <div className='bg-[#2F343D]  w-[224px] h-[34px] flex flex-row justify-center items-center rounded-sm space-x-3'>
                        <ion-icon className="text-gray-200" name="search"></ion-icon>
                        <input className='text-white outline-none h-full w-fit' type="search" placeholder='Search' />
                    </div>
                </div>
            </div>
            <div className=' h-full flex flex-col'>
                <hr className='text-gray-400 w-full' />
                <div className='mt-3 w-full flex flex-col p-3 space-y-3'>
                    <div className='h-[34px] w-full flex flex-row justify-start items-center space-x-1 cursor-pointer'>
                        <ion-icon className="cursor-pointer" name="home"></ion-icon>
                        <button className='text-[#98A2B3] cursor-pointer'>Home</button>
                    </div>
                    <div className='h-[34px] w-full flex flex-row justify-start items-center space-x-1 '>
                        <ion-icon className='text-gray-200 cursor-pointer' name="bag-handle-outline"></ion-icon>
                        <button className='text-[#FFFFFF] cursor-pointer'>Product</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
