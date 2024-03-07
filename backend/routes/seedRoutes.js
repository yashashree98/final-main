import express from 'express';
import Service from '../models/serviceModel.js';
import db from '../db.js';
import User from '../models/userModel.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req, res) => {
    await Service.deleteMany({});
    const createdServices = await Service.insertMany(db.services);
    //res.send({ createdServices });

    await User.deleteMany({});
    const createdUsers = await User.insertMany(db.users);
    const responseData = { createdUsers, createdServices}
    res.send(responseData);

});

export default seedRouter;