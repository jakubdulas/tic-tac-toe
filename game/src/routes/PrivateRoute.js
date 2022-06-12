import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = () => {
  let token = localStorage.getItem("token") ? true : false;
  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
