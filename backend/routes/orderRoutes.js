import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Order from '../models/orderModel.js';
import User from '../models/userModel.js';
import Service from '../models/serviceModel.js';
import { isAuth, isAdmin } from '../utils.js';

const orderRouter = express.Router();

orderRouter.get('/', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const orders = await Order.find().populate('user', 'name');
  res.send(orders);
}));

orderRouter.post('/', expressAsyncHandler(async (req, res) => {
  try {
    // Update your backend data here with the received data
    // For example, updating service quantities based on the orderItems received
    await Promise.all(req.body.orderItems.map(async (item) => {
      const service = await Service.findById(item._id);
      if (service) {
        service.countInStock -= item.quantity;
        await service.save();
      }
    }));

    res.status(200).send({ message: 'Data updated successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
}));

export default orderRouter;