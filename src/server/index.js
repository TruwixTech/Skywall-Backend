import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import adminRoutes from './routes/admin.routes';
import authRoutes from './routes/auth.routes';
import config from './config';

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);

// Connect to MongoDB
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Failed to connect to MongoDB', err);
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});