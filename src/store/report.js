import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useReportStore = defineStore("report", {
  state: () => {
    return {
      report: [],
      notification: "",
    };
  },
  actions: {
    async getSaleProductAnalysis(saleproduct) {
      const { data } = await axiosClient.post("/saleproduct", saleproduct);
      this.report = data.data;
      this.notification = data.message;
      console.log(data);
      return data;
    },
    async getStockMovement(movement) {
      const { data } = await axiosClient.post("/stockmovement", movement);
      this.report = data.data;
      return data;
    },

    async getStockSummary(summary) {
      const { data } = await axiosClient.post("/stocksummary", summary);
      this.report = data.data;
      return data;
    },
  },
});
