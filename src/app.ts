import express from 'express';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth/authRoutes';
import authAdminRoutes from './routes/auth/admin/authAdminRoutes';
import authMedicalRoutes from './routes/auth/medical/authMedicalRoute';
import phraseRoutes from './routes/phrase/phraseRoute';
import phraseUrgencyRoutes from './routes/phrase/phraseUrgencyRoute';

const app = express();

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/auth', authAdminRoutes);
app.use('/api/auth', authMedicalRoutes);
app.use('/api/phrases', phraseRoutes);
app.use('/api/phrase-urgency', phraseUrgencyRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
