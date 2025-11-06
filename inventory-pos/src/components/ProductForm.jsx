import { useState } from 'react';

function ProductForm({ onAdd }) {
  const [product, setProduct] = useState({
    name: '',
    price: '',
    stock: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product.name ||  !product.price || !product.stock) {
      alert('Por favor completa todos los campos.');
      return;
    }

    const newProduct = {
      ...product,
      price: Number(product.price),
      stock: Number(product.stock),
    };

    onAdd(newProduct);
    setProduct({ name: '',  price: '', stock: '' });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        marginBottom: '30px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
      }}
    >
      <h3>Agregar Nuevo Producto</h3>

      <input
        type="text"
        name="name"
        placeholder="Nombre del producto"
        value={product.name}
        onChange={handleChange}
      />

      <input
        type="number"
        name="price"
        placeholder="Precio"
        value={product.price}
        onChange={handleChange}
      />
      <input
        type="number"
        name="stock"
        placeholder="Stock"
        value={product.stock}
        onChange={handleChange}
      />

      <button type="submit" style={{ padding: '8px', cursor: 'pointer' }}>
        Agregar Producto
      </button>
    </form>
  );
}

export default ProductForm;
