import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';

const app: Application = express();

let port = 3000;

if (process.env.ENV === 'test') {
  port = 3001;
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

app.listen(port);

export default app;
