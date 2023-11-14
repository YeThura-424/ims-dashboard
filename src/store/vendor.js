import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useVendorStore = defineStore("vendor", {
  state: () => {
    return {
      vendors: [],
      currentVendor: [],
      notification: "",
    };
  },
  actions: {
    async getVendors() {
      try {
        const { data } = await axiosClient.get("/vendors");
        this.vendors = data.data;
        this.nodification = data.message;
        return data;
      } catch (error) {
        throw error;
      }
    },
    async getVendor(id) {
      try {
        const data = await axiosClient.get(`/vendors/${id}`);
        this.currentVendor = data.data;
        this.notification = data.message;
        return data;
      } catch (error) {
        throw error;
      }
    },
    async saveVendor(vendor) {
      if (vendor.id) {
        const { data } = await axiosClient.post(
          `/vendors/${vendor.id}`,
          vendor
        );
        this.currentVendor = data;
        this.notification = data.message;
        return data;
      } else {
        const { data } = await axiosClient.post("/vendors", vendor);
        console.log(data);
        this.currentVendor = data;
        this.notification = data.message;
        return data;
      }
    },
    async deleteVendor(id) {
      const { data } = await axiosClient.delete(`/vendors/${id}`);
      console.log(data);
      this.notification = data.message;
      this.getVendors();
      return data;
    },
  },
});
