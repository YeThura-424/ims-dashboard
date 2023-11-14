import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useConversionStore = defineStore("conversion", {
  state: () => {
    return {
      conversion: [],
      currentConversion: {},
      notification: "",
    };
  },
  actions: {
    async getConversions() {
      const { data } = await axiosClient.get("/productconversion");
      this.conversion = data.data;
      this.notification = data.message;
      return data;
    },
    async getConversion(id) {
      const data = await axiosClient.get(`/productconversion/${id}`);
      this.currentConversion = data.data;
      this.notification = data.message;
      return data;
    },
    async saveConversion(conversion) {
      const { data } = await axiosClient.post("/productconversion", conversion);
      this.currentConversion = data;
      this.notification = data.message;
      console.log(data);
      return data;
    },
  },
});
