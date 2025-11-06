import axios from 'axios';

// 🌐 URL base del backend (usando variable de entorno o valor por defecto)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';

// 🧾 Obtener todos los productos
export const getProducts = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// ➕ Agregar un producto
export const addProduct = async (product) => {
  const res = await axios.post(API_URL, product);
  return res.data;
};

// 🔄 Actualizar producto existente
export const updateProduct = async (id, updatedProduct) => {
  const res = await axios.put(`${API_URL}/${id}`, updatedProduct);
  return res.data;
};

// ❌ Eliminar producto
export const deleteProduct = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

// 🔍 Buscar producto por nombre o código de barras
export const findProduct = async (query) => {
  const res = await axios.get(`${API_URL}/find/${query}`);
  return res.data;
};
