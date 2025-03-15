import Express from "express";
// import Raven from 'raven';
import compression from "compression";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import chalk from "./chalk";

import userRoutes from './routes/user.routes.js';
import productRoutes from './routes/product.routes.js';
import orderRoutes from './routes/order.routes.js';
import adminRoutes from './routes/admin.routes.js';
import authRoutes from './routes/auth.routes.js';
import mainRoutes from './routes/main.routes.js';
import couponRoutes from './routes/coupon.routes.js';
import otpRoutes from './routes/otp.routes.js';
import cartRoutes from './routes/cart.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import reviewRoutes from './routes/review.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import wholesaleRoutes from './routes/wholesaleProducts.routes.js';

import config from './config.js';
import http from 'http';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from '../../swagger/swagger-output.json' with { type: 'json' };

const app = Express();
const port = process.env.PORT || 3000;
mongoose.Promise = global.Promise;

const server = http.createServer(app);

const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  poolSize: 50, // Maintain up to 50 socket connections
};

// MongoDB Connection
mongoose.connect(config.mongoURL);

mongoose.set('debug', false);

// Swagger UI generation
const swaggerOptions = {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'RBAC Docs',
  customfavIcon: 'https://spyne-test.s3.amazonaws.com/spyne-logo.png',
};

app.use(compression());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: false }));
app.use(cookieParser());
app.enable('trust proxy');

app.use('*', (req, res, next) => {
  const { hostname, originalUrl, protocol, method } = req;
  console.log(
    `${
      method === 'GET' ? chalk.getReq(method) : chalk.postReq(method)
    }  ${protocol}://${hostname}:${config.PORT}${originalUrl}`
  );
  next();
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Routes
app.use('/', mainRoutes);
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/product', productRoutes);
app.use('/api/v1/order', orderRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/coupon', couponRoutes);
app.use('/api/v1/otp', otpRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/payment',paymentRoutes);
app.use('/api/v1/review',reviewRoutes);
app.use('/api/v1/complaint',complaintRoutes);
app.use('/api/v1/wholesale',wholesaleRoutes);

app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDoc, swaggerOptions)
);

server.listen(config.PORT, (error) => {
  console.log(process.env.NODE_ENV);
  console.log(`Core API is running on port: ${config.PORT}!`);
});