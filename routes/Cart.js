const express = require('express');
const { fetchCartByUser, addToCart, updateCart, deleteItemFromCart } = require('../controller/Cart');
const router = express.Router();

router.get('/', fetchCartByUser)
    .post('/', addToCart)
    .patch('/:id', updateCart)
    .delete('/:id', deleteItemFromCart)

exports.router = router;