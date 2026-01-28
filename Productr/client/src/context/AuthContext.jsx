
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL;



// Auth context provider 
export const AuthContext = createContext();


export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [addProduct, setAddProduct] = useState(true);
    const [signup, setSignup] = useState(false);
    const [product, setProduct] = useState([]);
    const [recOtp, setRevOtp] = useState("");
    const [productEdit, setProductEdit] = useState(null);
    const [showEdit, setShowEdit] = useState(false);




    // Axios Instance
    const httpClient = axios.create({
        baseURL: API_URL,
        withCredentials: true,
    });


    // Restore user on page refresh
    useEffect(() => {
        async function initAuth() {
            try {
                const res = await httpClient.post("/productr/v2/user/verifyUser");
                const res2 = await httpClient.post("productr/v2/find/product")
                setUser("login");
                setProduct(Array.isArray(res2.data.data.product) ? res2.data.data.product : []);
            } catch {[[]]
                setUser(null);
            } finally {
                setLoading(false);
            }
        }

        initAuth();
    }, []);


    // user login 
    const loginUser = async ( data ) => {
        try {
            const res = await httpClient.post("/productr/v2/user/login", {data})
            setUser("login");
            return res;
        } catch {
            setUser(null);
            throw error;
        } finally {
            setLoading(false);
        }
    };


    // user register
    const registerUser = async (data) => {
        try {
            const res = await httpClient.post("productr/v2/user/register", {data});
            return res;
        } catch {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    console.log("Login Otp",recOtp);


    // user send otp
    const userOtp = async (data) => {
        try {
            const res = await httpClient.post("productr/v2/user/otp", { email : data})
            setRevOtp(res.data.data.otp);
            return res;
        } catch {
            throw error;
        } finally {
            setLoading(false);
        }
    };



    // user logout
    const logoutUser = async () => {
        try {
            const res = await httpClient.post("productr/v2/user/logout");
            setUser(null);
            return res;
        } catch {
            console.warn("User Logout Faild Retry Again");
        } finally {
            setLoading(false);
        }
    };


    // add product
    const addProducts = async (formData) => {
        try {

            const res = await httpClient.post("productr/v2/product/add", formData)
            return res;
        } catch {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // find product
    const findProduct = async (formData) => {
        try {

            const res = await httpClient.post("productr/v2/find/product", formData)
            return res.data.data;
        } catch {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    // delete product 
    const deleteProduct = async ( id ) => {
        try {
            const res = await httpClient.post("productr/v2/product/delete", { id })
            console.log(res);
            setProduct(Array.isArray(res.data.data.product) ? res.data.data.product : []);
            return res.data.data;
        } catch {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    // update  product
    const updateProduct = async (formData) => {
        try {

            const res = await httpClient.post("productr/v2/product/edit", formData)
            return res;
        } catch {
            throw error;
        } finally {
            setLoading(false);
        }
    };


    // publish
    const publish = async (data) => {
        try {
            const res = await httpClient.post("productr/v2/product/publish", {ProductId : data})
            return res;
        } catch {
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                addProduct,
                setAddProduct,
                loginUser,
                registerUser,
                userOtp,
                addProducts,
                findProduct,
                deleteProduct,
                signup,
                setSignup,
                logoutUser,
                product, 
                setProduct,
                showEdit,
                setShowEdit,
                productEdit, 
                setProductEdit,
                updateProduct,
                publish
            }} >
            {children}
        </AuthContext.Provider>
    )
}