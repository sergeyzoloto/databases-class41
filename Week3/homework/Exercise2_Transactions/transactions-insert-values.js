import { db as connection, execAsyncQueries } from '../../../db.js';

export function insertValues() {
  const balances = [100000, 100000, 100000];

  execAsyncQueries({
    query: `INSERT INTO account(balance) VALUES (?)`,
    data: balances,
    connection,
    full_query: true,
  });
}
