import axios from "axios";

export const getHomeItems = async () => {
  try {
    const { data } = await axios.get("/pharmacies/home");
    return { pharmacies: data.pharmacies, products: data.products };
  } catch (error) {
    console.log(error, "Getting home items");
    return [[], []];
  }
};

export const getPharmacies = async (skip) => {
  try {
    const { data } = await axios.get(`/pharmacies?skip=${skip}`);
    return { pharmacies: data.pharmacies, pages: data.pages };
  } catch (error) {
    console.log(error, "getting pharmacies");
    return { pharmacies: [], pages: 1 };
  }
};

export const searchPharmacies = async (name) => {
  try {
    const { data } = await axios.get(`/pharmacies?name=${name.trim()}`);
    return { pharmacies: data.pharmacies, pages: data.pages };
  } catch (error) {
    console.log(error, "searching pharmacies");
    return { pharmacies: [], pages: 1 };
  }
};

export const getProducts = async (skip, category) => {
  try {
    const { data } = await axios.get(
      `/products?skip=${skip}&&category=${category}`
    );
    return { products: data.products, pages: data.pages };
  } catch (error) {
    console.log(error, "error getting products");
    return { products: [], pages: 1 };
  }
};

export const searchProducts = async (name) => {
  try {
    const { data } = await axios.get(`/products?name=${name.trim()}`);
    return { products: data.products, pages: data.pages };
  } catch (error) {
    console.log(error, "error searching products");
    return { products: [], pages: 1 };
  }
};