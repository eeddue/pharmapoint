import axios from "axios";

export const getHomeItems = async (userId) => {
  try {
    const { data } = await axios.get(`/pharmacies/home/${userId}`);
    return { pharmacies: data.pharmacies, products: data.products };
  } catch (error) {
    return [[], []];
  }
};

export const getPharmacies = async (skip, user) => {
  let url = `/pharmacies/?skip=${skip}`;
  if (Boolean(user)) {
    url += `&&userId=${user._id}`;
  }
  try {
    const { data } = await axios.get(url);
    return { pharmacies: data.pharmacies, pages: data.pages };
  } catch (error) {
    return { pharmacies: [], pages: 1 };
  }
};

export const searchPharmacies = async (name, user) => {
  let url = `/pharmacies?name=${name.trim()}`;
  if (Boolean(user)) {
    url += `&&userId=${user._id}`;
  }
  try {
    const { data } = await axios.get(url);
    return { pharmacies: data.pharmacies, pages: data.pages };
  } catch (error) {
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
    return { products: [], pages: 1 };
  }
};

export const searchProducts = async (name) => {
  try {
    const { data } = await axios.get(`/products?name=${name.trim()}`);
    return { products: data.products, pages: data.pages };
  } catch (error) {
    return { products: [], pages: 1 };
  }
};

export const getChatMessages = async (receiverId, skip, headers) => {
  try {
    const { data } = await axios.get(
      `/chats/${receiverId}/messages?skip=${skip}`,
      {
        headers,
      }
    );
    return { messages: data.messages, pages: data.pages };
  } catch (error) {
    return { messages: [], pages: 1 };
  }
};

export const getPharmacyProducts = async (pharmacyId, skip) => {
  try {
    const { data } = await axios.get(`/products/${pharmacyId}?skip=${skip}`);
    return { products: data.products, pages: data.pages };
  } catch (error) {
    return { products: [] };
  }
};

export const getPharmacyReviews = async (pharmacyId, skip) => {
  try {
    const { data } = await axios.get(`/reviews/${pharmacyId}?skip=${skip}`);
    return { reviews: data.reviews, pages: data.pages };
  } catch (error) {
    return { reviews: [] };
  }
};
