import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL_SALES;

export const createSale = async (saleData) => {
  const res = await axios.post(API_URL, saleData);
  return res.data;
};

export const getSales = async () => {
  const res = await axios.get(API_URL);
  return res.data;
}
