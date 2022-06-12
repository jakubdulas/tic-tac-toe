import axios from "axios";

const baseURL = "http://localhost:8000/api";

const axiosInstance = axios.create({
  baseURL: baseURL,
  timeout: 5000,
  headers: {
    Authorization: localStorage.getItem("token")
      ? "Token " + localStorage.getItem("token")
      : null,
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 404 || error.response.status === 403) {
      window.location.pathname = "/404";
    } else if (error.response.status === 401) {
      localStorage.clear();
      axiosInstance.defaults.headers["Authorization"] = null;
      window.location.pathname = "";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
