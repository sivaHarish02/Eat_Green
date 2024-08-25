const express = require('express');
const Product = require('../model/Product');

// Get products by category
exports.getProduct = async (req, res) => {
    console.log("getProduct");

    try {
        const { category } = req.query;
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

