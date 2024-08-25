const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    weight: String,
    rating: Number,
    quantity: Number,
    image: String,
    category: String,
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
