import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "@/hooks";
import Navbar from "@/components/Navbar";

const PrivateRoutes = () => {
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  return isLoggedIn ? <div> <Navbar />   <Outlet /></div> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;