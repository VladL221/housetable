import http from 'http';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import logging from './config/logging';
import config from './config/config';
import patientRoutes from './routes/patient';
import appointmentRoutes from './routes/appointment';

const NAMESPACE = 'Server';
const router = express();

// connect to mongo
mongoose
  .connect(config.mongo.localurltesting, config.mongo.options)
  .then((result) => {
    logging.info(NAMESPACE, 'Connected to mongodb!!');
  })
  .catch((error) => {
    logging.error(NAMESPACE, error.message, error);
  });

// Logging the request
router.use((req, res, next) => {
  logging.info(
    NAMESPACE,
    `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}]`,
  );
  res.on('finish', () => {
    logging.info(
      NAMESPACE,
      `METHOD - [${req.method}], URL - [${req.url}], IP - [${req.socket.remoteAddress}], STATUS - [${res.statusCode}]`,
    );
  });
  next();
});

// Parse the request
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// Rules of the API
// DO NOT USE THE WILD CARD IN PRODUCTION PRE DEFINE THE IP ROUTES!
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );

  if (req.method == 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST PUT');
    return res.status(200).json({});
  }
  next();
});

// Routes

router.use('/api/patient', patientRoutes);
router.use('/api/appointment', appointmentRoutes);

// Error Handling
router.use((req, res, next) => {
  const error = new Error('not found');

  return res.status(404).json({
    message: error.message,
  });
});

// The server
const httpServer = http.createServer(router);
httpServer.listen(config.server.port, () => {
  logging.info(
    NAMESPACE,
    `Server running on ${config.server.hostname}:${config.server.port}`,
  );
});

export default { router, httpServer };
