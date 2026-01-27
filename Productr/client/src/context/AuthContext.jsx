
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
                console.log(res2)
                setProduct(Array.isArray(res2.data.data.product) ? res2.data.data.product : []);
                setUser("login");
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



    // user send otp
    const userOtp = async (data) => {
        try {

            const res = await httpClient.post("productr/v2/user/otp", { email : data})
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


    const deleteProduct = async ( id ) => {
        try {

            const res = await httpClient.post("productr/v2/delete/product", { id })
            return res.data.data;
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
                setProduct
            }} >
            {children}
        </AuthContext.Provider>
    )
}