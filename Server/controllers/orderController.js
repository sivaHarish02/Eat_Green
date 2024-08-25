const Order = require('../model/Order');


exports.addOrder = async (req, res) => {
    try {
        console.log('Received order details:', req.body); // Log incoming data

        const { email, name, phoneNo, location, items, shippingCost, tax, total } = req.body;

        // Validate items array
        if (!items.every(item => item.itemId && item.quantity)) {
            return res.status(400).json({ message: 'Invalid items data' });
        }

        const newOrder = new Order({
            email,
            name,
            phoneNo,
            location,
            items,
            shippingCost,
            tax,
            total,
        });

        await newOrder.save();

        res.status(201).json({ message: 'Order created successfully!' });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const userEmail = req.query.email; // Assuming email is passed as a query parameter
        const orders = await Order.find({ email: userEmail }).populate('items.itemId');
        res.status(200).json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteOrder = async (req, res) => {
    console.log("deleteOrder");

    try {
        const orderId = req.params.id;

        // Find and delete the order
        const result = await Order.findByIdAndDelete(orderId);

        if (!result) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(500).json({ message: 'Error deleting order' });
    }
};
