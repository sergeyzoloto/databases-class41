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

async function execAsyncQueries(params) {
  try {
    const promises = params.data.map((element) =>
      execQuery({
        query: params.query,
        set: [element],
        connection: params.connection,
        full_query: params.full_query,
      }),
    );
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
}

export { db, execQuery, execBoundQuery, execAsyncQueries };
