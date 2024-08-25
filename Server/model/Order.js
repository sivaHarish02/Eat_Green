const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const orderSchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true },
    phoneNo: { type: String, required: true },
    location: { type: String, required: true },
    items: [
        {
            itemId: { type: ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
        }
    ],
    shippingCost: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
