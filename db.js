import mysql from 'mysql';
import { executeQuery } from './query_functions.js';
import util from 'util';

// Establish connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
});

const execQuery = util.promisify(executeQuery);
const execBoundQuery = util.promisify(db.query.bind(db));

export { db, execQuery, execBoundQuery };
