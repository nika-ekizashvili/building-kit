import axios from "../api/axios";
import { useDispatch } from "react-redux";
import { setAuthAccessToken } from "@/store/slices/authSlice";

const REFRESH_URL = "/api/refresh";

const useRefreshToken = () => {
  const dispatch = useDispatch();

  const refresh = async () => {
    const { data } = await axios.get(REFRESH_URL);
    dispatch(setAuthAccessToken(data.access_token));
  };

  return refresh;
};

export default useRefreshToken;
