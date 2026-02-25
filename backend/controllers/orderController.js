const Order = require("../models/Order");

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const order = await Order.create({
      customerName: req.body.customerName,
      customerEmail: req.body.customerEmail,
      items: req.body.items,
      totalAmount: Number(req.body.totalAmount),
    });

    res.status(201).json(order);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

// GET ALL ORDERS (Admin)
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE ORDER STATUS
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE ORDER
const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
};