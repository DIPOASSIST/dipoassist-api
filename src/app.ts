import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth/authRoutes';

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
