import axiosPrivate from "../api/axiosPrivate";
import { useEffect } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import { useSelector } from "react-redux";
import { selectAuthAccessToken } from "../store/slices/authSlice";

const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const access_token = useSelector(selectAuthAccessToken);

  useEffect(() => {
    const reqInterseptor = axiosPrivate.interceptors.request.use(
      (request) => {
        if (!request.headers["authorization"]) {
          request.headers["authorization"] = `Bearer ${access_token}`;
        }

        return request;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    const resInterseptor = axiosPrivate.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const prev_request = error?.config;

        if (error?.response?.status === 403 && !prev_request?.sent) {
          prev_request.sent = true;
          const { data } = await refresh();

          prev_request.headers["authorization"] = `Bearer ${data.access_token}`;
          return axiosPrivate(prev_request);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axiosPrivate.interceptors.request.eject(reqInterseptor);
      axiosPrivate.interceptors.response.eject(resInterseptor);
    };
  }, [refresh]);

  return axiosPrivate;
};

export default useAxiosPrivate;
