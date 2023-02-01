/*
1. Create a table, called `authors`. Give it the following fields: `(author_id(Primary Key), author_name, university, date_of_birth, h_index, gender)`
2. Write a query that adds a column called `mentor` to `authors` table that references the column `author_id`.
   For integrity add a `foreign key` on this column.
*/
import { db as connection, execQuery } from './db.js';
const DB_NAME = 'authors';

// Create a list of queries
const queries = [
  `
DROP DATABASE IF EXISTS ${DB_NAME};
`,
  `
CREATE DATABASE IF NOT EXISTS ${DB_NAME};
`,
  `
USE ${DB_NAME};
`,
  `
CREATE TABLE IF NOT EXISTS authors (
  author_id INT PRIMARY KEY,
  author_name VARCHAR(100),
  university VARCHAR(100),
  date_of_birth DATE,
  h_index INT,
  gender VARCHAR(20)
);
`,
  `
ALTER TABLE authors
  ADD mentor INT NULL,
  ADD CONSTRAINT FOREIGN KEY (mentor) REFERENCES authors(author_id)
    ON DELETE CASCADE ON UPDATE CASCADE
;
`,
];

// Execute queries
connection.connect();
queries.forEach((query) => execQuery({ query, connection, full_query: false }));

// Close connection
connection.end();
