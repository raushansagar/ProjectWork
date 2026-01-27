import React, { useContext, useState } from 'react';
import herologo from '../../assets/herologo.jpg';
import Login from '../Login/Login';
import Signup from '../Signup/Signup';
import { AuthContext } from '../../context/AuthContext';

const Hero = () => {
  const  { signup, setSignup} = useContext(AuthContext)

  return (
    <div className="h-screen w-full flex flex-row p-5 bg-gray-300">
      <div className="h-full w-full relative">
        <div className="p-1 h-10 w-32 absolute top-5 left-5 flex flex-row justify-center items-center">
          <p className="text-[#071074] text-[15px] font-extrabold pr-1">Productr</p>
          <p className="text-[#ff662B] text-[20px] -rotate-45 font-extrabold">8</p>
        </div>
        <img src={herologo} alt="logo" className="h-full rounded-2xl object-cover" />
      </div>

      {!signup ? (
        <div className="h-full w-full flex flex-col justify-around items-center p-5">
          <Login />
          <div
            onClick={() => setSignup(true)}
            className="h-[80px] w-[376px] flex flex-row justify-center items-center border-2 rounded-2xl border-gray-300 cursor-pointer select-none mt-4"
          >
            <div className="flex flex-col items-center">
              <p className="text-gray-400">Don't have a Productr Account</p>
              <p className="text-[#071074] font-semibold">SignUp Here</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full w-full flex flex-col justify-around items-center p-5">
          <Signup />
          <div
            onClick={() => setSignup(false)}
            className="h-[80px] w-[376px] flex flex-row justify-center items-center border-2 rounded-2xl border-gray-300 cursor-pointer select-none mt-4"
          >
            <div className="flex flex-col items-center ">
              <p className="text-gray-400">Already have a Productr Account</p>
              <p className="text-[#071074] font-semibold">Login Here</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
