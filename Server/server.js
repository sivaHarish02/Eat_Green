// server.js
const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./db/db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require("./routes/ProductRoutes")
const cartRoutes = require('./routes/cartRoutes');
const favoriteRoutes = require('./routes/favoritesRoutes');
const orderRoutes = require("./routes/orderRoutes")
const bodyParser = require('body-parser');
const cors = require('cors')
dotenv.config();
connectDB();
const app = express();

// Use body-parser middleware
app.use(bodyParser.json()); // Parse application/json
app.use(bodyParser.urlencoded({ extended: true })); // Parse application/x-www-form-urlencoded
app.use(cors());

app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/favorites', favoriteRoutes);
app.use('/', orderRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
