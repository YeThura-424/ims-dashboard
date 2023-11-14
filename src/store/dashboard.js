import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useDashboardStore = defineStore("dashboard", {
  state: () => {
    return {
      minimumProduct: [],
      todaySale: [],
    };
  },
  actions: {
    async getMinimumProduct() {
      const { data } = await axiosClient.get("/minimumproduct");
      this.minimumProduct = data.data;
      return data;
    },
    async getTodaySale() {
      const { data } = await axiosClient.get("/todaysale");
      this.todaySale = data.data;
      return data;
    },
  },
});
