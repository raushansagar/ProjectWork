import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;


// User 
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      index: true,
    },
    password: {
      type: String,
      minlength: 6,
    },

    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
      index: true,
    },

    avatar: {
      type: String,
      default: "",
    },

    refreshToken: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);



// Product 
const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: true,
      trim: true,
    },

    productType: {
      type: String,
      required: true,
    },
    brandName: {
      type: String,
      required: true,
      trim: true,
    },
    quantityStock: {
      type: Number,
      required: true,
      min: 0,
    },
    mrp: {
      type: Number,
      required: true,
      min: 0,
    },
    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    productImage: [
      {
      type: String,
      }
    ],
    exchangeOrReturnEligible: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);


// Price validation
productSchema.pre("save", function (next) {
  if (this.sellingPrice < this.mrp) {
    return next(new Error("Selling price cannot be greater than MRP"));
  }
  next();
});



// otp
const otpSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
      index: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, "Please enter a valid phone number"],
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index (auto delete)
    },
  },
  { timestamps: true }
);



// compare otp
otpSchema.methods.compareOtp = function (enteredOtp) {
  return bcrypt.compare(enteredOtp, this.otp);
};



const User = mongoose.model("User", userSchema);
const Product = mongoose.model("Product", productSchema);
const Otp = mongoose.model("Otp", otpSchema);

export { User, Product, Otp };
