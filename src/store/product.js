import { defineStore } from "pinia";
import axiosClient from "../axios";

export const useProductStore = defineStore("product", {
  state: () => {
    return {
      products: [],
      currentProduct: {},
      saleableProduct: [],
      notification: "",
    };
  },
  actions: {
    async getProducts() {
      try {
        const { data } = await axiosClient.get("/products");
        console.log(data);
        this.products = data.data;
        this.saleableProduct = data.saleable_product;
        this.notification = data.message;
        return data;
      } catch (error) {
        throw error;
      }
    },
    async getProduct(id) {
      try {
        const data = await axiosClient.get(`/products/${id}`);
        console.log(data.data);
        this.currentProduct = data.data;
        return data;
      } catch (error) {
        throw error;
      }
    },
    async addProduct(product) {
      if (product.id) {
        const { data } = await axiosClient.post(
          `/products/${product.id}`,
          product
        );
        this.currentProduct = data;
        this.notification = data.message;
        console.log(data);
        return data;
      } else {
        const { data } = await axiosClient.post("/products", product);
        this.currentProduct = data;
        this.notification = data.message;
        console.log(data);
        return data;
      }
    },
    async deleteProduct(id) {
      const { data } = await axiosClient.delete(`/products/${id}`);
      this.notification = data.message;
      this.getProducts();
      return data;
    },
  },
});
