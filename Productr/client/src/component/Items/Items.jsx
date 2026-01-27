import React, { useState, useRef, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { toast } from "react-toastify";


const Items = ({ onClose }) => {

    const { addProduct, setAddProduct, addProducts } = useContext(AuthContext)


    const [formData, setFormData] = useState({
        name: '',
        type: '',
        quantity: '',
        mrp: '',
        sellingPrice: '',
        brand: '',
        eligibility: 'Yes'
    });

    const onAddProduct = async () => {
        const {
            name,
            type,
            quantity,
            mrp,
            sellingPrice,
            brand,
            eligibility,
        } = formData;

        if (
            !name?.trim() ||
            !type ||
            !brand?.trim() ||
            !eligibility ||
            !quantity ||
            !mrp ||
            !sellingPrice
        ) {
            toast.error("All fields are required");
            return;
        }

        if (Number(sellingPrice) < Number(mrp)) {
            toast.error("Selling price cannot be greater than MRP");
            return;
        }

        if (Number(quantity) <= 0) {
            toast.error("Quantity must be greater than 0");
            return;
        }

        if (images.length === 0) {
            toast.error("Please upload at least one product image");
            return;
        }

        try {
            const data = new FormData();

            data.append("name", name);
            data.append("type", type);
            data.append("brand", brand);
            data.append("quantity", quantity);
            data.append("mrp", mrp);
            data.append("sellingPrice", sellingPrice);
            data.append(
                "eligibility",
                eligibility === "Yes" ? true : false
            );

            images.forEach((img) => {
                data.append("productImages", img.file);
            });

            const res = await addProducts(data);

            toast.success("Product added successfully");
            setAddProduct(!addProduct);

        } catch (error) {
            console.error(error);
            toast.error("Failed to add product");
        }
    };




    const [images, setImages] = useState([]);
    const [showError, setShowError] = useState(true);
    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'name' && value.trim() !== '') setShowError(false);
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImages(prev => [...prev, ...newImages]);
    };

    const removeImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    return (
        <div className="fixed inset-0 bg-[#334155]/60 flex justify-center items-center z-50 p-4 font-sans">
            <div className="bg-white w-full max-w-[420px] rounded-xl shadow-2xl flex flex-col overflow-hidden">
                <div className="px-6 py-4 flex justify-between items-center border-b border-gray-100">
                    <h2 className="text-[17px] font-semibold text-gray-700">Add Product</h2>
                    <button onClick={() => setAddProduct(!addProduct)} className="text-gray-400 cursor-pointer hover:text-gray-600 text-2xl font-light">&times;</button>
                </div>
                <div className="p-6 space-y-4 overflow-y-auto max-h-[75vh]">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                        <input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            type="text"
                            placeholder='Enter product name'
                            className={`w-full border rounded-lg px-3 py-2 outline-none ${showError ? 'border-[#F87171]' : 'border-gray-300'}`}
                        />
                        {showError && <p className="text-[13px] text-[#F87171] mt-1">Please enter product name</p>}
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700">
                            Product Type
                        </label>
                        <select name="type" value={formData.type} onChange={handleChange} className="text w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none">
                            <option>Foods</option>
                            <option>Clothes</option>
                            <option>Electronics</option>
                            <option>Beauty Products</option>
                            <option>Others</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantity Stock</label>
                        <input name="quantity" placeholder='Enter number of Stock available' value={formData.quantity} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">MRP</label>
                        <input name="mrp" placeholder='Enter MRP price' value={formData.mrp} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Selling Price</label>
                        <input name="sellingPrice" placeholder='Enter Selling price' value={formData.sellingPrice} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand Name</label>
                        <input name="brand" placeholder='Enter brand name' value={formData.brand} onChange={handleChange} type="text" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none" />
                    </div>
                    <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Upload Product Images
                        </label>

                        <div
                            onClick={() => fileInputRef.current.click()}
                            className="border border-dashed border-gray-300 rounded-lg p-3 min-h-[90px] flex flex-wrap gap-3 cursor-pointer"
                        >
                            <input
                                type="file"
                                multiple
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            {images.length === 0 && (
                                <div className="flex flex-col items-center justify-center w-full h-[70px] text-gray-400">
                                    <p className="text-sm">Enter description</p>
                                    <p className="text-sm underline">Browse</p>
                                </div>
                            )}
                            {images.map((img, index) => (
                                <div
                                    key={index}
                                    className="relative w-[70px] h-[70px] border border-gray-200 rounded-lg p-1 bg-white"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <img
                                        src={img.preview}
                                        alt="product"
                                        className="w-full h-full object-cover rounded-md"
                                    />

                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="absolute -top-2 -right-2 bg-white border border-gray-300 text-gray-500 rounded-full w-5 h-5 flex items-center justify-center text-[10px] shadow hover:bg-gray-100"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>


                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Exchange or return eligibility</label>
                        <select name="eligibility" value={formData.eligibility} onChange={handleChange} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none bg-[#F9FAFB] text-gray-400">
                            <option>Yes</option>
                            <option>No</option>
                        </select>
                    </div>
                </div>
                <div className="p-5 border-t border-gray-50 flex justify-end">
                    <button onClick={() => onAddProduct()} className="bg-[#1D29BF] hover:bg-[#1621a1] text-white text-sm font-medium px-8 py-2.5 rounded-lg shadow-sm">
                        Create
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Items;