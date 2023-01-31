/*
1. Create a table, called `authors`. Give it the following fields: `(author_id(Primary Key), author_name, university, date_of_birth, h_index, gender)`
2. Write a query that adds a column called `mentor` to `authors` table that references the column `author_id`.
   For integrity add a `foreign key` on this column.
*/

import mysql from 'mysql';

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

// Function to log query results
const executeQuery = (query, console_flag = false) => {
  db.query(query, (error, result) => {
    if (error) {
      // Formate error message conditionally
      consoleErrorMessage(error, query, console_flag);
    } else {
      // Formate message conditionally
      consoleQueryResult(result, query, console_flag);
    }
  });
};

// Function rendering error message
const consoleErrorMessage = (error, query, console_flag) => {
  let message = `ERROR. Query`;
  if (console_flag) message = message + indentString(`\n${query}`, 2) + `\n`;
  message += `execution failed, returned message: `;
  message += `${error.sqlMessage}`;
  // Log the error message
  console.error(`${message}\n\n`);
};

// Function rendering query result
const consoleQueryResult = (result, query, console_flag) => {
  let message = `Query`;
  if (console_flag) message = message + indentString(`\n${query}`, 2) + `\n`;
  message += `executed.`;
  if (typeof result.affectedRows === 'number') {
    message += ` ${result.affectedRows} rows affected`;
  } else {
    message += ` Results:`;
  }
  // Log the query status message
  console.log(message);
  // Log the query results
  if (result.affectedRows == null) console.table(result);
  console.log(`\n`);
};

const indentString = (string, count, indent = ' ') =>
  string.replace(/^/gm, indent.repeat(count));

// Execute queries
queries.forEach((query) => executeQuery(query, true));

// Close connection
db.end();
