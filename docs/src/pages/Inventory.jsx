import { useEffect, useState } from 'react';
import { getProducts, addProduct, deleteProduct, updateProduct } from '../api/inventoryService';
export default function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newProduct, setNewProduct] = useState({
    category: '',
    name: '',
    price: '',
    stock: '',
  });
  const [editingId, setEditingId] = useState(null);
  const [newStock, setNewStock] = useState('');
  const [alert, setAlert] = useState(''); // <-- alerta para duplicados

  const categories = ['Pegamento', 'Líquido', 'Productos de Limpieza'];

  // Cargar productos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Error cargando productos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);



  // Eliminar producto
  const handleDelete = async (id) => {
    await deleteProduct(id);
    setProducts((prev) => prev.filter((p) => p._id !== id));
  };

  // Agregar producto
  const handleAddProduct = async (e) => {
    e.preventDefault();

    const exists = products.some(
      (p) =>
        p.name.trim().toLowerCase() === newProduct.name.trim().toLowerCase() &&
        p.category === newProduct.category
    );

    if (exists) {
      setAlert('⚠️ Este producto ya existe en el inventario.');
      setTimeout(() => setAlert(''), 3000); // desaparece en 3s
      return;
    }

    try {
      const added = await addProduct({
        name: newProduct.name,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        category: newProduct.category,
      });
      setProducts((prev) => [...prev, added]);
      setNewProduct({ name: '', price: '', stock: '', category: '' });
      setShowForm(false);
    } catch (error) {
      setAlert('❌ Error al agregar producto. Verifica los datos.');
      setTimeout(() => setAlert(''), 3000);
      console.error(error);
    }
  };

  // Guardar stock editado
  const handleSaveStock = async (id) => {
    const updated = { ...products.find((p) => p._id === id), stock: parseInt(newStock) };
    await updateProduct(id, updated);
    setProducts((prev) => prev.map((p) => (p._id === id ? updated : p)));
    setEditingId(null);
    setNewStock('');
  };

  // 🔍 Filtrar productos por nombre O categoría
  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      (p.category && p.category.toLowerCase().includes(query.toLowerCase()))
  );

  if (loading)
    return (
      <p className="text-center text-gray-500 text-lg mt-6 animate-pulse">
        Cargando productos...
      </p>
    );

  return (
    <div className="p-4 max-w-5xl mx-auto">
      {/* ALERTA */}
      {alert && (
        <div className="mb-4 p-3 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 rounded-md">
          {alert}
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">🧾 Inventario de Productos</h2>
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-all"
        >
          {showForm ? 'Cerrar Formulario' : 'Agregar Producto'}
        </button>
      </div>
      <div className="flex flex-col sm:flex-row items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Nombre, código o categoría"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Formulario */}
      {showForm && (
        <form
          onSubmit={handleAddProduct}
          className="bg-gray-50 p-4 rounded-lg shadow-md mb-6 space-y-3"
        >
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            >
              <option value="">Selecciona una categoría</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              placeholder="Nombre"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="number"
              step="0.01"
              placeholder="Precio"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={newProduct.stock}
              onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
              className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg shadow-md transition-all"
          >
            Guardar Producto
          </button>
        </form>
      )}

      {/* Tabla */}
      {filteredProducts.length === 0 ? (
        <p>No hay productos en el inventario.</p>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-h-[400px] max-h-[400px] overflow-y-auto">
            <table className="w-full border-collapse border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="py-3 px-4 text-left">Categoría</th>
                  <th className="py-3 px-4 text-left">Nombre</th>
                  <th className="py-3 px-4 text-left">Precio</th>
                  <th className="py-3 px-4 text-left">Stock</th>
                  <th className="py-3 px-4 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((p) => (
                    <tr key={p._id} className="border-t hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4">{p.category || '-'}</td>
                      <td className="py-3 px-4">{p.name}</td>
                      <td className="py-3 px-4">${p.price.toFixed(2)}</td>
                      <td className="py-3 px-4 text-center">
                        {editingId === p._id ? (
                          <input
                            type="number"
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-20 px-2 py-1 border rounded-lg text-center focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        ) : (
                          p.stock
                        )}
                      </td>
                      <td className="py-3 px-4 text-center space-x-2">
                        {editingId === p._id ? (
                          <button
                            onClick={() => handleSaveStock(p._id)}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm transition-all"
                          >
                            Guardar
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(p._id);
                              setNewStock(p.stock);
                            }}
                            className="bg-yellow-400 hover:bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm transition-all"
                          >
                            +
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="bg-red-400 hover:bg-red-500 text-white px-3 py-1 rounded-lg text-sm transition-all"
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-gray-500">
                      No hay productos que coincidan con el filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      )}
    </div>
  );
}
