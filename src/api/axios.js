import axios from "axios";

//Axios instance for requesting
const axiosInstance = axios.create({
  baseURL: "http://localhost:3001",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

export default axiosInstance;
