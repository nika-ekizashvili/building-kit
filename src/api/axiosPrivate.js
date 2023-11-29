import axios from 'axios';

const BASE_URL = 'http://localhost:3001';

const axiosPrivate = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
        credentials: true
    },
    withCredentials: true
});

export default axiosPrivate;
