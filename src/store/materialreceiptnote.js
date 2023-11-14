import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useMRNStore = defineStore("matetialreceiptnote", {
  state: () => {
    return {
      imports: [],
      currentImport: {},
      notification: "",
    };
  },
  actions: {
    async getImports() {
      try {
        const { data } = await axiosClient.get("/importtowarehouses");
        this.imports = data.data;
        this.notification = data.message;
        return data;
      } catch (error) {
        throw error;
      }
    },
    async getImport(id) {
      try {
        const data = await axiosClient.get(`/importtowarehouses/${id}`);
        this.currentImport = data.data;
        console.log(data.data);
        return data;
      } catch (error) {
        throw error;
      }
    },
    async saveImport(mrn) {
      if (mrn.id) {
        const { data } = await axiosClient.post(
          `importtowarehouses/${mrn.id}`,
          mrn
        );
        this.currentImport = data;
        this.notification = data.message;
        return data;
      } else {
        const { data } = await axiosClient.post("/importtowarehouses", mrn);
        this.currentImport = data;
        this.notification = data.message;
        return data;
      }
    },

    async deleteImport(id) {
      const { data } = await axiosClient.delete(`/importtowarehouses/${id}`);
      this.notification = data.message;
      this.getImports();
      return data;
    },
  },
});
