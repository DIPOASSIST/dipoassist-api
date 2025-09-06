import express from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth/authRoutes';
import phraseRoutes from './routes/phrase/phraseRoute';
import phraseUrgencyRoutes from './routes/phrase/phraseUrgencyRoute';
import userRoutes from './routes/user/userRoutes';
import reportRoutes from './routes/report/reportRoute';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/phrases', phraseRoutes);
app.use('/api/phrase-urgency', phraseUrgencyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Global error handler
app.use(errorHandler);

export default app;
