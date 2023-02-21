import { db as connection, execQuery } from '../../../db.js';

export function createTables() {
  const createQueries = [
    `
DROP DATABASE IF EXISTS transactions;
`,
    `
CREATE DATABASE IF NOT EXISTS transactions;
`,
    `
USE transactions;
`,
    `
CREATE TABLE IF NOT EXISTS account
(
  account_number INT AUTO_INCREMENT PRIMARY KEY,
  balance DECIMAL (15, 2)
);
`,
    `
CREATE TABLE IF NOT EXISTS account_changes
(
  change_number INT AUTO_INCREMENT PRIMARY KEY,
  account_number INT,
  amount DECIMAL (15, 2),
  changed_date DATETIME,
  remark VARCHAR(300),
  FOREIGN KEY (account_number) REFERENCES account (account_number)
);
`,
    `
ALTER TABLE account AUTO_INCREMENT = 100;
`,
  ];
  createQueries.forEach((query) =>
    execQuery({ query, connection, full_query: false }),
  );
}
