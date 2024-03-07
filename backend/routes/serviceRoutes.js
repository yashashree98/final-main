import express, { query } from 'express';
import Service from '../models/serviceModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';

const serviceRouter = express.Router();

serviceRouter.get('/', async (req, res) => {
    const services = await Service.find();
    res.send(services);
});

serviceRouter.post('/addservice', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
    try {
        const { name, slug, image, price, countInStock, description } = req.body;

        const newService = new Service({
            name,
            slug,
            image,
            price,
            countInStock,
            description
        });

        const service = await newService.save();
        res.status(201).send({ message: 'Service Created', service });
    } catch (err) {
        //console.log(err)
        res.status(400).send({ message: 'Error creating service', error: err.message });
    }
}));

const PAGE_SIZE = 3;

function verifyToken(req, resp, next) 
{
    next();
}

serviceRouter.get('/admin', expressAsyncHandler(async (req, res) => {
      const { query } = req;
      const page = query.page || 1;
      const pageSize = query.pageSize || PAGE_SIZE;

      const services = await Service.find()
        .skip(pageSize * (page - 1))
        .limit(pageSize);
      const countService = await Service.countDocuments();
      res.send({ services, countService, page, pages: Math.ceil(countService / pageSize), });
    })
  );

serviceRouter.put('/:id', expressAsyncHandler( async (req, res) => {     //Update
    try {
    console.log("I am here update");
    const serviceId = req.params.id;
    console.log(serviceId);
    const service = await Service.findById(serviceId);
    console.log(serviceId);
    if(service)
    {
        service.name = req.body.name;
        service.slug = req.body.slug;
        service.image = req.body.image;
        service.price = req.body.price;
        service.description = req.body.description;
        service.countInStock = req.body.countInStock;

        await service.save();
        res.status(200).send({ message: 'Service Updated' });
    } else {
        res.sendStatus(404);
    } 
    } catch (err)
    {
        res.status(500).send(err);
    }
    }));


serviceRouter.delete('/:id' ,isAuth, isAdmin, expressAsyncHandler(async (req, res) => {    //Delete
    const service = await Service.findById(req.params.id); 
    if (service)
    {
        await service.deleteOne();
        res.status(200).send({ message: 'Service Deleted' });
    } else {
        res.sendStatus(404);
    }}));
  

serviceRouter.get('/search', expressAsyncHandler( async(req, res) => {
    const { query } = req;
    const pageSize = query.pageSize || PAGE_SIZE;
    const page = query.page || 1;
    const name = query.name || '';
    const price = query.price || '';
    const searchQuery = query.query || '';

    const queryFilter = searchQuery && searchQuery !== 'all' ? {
        name: {
            $regex: searchQuery,
            $options: 'i',
        },
    } : {};

    const nameFilter = name && name !== 'all' ? { name } : {};

    const priceFilter = price && price !== 'all' ? { price: {
        $gte: Number(price.split('-')[0]),
        $lte: Number(price.split('-')[1]),
       },
    } : {};

    const services = await Service.find(
        {
            ...queryFilter,
            ...nameFilter,
            ...priceFilter,
        }).skip(pageSize * (page - 1)).limit(pageSize);

        const countServices = await Service.countDocuments({
            ...queryFilter,
            ...nameFilter,
            ...priceFilter
        });

        res.send({
            services,
            countServices,
            page,
            pages: Math.ceil(countServices / pageSize),
        });
     })
);

serviceRouter.get('/slug/:slug', async (req, res) => {
    const service = await Service.findOne({slug:req.params.slug});
    if(service) 
    {
        res.send(service);
    }
    else {
        res.sendStatus(404).send({ message: 'Service Not Found' });
    }
});

serviceRouter.get('/:id', async (req, res) => {
    //console.log("I am here");
    const service = await Service.findById(req.params.id);
    if(service) 
    {
        res.send(service);
    }
    else {
        res.sendStatus(404).send({ message: 'Service Not Found' });
    }
});


export default serviceRouter;