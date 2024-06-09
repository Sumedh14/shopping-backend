const express = require('express');
const server = express();
const mongoose = require('mongoose');
const { createProduct } = require('./controller/Product');
const cors = require('cors');
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Category');
const brandRouter = require('./routes/Brand')


server.use(cors({
    exposedHeaders: ['X-Total_Count']
}))
server.use(express.json());


server.use('/products', productsRouter.router);
server.use('/categories', categoriesRouter.router);
server.use('/brand', brandRouter.router);


main().catch(err => console.log(err));

async function main () {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('database connected')
}

server.get('/', (req, res) => {
    res.json({ status: 'success' });
})

server.post('/products', createProduct)


server.listen(8081, () => {
    console.log('server started')
});