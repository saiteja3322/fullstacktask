import dotenv from 'dotenv';
dotenv.config();

import app from './app.js';
import { connectDatabase } from './config/db.js';
import logger from './utils/logger.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDatabase();

  app.listen(PORT, () => {
    logger.info(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    logger.info(`📄 Swagger API docs available at http://localhost:${PORT}/api-docs`);
  });
};

startServer();
