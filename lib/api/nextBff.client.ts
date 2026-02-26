import axios, { AxiosInstance } from "axios";

export const AxiosApi: AxiosInstance = axios.create({
 
  baseURL: "/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});