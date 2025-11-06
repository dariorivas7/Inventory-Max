const Sale = require('../models/Sale');
const Product = require('../models/Product');

exports.createSale = async (req, res) => {
  const { items, total } = req.body;

  try {
    // 🔄 Actualiza stock de los productos
    for (const item of items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stock: -item.quantity } },
        { new: true }
      );
    }

    const sale = new Sale({ items, total });
    await sale.save();

    res.status(201).json(sale);
  } catch (error) {
    console.error('❌ Error al crear la venta:', error);
    res.status(400).json({ message: error.message });
  }
};

exports.getSales = async (req, res) => {
  try {
    const sales = await Sale.find().populate('items.productId', 'name category price');
    res.json(sales);
  } catch (error) {
    console.error('❌ Error al obtener ventas:', error);
    res.status(500).json({ message: error.message });
  }
};
