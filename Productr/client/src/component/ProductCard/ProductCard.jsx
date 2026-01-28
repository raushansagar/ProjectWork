import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";


const ProductCard = ({ product }) => {

    const { deleteProductm, showEdit, setShowEdit, setProductEdit, setAddProduct, addProduct, deleteProduct, publish } = useContext(AuthContext);

    const onHandelDelete =  async( id ) => {
        const res = await deleteProduct( id );
    }

    const onHandelEditItems = async() => {
      console.log(product)
      setProductEdit(product);
      setShowEdit(true)
      setAddProduct(false)
    }

    const onHandelAddPublish = async( data )=> {
        try {
          const res = await publish(data);
        } catch (error) {
          
        }
    }


  const images = product.productImage || [];
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="w-[360px] bg-white rounded-xl shadow-md p-4 flex flex-col gap-3">
      <div className="h-[180px] w-full bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
        {images.length > 0 ? (
          <img
            src={images[activeIndex]}
            alt={product.productName}
            className="h-full w-full object-contain"
          />
        ) : (
          <p className="text-gray-400 text-sm">No Image</p>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex justify-center gap-1">
          {images.map((_, index) => (
            <span
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`h-2 w-2 rounded-full cursor-pointer ${
                index === activeIndex
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}

      {/* Product Name */}
      <h3 className="font-semibold text-lg">
        {product.productName}
      </h3>

      {/* Details */}
      <div className="text-sm text-gray-600 space-y-1">
        <p><span className="font-medium">Product type:</span> {product.productType}</p>
        <p><span className="font-medium">Quantity Stock:</span> {product.quantityStock}</p>
        <p><span className="font-medium">MRP:</span> ₹{product.mrp}</p>
        <p><span className="font-medium">Selling Price:</span> ₹{product.sellingPrice}</p>
        <p><span className="font-medium">Brand Name:</span> {product.brandName}</p>
        <p>
          <span className="font-medium">Exchange Eligibility:</span>{" "}
          {product.exchangeOrReturnEligible ? "YES" : "NO"}
        </p>
        <p>
          <span className="font-medium">Total Images:</span> {images.length}
        </p>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-3">
        {product.isActive ? (
          <button onClick={() => onHandelAddPublish(product._id)} className="flex-1 bg-green-500 text-white py-2 rounded-md cursor-pointer">
            Publish
          </button>
        ) : (
          <button onClick={() => onHandelAddPublish(product._id)} className="flex-1 bg-blue-600 text-white py-2 rounded-md cursor-pointer">
            Unpublish
          </button>
        )}

        <button onClick={() => onHandelEditItems(product)} className="flex-1 border border-gray-400 py-2 rounded-md cursor-pointer">
          Edit
        </button>

        <button onClick={() => onHandelDelete(product._id)} className="w-10 border border-red-400 text-red-500 rounded-md cursor-pointer">
          🗑
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
