const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const cartSchema = new mongoose.Schema({
    product_id: { type: ObjectId, required: true },
    quantity: { type: Number, required: true },
    user_email: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
