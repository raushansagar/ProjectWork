import React from 'react'
import herologo from '../../assets/herologo.jpg'
import run from '../../assets/run.png'


const HeroLeft = () => {
    return (
       <div className="relative h-full">
  <img
    src={herologo}
    alt="background"
    className="h-full w-fit object-cover"
  />

  <div className="absolute flex items-center justify-center">
    <img
      src={run}
      alt="logo"
      className="h-[60%]"
    />
  </div>
</div>


    )
}

export default HeroLeft
