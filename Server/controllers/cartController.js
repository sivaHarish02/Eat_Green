const express = require('express');
const Product = require('../model/Product'); // Adjust the path as necessary

const Cart = require('../model/cart')


exports.addToCart = async (req, res) => {
    const { productId, quantity, email } = req.body;

    try {
        // Check if the product is already in the cart for the given email
        const existingCartItem = await Cart.findOne({ product_id: productId, user_email: email });

        if (existingCartItem) {
            // If the product is already in the cart, return a message indicating this
            return res.status(400).json({ message: 'Product is already in the cart' });
        }

        // If not, add the product to the cart
        const cartItem = new Cart({
            product_id: productId,
            quantity,
            user_email: email,
        });

        await cartItem.save();
        return res.status(200).json({ message: 'Product added to cart' });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        return res.status(500).json({ message: 'Failed to add product to cart' });
    }
};



exports.getToCart = async (req, res) => {
    try {
        const userEmail = req.query.email; // Assuming you send the user's email in the query params

        // Aggregate to join the Cart and Product collections
        const cartItems = await Cart.aggregate([
            { $match: { user_email: userEmail } },
            {
                $lookup: {
                    from: 'products', // Collection name (should be 'products' as MongoDB uses plural form by default)
                    localField: 'product_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' }, // Unwind the productDetails array
            {
                $project: {
                    _id: 1,
                    quantity: 1,
                    user_email: 1,
                    created_at: 1,
                    'productDetails._id': 1, // Ensure the productDetails _id is included
                    'productDetails.name': 1,
                    'productDetails.price': 1,
                    'productDetails.weight': 1,
                    'productDetails.image': 1,
                }
            }
        ]);

        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};


exports.updateCart = async (req, res) => {
    const { _id, quantity } = req.body;
    console.log(_id, quantity);


    try {
        const cartItem = await Cart.findByIdAndUpdate(
            _id,
            { quantity },
            { new: true }
        );

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json(cartItem);
    } catch (error) {
        console.error('Error updating cart item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.deleteCartItem = async (req, res) => {
    const { _id } = req.body;

    try {
        const cartItem = await Cart.findByIdAndDelete(_id);

        if (!cartItem) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};