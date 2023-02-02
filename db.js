import mysql from 'mysql';
import { executeQuery } from './query_functions.js';
import util from 'util';

// Establish connection to the database
export const db = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
});

export const execQuery = util.promisify(executeQuery);
