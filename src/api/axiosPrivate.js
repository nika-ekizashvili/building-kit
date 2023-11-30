import axios from 'axios';

const BASE_URL = process.env.NEXT_PUBLIC_BUILDING_URL;

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        credentials: true
    },
    withCredentials: true
});

export default axiosPrivate;
