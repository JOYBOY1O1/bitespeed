import { DataSource } from 'typeorm';
import { Contact } from '../models/Contact';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'joy',
  password: 'password',
  database: 'bitespeed',
  synchronize: true,
  logging: true,
  entities: [Contact],
});
