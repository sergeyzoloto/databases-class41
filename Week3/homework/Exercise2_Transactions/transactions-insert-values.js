import { db as connection, execQuery } from '../../../db.js';

export function insertValues() {
  const dataAccounts = [[10000], [10000], [10000]];

  const query = 'INSERT INTO account (balance) VALUES (?)';

  dataAccounts.forEach((amount) =>
    execQuery({ query, set: amount, connection, full_query: true }),
  );
}
