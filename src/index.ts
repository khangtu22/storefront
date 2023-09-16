import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import { configureRoutes } from './routes';
import { errorHandler } from './middlewares/errorHandler';
import express, { Application, Request, Response } from 'express';

const app: Application = express();

const corsOptions = {
  origin: true,
  methods: 'GET, POST, PUT, DELETE',
  allowedHeaders:
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(errorHandler);
app.use(morgan('dev'));

let port = 3000;

if (process.env.ENV === 'test') {
  port = 3001;
}
configureRoutes(app);

app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port);

export default app;
