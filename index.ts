import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './database/data-source';
import { identifyContact } from './controllers/contactController';

const app = express();
const port = 8000;

app.use(express.json());

app.post('/identify', identifyContact);

AppDataSource.initialize().then(() => {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}).catch(error => console.log(error));