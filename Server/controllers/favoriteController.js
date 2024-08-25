const mongoose = require('mongoose');
const Favorites = require('../model/Favorite');
const Product = require('../model/Product');

exports.addFavorite = async (req, res) => {
    const { productId, email, isFavorite } = req.body;
    console.log(productId, email, isFavorite);

    try {
        if (isFavorite) {
            // Remove the product from favorites
            await Favorites.deleteOne({ product_id: productId, user_email: email });
            res.status(200).json({ message: 'Removed from favorites', favorite: false });
        } else {
            // Check if the product is already in favorites
            const existingFavorite = await Favorites.findOne({ product_id: productId, user_email: email });

            if (existingFavorite) {
                // If the product is already a favorite, return a message
                res.status(200).json({ message: 'Product is already in favorites', favorite: true });
            } else {
                // Add the product to favorites
                const favorite = new Favorites({
                    product_id: productId,
                    user_email: email,
                });
                await favorite.save();
                res.status(200).json({ message: 'Added to favorites', favorite: true });
            }
        }
    } catch (error) {
        console.error('Error updating favorites:', error);
        res.status(500).json({ message: 'Failed to update favorites' });
    }
};



exports.getToFavorite = async (req, res) => {
    console.log('userEmail');
    try {
        const userEmail = req.query.email; // Assuming you send the user's email in the query params
        console.log(userEmail);

        // Aggregate to join the Favorite and Product collections
        const favoriteItems = await Favorites.aggregate([
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
                    user_email: 1,
                    created_at: 1,
                    'productDetails._id': 1, // Ensure the productDetails _id is included
                    'productDetails.name': 1,
                    'productDetails.price': 1,
                    'productDetails.weight': 1,
                    'productDetails.image': 1,
                    'productDetails.rating': 1,
                }
            }
        ]);

        res.json(favoriteItems);
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
};

exports.deletefavoriteItems = async (req, res) => {
    const { _id } = req.body;

    try {
        const favoriteItems = await Favorites.findByIdAndDelete(_id);

        if (!favoriteItems) {
            return res.status(404).json({ message: 'Cart item not found' });
        }

        res.json({ message: 'Item deleted successfully' });
    } catch (error) {
        console.error('Error deleting cart item:', error);
        res.status(500).json({ message: 'Server error' });
    }
};