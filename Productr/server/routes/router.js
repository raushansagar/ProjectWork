import Router from 'express';
import {register, login, sendOtp, logout, addProduct, editProduct, deleteProduct, verifyUser, findProduct} from '../controllers/controllers.js'
import verifyJWT from '../middleware/verifyJWT.js';
import upload from '../middleware/multer.js'


// router
const router = Router();



// // ----------- User Route ----------

// register user
router.route("/user/register").post(
    upload.fields([{ name: "productImages", maxCount: 1 }]),
    register
);

// // login user
router.route("/user/login").post(login)


// logout 
router.route("/user/logout").post(verifyJWT, logout)
 
// send otp
router.route("/user/otp").post(sendOtp);

// verifyUser
router.route("/user/verifyUser").post(verifyJWT, verifyUser);





// ----------- Product Route ---------


// add product
router.route("/product/add").post(
    upload.fields([
        {
            name : "productImages",
            maxCount: 5,
        }
    ]),
    verifyJWT,
    addProduct
)


router.route("/find/product").post(verifyJWT, findProduct);

// edit product
// router.route("product/edit").put()

// // delete product
// router.route("product/delete").delete()





export default router;