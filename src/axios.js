import axios from "axios";
import { useUserStore } from "./store/user";
import router from "./router";

const axiosClient = axios.create({
  // baseURL: "http://localhost:8000/api",
  baseURL: "https://imsbackend.yethura.com/api",
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

axiosClient.interceptors.request.use((config) => {
  const userStore = useUserStore();
  config.headers.Authorization = `Bearer ${userStore.token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      sessionStorage.removeItem("TOKEN");
      router.push({ name: "Login" });
    } else if (error.response.status === 404) {
      router.push({ name: "NotFound" });
    }
    return error;
  }
);
export default axiosClient;
