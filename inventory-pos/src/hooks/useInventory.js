import { useState, useEffect } from 'react';

// 🧾 Inventario inicial simulado (puedes reemplazar con datos de API)
const initialInventory = [];

export function useInventory() {
  const [products, setProducts] = useState([]);

  // Carga inicial del inventario
  useEffect(() => {
    setProducts(initialInventory);
  }, []);

  // ➕ Agregar producto
  const addProduct = (product) => {
    setProducts((prev) => [
      ...prev,
      { ...product, id: Date.now() }, // Genera un id único
    ]);
  };

  // 🔄 Actualizar producto existente
  const updateProduct = (id, updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedProduct } : p))
    );
  };

  // ❌ Eliminar producto
  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  // 🔍 Buscar producto por nombre 
  const findProduct = (query) => {
    const lowerQuery = query.toLowerCase();
    return products.find(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery)
    );
  };

  return { products, addProduct, updateProduct, deleteProduct, findProduct };
}
