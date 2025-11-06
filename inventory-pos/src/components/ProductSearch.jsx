import { useState, useEffect } from 'react';
import { getProducts, updateProduct, deleteProduct } from '../api/inventoryService';

export default function ProductSearch({ onAddToCart }) {
  const [products, setProducts] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);

  // 🧾 Cargar productos desde MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // 🔍 Filtrar productos por nombre O categoría
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
  );

  const handleIncreaseStock = async (_id) => {
    const product = products.find((p) => p._id === _id);
    if (!product) return;
    const updated = { ...product, stock: product.stock + 1 };
    await updateProduct(_id, updated);
    setProducts((prev) => prev.map((p) => (p._id === _id ? updated : p)));
  };

  const handleDelete = async (_id) => {
    await deleteProduct(_id);
    setProducts((prev) => prev.filter((p) => p._id !== _id));
  };

  if (loading)
    return (
      <p className="text-center text-gray-500 text-lg mt-6 animate-pulse">
        Cargando productos...
      </p>
    );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md">
      <h3 className="text-2xl font-semibold mb-4 text-gray-800">
        Buscar y Agregar Producto
      </h3>

      {/* 🔎 Buscador */}
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Nombre, código o categoría"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* 📋 Tabla */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left">Categoría</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Precio</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <tr
                  key={product._id}
                  className="border-t hover:bg-gray-50 transition-colors"
                >
                  <td className="py-3 px-4">{product.category || 'Sin categoría'}</td>
                  <td className="py-3 px-4">{product.name}</td>
                  <td className="py-3 px-4">${product.price.toFixed(2)  || '0.00' }</td>
                  <td className="py-3 px-4">{product.stock}</td>
                  <td className="py-3 px-4 text-center space-x-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-all"
                    >
                      Agregar
                    </button>
                    
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-gray-500">
                  No se encontraron productos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
