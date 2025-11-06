const Product = require('../models/Product');

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addProduct = async (req, res) => {
  const { category, name, price, stock } = req.body;
  const product = new Product({ category,name, price, stock });
  try {
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.findProduct = async (req, res) => {
  const { query } = req.params;
  try {
    const product = await Product.findOne({
      $or: [{ name: new RegExp(query, 'i') }, { barcode: query }],
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};