import cookie from "js-cookie";
import axios from "axios";
import { baseURL } from "./constants";

export const setCookie = (key: any, value: any) => {
  cookie.set(key, value, { expires: 1 });
};

export const removeCookie = (key: any) => {
  cookie.remove(key);
};

export const getCookie = (key: any) => {
  return cookie.get(key);
};

export const setAuthentication = (token: any) => {
  setCookie("token", token);
};

export const logOut = () => {
  removeCookie("token");
};

export const isLogin = async () => {
  const token = getCookie("token");

  if (token) {
    const res = await axios.post(`${baseURL}auth`, { token });

    const userData = res.data.data;
    return { isAuthenticated: true, data: userData, userId: userData._id };
  }
  return { isAuthenticated: false };
};
