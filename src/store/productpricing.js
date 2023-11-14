import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useProductPricingStore = defineStore("productpricing", {
  state: () => {
    return {
      pricing: [],
      pricedProduct: [],
      currentPricing: {},
      notification: "",
    };
  },
  actions: {
    async getPricings() {
      try {
        const { data } = await axiosClient.get("/productpricing");
        this.pricing = data.data;
        this.pricedProduct = data.pricedProduct;
        this.notification = data.message;
        // console.log(data);
        return data;
      } catch (error) {
        throw error;
      }
    },
    async getPricing(id) {
      const data = await axiosClient.get(`/productpricing/${id}`);
      this.currentPricing = data.data;
      this.notification = data.message;
      console.log(data);
      return data;
    },
    async savePricing(pricing) {
      if (pricing.id) {
        const { data } = await axiosClient.post(
          `/productpricing/${pricing.id}`,
          pricing
        );
        this.currentPricing = data.data;
        this.notification = data.message;
        return data;
      } else {
        const { data } = await axiosClient.post("/productpricing", pricing);
        this.currentPricing = data.data;
        this.notification = data.message;
        return data;
      }
    },
  },
});
