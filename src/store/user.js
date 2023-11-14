import { defineStore } from "pinia";
import axiosClient from "../axios";
export const useUserStore = defineStore("user", {
  state: () => {
    return {
      user: {},
      token: sessionStorage.getItem("TOKEN") || null,
    };
  },
  actions: {
    async login(user) {
      try {
        const { data } = await axiosClient.post("/login", user);
        this.token = data.token;
        this.user = data.user;
        sessionStorage.setItem("TOKEN", data.token);
        return data;
      } catch (error) {
        throw error;
      }
    },
    async logout() {
      await axiosClient.post("/logout");
      this.token = null;
      this.user = {};
      sessionStorage.removeItem("TOKEN");
    },
  },
});
