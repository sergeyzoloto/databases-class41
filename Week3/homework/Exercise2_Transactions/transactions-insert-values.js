import { db as connection, execQuery } from '../../../db.js';

export function insertValues() {
  const queries = [
    `INSERT INTO account(balance) VALUES (10000)`,
    `INSERT INTO account(balance) VALUES (10000)`,
    `INSERT INTO account(balance) VALUES (10000)`,
  ];

  queries.forEach((query) => {
    execQuery({ query, connection, full_query: false });
  });
}
