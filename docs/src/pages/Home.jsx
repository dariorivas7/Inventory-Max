import { useEffect, useState } from 'react';
import ProductSearch from '../components/ProductSearch';
import { createSale } from '../api/saleService';

export default function Home() {
  const [cart, setCart] = useState([]);

  //Almacenamiento de LocalStorage
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);


  const handleAddToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      if (existing) {
        return prev.map((p) =>
          p._id === product._id
            ? {
              ...p,
              quantity: p.quantity + 1,
              subtotal: (p.quantity + 1) * p.price,
            }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1, subtotal: product.price }];
    });
  };

  const total = cart.reduce((acc, p) => acc + p.subtotal, 0);

  const handleConfirmSale = async () => {
    if (cart.length === 0) return alert('El carrito está vacío.');
    if (!window.confirm('¿Deseas confirmar la venta?')) return;

    try {
      const saleData = {
        items: cart.map((p) => ({
          productId: p._id,
          name: p.name,
          category: p.category || 'Sin categoría',
          quantity: p.quantity,
          price: p.price,
          subtotal: p.subtotal,
        })),
        total,
      };

      console.log('SaleData:', saleData);

      await createSale(saleData);
      alert('✅ Venta registrada correctamente.');
      setCart([]);
      localStorage.removeItem('cart');
    } catch (error) {
      console.error('Error registrando venta:', error);
      alert('❌ Hubo un error al registrar la venta.');
    }
  };


  //Eliminar prducto del carrito
  const handleRemoveFromCart = (id) => {
    setCart((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-8 p-6">
      <div>
        <ProductSearch onAddToCart={handleAddToCart} />
      </div>

      {/* Carrito */}
      <div className="bg-white p-6 rounded-2xl shadow-md h-fit">
        <h2 className="text-xl font-bold mb-4">🛒 Carrito</h2>

        <div className="min-h-[200px] max-h-[300px] overflow-y-auto border border-gray-200 rounded-lg mb-4">
          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-16">No hay productos en el carrito.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="p-2 text-left">Producto</th>
                  <th className="p-2 text-left">Categoría</th>
                  <th className="p-2 text-center">Cantidad</th>
                  <th className="p-2 text-right">Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item) => (
                  <tr key={item._id} className="border-t">
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.category || 'Sin categoría'}</td>
                    <td className="p-2 text-center">{item.quantity}</td>
                    <td className="p-2 text-right">${item.subtotal.toFixed(2)}</td>
                    <td className="p-2 text-right">
                      <button
                        onClick={() => handleRemoveFromCart(item._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <p className="font-semibold text-right mb-4">Total: ${total.toFixed(2)}</p>
        <button
          onClick={handleConfirmSale}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition-all"
        >
          Confirmar Venta
        </button>
      </div>
    </div>
  );
}
