import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useSaleStore = defineStore("sale", {
  state: () => {
    return {
      sales: [],
      currentSale: {},
      notification: "",
    };
  },
  actions: {
    async getSales() {
      const { data } = await axiosClient.get("/saleinvoice");
      this.sales = data.data;
      this.notification = data.message;
      return data;
    },
    async getSale(id) {
      const data = await axiosClient.get(`/saleinvoice/${id}`);
      this.currentSale = data.data;
      this.notification = data.message;
      console.log(data);
      return data;
    },
    async saveSale(sales) {
      if (sales.id) {
        const { data } = await axiosClient.post(
          `/saleinvoice/${sales.id}`,
          sales
        );
        this.currentSale = data.data;
        this.notification = data.message;
        return data;
      } else {
        const { data } = await axiosClient.post("/saleinvoice", sales);
        this.currentSale = data.data;
        this.notification = data.message;
        return data;
      }
    },
  },
});
