import express, { Request, Response } from 'express';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler';
import authRoutes from './routes/auth/authRoutes';
import phraseRoutes from './routes/phrase/phraseRoute';
import phraseUrgencyRoutes from './routes/phrase/phraseUrgencyRoute';
import userRoutes from './routes/user/userRoutes';
import reportRoutes from './routes/report/reportRoute';
import deviceRoutes from './routes/devices/deviceRoute';
import wsRoutes from './routes/socket/wsRoute';
import scheduleRoutes from './routes/schedule/scheduleRoute';
import nakesRoutes from './routes/medical/medicalSummaryRoute';
import patientRoutes from './routes/patient/patientRoute';
import historyRoutes from './routes/history/historyRoute';
import { sendError, sendSuccess } from './helper/response';

const app = express();

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

// Default route
app.get('/', (req: Request, res: Response) => {
  sendSuccess(res, 200, 'Welcome to the DipoAssist API!', null);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/phrases', phraseRoutes);
app.use('/api/phrase-urgency', phraseUrgencyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/ws', wsRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/nakes', nakesRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/history', historyRoutes);

// Handle route not found
app.use((req: Request, res: Response) => {
  sendError(res, 404, 'Route not found', null);
});

// Global error handler
app.use(errorHandler);

export default app;
