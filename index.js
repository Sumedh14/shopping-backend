const express = require('express');
const server = express();
const mongoose = require('mongoose');
const cors = require('cors');
const productsRouter = require('./routes/Products');
const categoriesRouter = require('./routes/Category');
const brandRouter = require('./routes/Brand');
const userRouter = require('./routes/User');
const authRouter = require('./routes/Auth');
const cartRouter = require('./routes/Cart');
const ordersRouter = require('./routes/Order');


server.use(cors({
    exposedHeaders: ['X-Total_Count']
}))
server.use(express.json());


server.use('/products', productsRouter.router);
server.use('/categories', categoriesRouter.router);
server.use('/brand', brandRouter.router);
server.use('/users', userRouter.router);
server.use('/auth', authRouter.router);
server.use('/cart', cartRouter.router);
server.use('/orders', ordersRouter.router)

main().catch(err => console.log(err));

async function main () {
    await mongoose.connect('mongodb://127.0.0.1:27017/ecommerce');
    console.log('database connected');
}

server.listen(8081, () => {
    console.log('server started')
});