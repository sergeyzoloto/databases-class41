/*
1. Create a table, called `authors`. Give it the following fields: `(author_id(Primary Key), author_name, university, date_of_birth, h_index, gender)`
2. Write a query that adds a column called `mentor` to `authors` table that references the column `author_id`.
   For integrity add a `foreign key` on this column.
*/

import mysql from 'mysql';
import executeQuery from '../../query_functions.js';

// Establish connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
});
db.connect();
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
  author_id INT PRIMARY KEY AUTO_INCREMENT,
  author_name VARCHAR(100)
);
`,
  `
INSERT INTO author (author_name) VALUES
  ('Priscilla Sherm')
;
`,
  `
SELECT * FROM authors
`,
];

// Execute queries
queries.forEach((query) => executeQuery(query, db, true));

// Close connection
db.end();
