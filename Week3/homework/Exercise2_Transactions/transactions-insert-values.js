import { db as connection, execAsyncQueries } from '../../../db.js';

const balances = [100000, 100000, 100000];

connection.changeUser({ database: 'transactions' });
execAsyncQueries({
  query: `INSERT INTO account(balance) VALUES (?)`,
  data: balances,
  connection,
  full_query: true,
});
connection.end();
