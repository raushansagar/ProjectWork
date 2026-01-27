import React, { useContext, useState } from 'react'
import Items from '../Items/Items';
import { AuthContext } from '../../context/AuthContext';
import ProductCard from '../ProductCard/ProductCard';


const Product = () => {
  const { addProduct, setAddProduct, findProduct, product, setProduct } = useContext(AuthContext);

  const onHandlerProduct = async () => {
    const res = await findProduct()
    setProduct(Array.isArray(res.product) ? res.product : []);
  }

  return (
    <>
      {/* <ProductCard/> */}
      <div className='w-full h-[48px] flex flex-row justify-between items-center pl-3 pr-3'>
        <p>Products</p>
        <div className='flex flex-row items-center space-x-1 cursor-pointer' onClick={() => setAddProduct(!addProduct)}>
          <ion-icon name="add-outline"></ion-icon>
          <p>Add Products</p>
        </div>
      </div>
      <div className='h-full w-full p-3 flex flext-row justify-center items-center'>
        {addProduct ?
          (<>
            {product.length <= 0 ?
              (
                <div className=' h-[254px] flex flex-col justify-center items-center space-y-2'>
                  <ion-icon className="text-6xl text-[#071074] font-bold " name="grid-outline"></ion-icon>
                  <div className='flex flex-col justify-center items-center'>
                    <p className='text-[20px] text-[#344054]'>Feels a little empty over here...</p>
                    <p className='text-[#98A2B3]'>Your can crate a products without connecting store</p>
                    <p className='text-[#98A2B3]' >you can add a products to store anytime</p>
                  </div>
                  <button onClick={() => setAddProduct(!addProduct)} className='h-[40px] w-[315px] text-[#FFFFFF] mt-3 rounded-sm bg-[#000FB4] cursor-pointer'>Add your Products</button>
                </div>
              ) :
              ("")}
            <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {product?.map((item) => (
                  <ProductCard key={item._id} product={item} />
                ))}
              </div>
            </div>
          </>)
          :
          (<Items />)
        }
      </div>
    </>
  )
}

export default Product
