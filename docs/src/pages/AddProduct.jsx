import ProductForm from '../components/ProductForm';
import { addProduct } from '../api/inventoryService';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
  const navigate = useNavigate();

  const handleAddProduct = async (newProduct) => {
    try {
      await addProduct(newProduct);
      alert('✅ Producto agregado correctamente');
      navigate('/inventory'); // Redirige al inventario después de agregar
    } catch (error) {
      alert('⚠️ Error al agregar producto. Verifica los datos.');
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Agregar Nuevo Producto 📦</h1>
      <ProductForm onAdd={handleAddProduct} />
    </div>
  );
}

export default AddProduct;
