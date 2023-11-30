import axios from "axios";

//Axios instance for requesting
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BUILDING_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
