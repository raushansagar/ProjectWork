import React, { useContext } from 'react'
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from '../context/AuthContext';


const ProtectedRoute = () => {
  const { user, loading } = useContext(AuthContext);

    // You can show loading spinner here if auth status is loading
    if (loading) return <div>Loading...</div>;

    // If no user, redirect to login
    if (!user) return <Navigate to="/auth" replace />;

    // If user exists, render child routes
    return <Outlet />;
}

export default ProtectedRoute
