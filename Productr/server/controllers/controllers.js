import ApiError from "../utils/ApiError.js";
import ApiResponse from '../utils/ApiResponse.js'
import asyncHandler from '../utils/asyncHandler.js'
import uploadOnCloudinary from '../utils/uploadOnCloudinary.js'
import { User, Otp, Product } from '../models/user.models.js'
import jwt from "jsonwebtoken";
import generateOtp from "../utils/generateOtp.js";
import sendOtpEmail from "../utils/sendOtpEmail.js";




//------------- User Controller -------------



// register user
const register = asyncHandler(async (req, res) => {
    let { data } = req.body;
    let { name, email, otp } = data;

    console.log(req.body)

    // Validation
    if (!name || !email || !otp) {
        throw new ApiError(400, "Name, Email and OTP are required");
    }

    name = name.trim();
    email = email.trim().toLowerCase();

    // Verify OTP
    const otpRecord = await Otp.findOne({ email });

    console.log(otpRecord)

    if (!otpRecord) {
        throw new ApiError(400, "OTP expired or not found");
    }

    if (otpRecord.otp !== otp) {
        throw new ApiError(401, "Invalid OTP");
    }

    // Delete OTP after verification
    await Otp.deleteOne({ _id: otpRecord._id });

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User already has an account");
    }

    // Image upload (optional)
    let avatar = null;
    const imageLocalPath = req.files?.image?.[0]?.path;

    if (imageLocalPath) {
        try {
            const uploaded = await uploadOnCloudinary(imageLocalPath);
            avatar = uploaded?.secure_url;
        } catch (error) {
            throw new ApiError(500, "Error uploading image");
        }
    }

    // Create user
    const newUser = await User.create({
        username: name,
        email,
        avatar,
    });


    return res.status(201).json(
        new ApiResponse(201, "User registered successfully", {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
        })
    );
});


// send otp
const sendOtp = asyncHandler(async (req, res) => {
    let { email } = req.body;

    if (!email) {
        throw new ApiError(401, "All fields are require")
    }

    const otp = generateOtp();

    // remove old otp
    await Otp.deleteMany({ email })
    let newOtp;

    if (email) {
        newOtp = await Otp.create({
            email,
            otp,
            expiresAt: Date.now() + 5 * 60 * 1000,   // 5 minutes
        })
    }

    // Send OTP email
    // await sendOtpEmail(email, otp);

    console.log(email, otp)

    return res.status(200).json(
        new ApiResponse(200, "OTP sent successfully", { otp })
    );
})


// login user
const login = asyncHandler(async (req, res) => {
    const { data } = req.body;
    const { email, otp } = data;

    if (!data) {
        throw new ApiError(400, "Email and OTP are required");
    }

    // check all fields are required
    if (!email || !otp) {
        throw new ApiError(400, "Email and OTP are required");
    }

    // find otp
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
        throw new ApiError(400, "OTP expired or not found");
    }

    // verify otp
    if (otpRecord.otp !== otp) {
        throw new ApiError(401, "Invalid OTP");
    }

    // delete otp
    await Otp.deleteOne({ _id: otpRecord._id });

    // find and check user 
    let user = await User.findOne({ email });
    if (!user) {
        throw new ApiError(401, "No Account Fount")
    }

    // generate refreshToken and accessToken
    const accessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY });
    const refreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY });


    // find and update user
    user = await User.findByIdAndUpdate(
        user._id,
        {
            $set: {
                refreshToken,
            }
        },
        {
            new: true,
        }
    )


    // save refreshToken in cookie
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 9 * 24 * 60 * 60 * 1000,  // 9 day
        path: "/",
    });

    // save accessToken in cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "none",
        maxAge: 60 * 60 * 1000, // 15 min
        path: "/",
    });


    // send response
    return res.status(200).json(
        new ApiResponse(200, "User Login Successfully", {
            name: user.name,
            email: user.email,
            accessToken: accessToken,
            refreshToken: user.refreshToken
        })
    )
})



// logout user
const logout = asyncHandler(async (req, res, next) => {

    // get user id
    const userId = req?.user?._id;
    if (!userId) {
        throw new ApiError(401, "Unauthorized: User not logged in");
    }

    // find and update user
    await User.findByIdAndUpdate(
        userId,
        {
            $set: {
                refreshToken: null,
            }
        },
        {
            new: true,
        }
    )

    // Clear cookies
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "strict"
    });


    return res.status(200).json(
        new ApiResponse(200, "User logged out successfully")
    )
})


// verify user
const verifyUser = asyncHandler(async (req, res) => {
    const user = req?.user;

    return res.status(200).json(
        new ApiResponse(200, "verify user successfully", {
            user: user,
        })
    )
})


// -------------- Product Controller -------------

