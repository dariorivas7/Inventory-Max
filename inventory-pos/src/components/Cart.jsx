function Cart({ cart, removeFromCart, updateQuantity, total }) {
  return (
    <div>
      <h2>Carrito</h2>
      {cart.map(item => (
        <div key={item.id}>
          {item.name} - ${item.price} x 
          <input
            type="number"
            value={item.quantity}
            onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
          />
          <button onClick={() => removeFromCart(item.id)}>Eliminar</button>
        </div>
      ))}
      <h3>Total: ${total.toFixed(2)}</h3>
    </div>
  );
}

export default Cart;