const addProduct = asyncHandler(async (req, res) => {
    const { name, type, quantity, mrp, sellingPrice, brand, eligibility } = req.body;
    const user = req.user;

    if (
        !name?.trim() ||
        !type ||
        !quantity ||
        !mrp ||
        !sellingPrice ||
        !brand?.trim() ||
        !eligibility
    ) {
        throw new ApiError(400, "All fields are required");
    }
    const isEligible = eligibility === "Yes";

    // upload multiple images on Cloudinary
    let uploadedImages = [];

    const files = req.files?.productImages || [];

    if (files.length > 0) {
        try {
            uploadedImages = await Promise.all(
                files.map(async (file) => {
                    const uploaded = await uploadOnCloudinary(file.path);

                    if (!uploaded) {
                        throw new ApiError(500, "Cloudinary upload failed");
                    }

                    return uploaded.secure_url;
                })
            );
        } catch (error) {
            console.error(error);
            throw new ApiError(500, "Problem occurred while uploading images");
        }
    }


    const product = await Product.create({
        productName: name,
        productType: type,
        quantityStock: Number(quantity),
        mrp: Number(mrp),
        sellingPrice: Number(sellingPrice),
        brandName: brand,
        productImage: uploadedImages,
        exchangeOrReturnEligible: isEligible,
        addedBy: user._id,
    });


    return res.status(200).json(
        new ApiResponse(200, "Product add successfully", {
            product: product,
        })
    )
})


// update product 
const editProduct = asyncHandler(async (req, res) => {
    const { name, type, quantity, mrp, sellingPrice, brand, eligibility, ProductId } = req.body;
    const user = req.user;

    console.log(name, type, quantity, mrp, sellingPrice, brand, eligibility, ProductId);

    if (!ProductId) {
        throw new ApiError(400, "ProductId is required for updating a product");
    }

    const product = await Product.findById(ProductId);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }

    // Upload images if present
    let uploadedImages = [];
    const files = req.files?.productImages || [];
    if (files.length > 0) {
        try {
            uploadedImages = await Promise.all(
                files.map(async (file) => {
                    const uploaded = await uploadOnCloudinary(file.path);
                    if (!uploaded) {
                        throw new ApiError(500, "Cloudinary upload failed");
                    }
                    return uploaded.secure_url;
                })
            );
        } catch (error) {
            console.error(error);
            throw new ApiError(500, "Problem occurred while uploading images");
        }
    }

    // Update only if present and valid
    if (name?.trim()) product.productName = name.trim();

    if (type?.trim()) product.productType = type.trim();

    if (quantity !== undefined && !isNaN(quantity)) product.quantityStock = Number(quantity);

    if (mrp !== undefined && !isNaN(mrp)) product.mrp = Number(mrp);

    if (sellingPrice !== undefined && !isNaN(sellingPrice)) product.sellingPrice = Number(sellingPrice);

    if (brand?.trim()) product.brandName = brand.trim();

    if (eligibility !== undefined && eligibility !== null) {
        const eligibleNormalized = String(eligibility).toLowerCase();
        product.exchangeOrReturnEligible = eligibleNormalized === "yes";
    }

    if (uploadedImages.length > 0) product.productImage = uploadedImages;

    //update 
    product.addedBy = user._id;

    await product.save();

    return res.status(200).json(
        new ApiResponse(200, "Product updated successfully", { product })
    );
});


const publish = asyncHandler(async (req, res) => {
    const { ProductId } = req.body;
    const user = req.user;

    if (!ProductId) {
        throw new ApiError(400, "ProductId is required for updating a product");
    }

    let product = await Product.findById({
        _id : ProductId,
        addedBy: user._id
    });

    product = await Product.findOneAndUpdate(
        { _id: ProductId, addedBy: user._id },
        { isActive: !product.isActive },
        { new: true }
    );

    if (!product) {
        throw new ApiError(404, "Product not found or you don't have permission");
    }

    return res.status(200).json(
        new ApiResponse(200, "Product status updated successfully", { product })
    );
});


// delete product
const deleteProduct = asyncHandler(async (req, res) => {
    const { id } = req.body;
    const user = req.user;

    console.log(id)
    if (!id) {
        throw new ApiError(500, "Product Id Not Found");
    }

    const deletedProduct = await Product.findOneAndDelete({
        _id: id,
        addedBy: user._id
    });

    if (!deletedProduct) {
        throw new ApiError(404, "Product not found");
    }

    const product = await Product.find({ addedBy: user._id });

    return res.status(200).json(
        new ApiResponse(200, "Product delete successfully", {
            product: product,
        })
    )
})



// find product
const findProduct = asyncHandler(async (req, res) => {
    const user = req.user;

    const product = await Product.find({ addedBy: user._id });
    console.log(product);

    return res.status(200).json(
        new ApiResponse(200, "Product find successfully", {
            product: product,
        })
    )
})



export { register, login, sendOtp, addProduct, logout, editProduct, deleteProduct, verifyUser, findProduct, publish }