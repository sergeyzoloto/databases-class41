/*
1. Create another table, called `research_Papers` with the following fields: `(paper_id, paper_title, conference, publish_date, ...)`
2. What is the relationship between Authors and Research papers ? Make necessary changes to `authors` and
   `research_Papers` tables and add more tables if necessary.
3. Read exercises 3 and 4 and then add information (insert rows) of 15 authors and 30 research papers such that
   all queries in the exercises 3 and 4 will return some answers
*/

import { db as connection, execQuery } from './db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

async function execInsert(params) {
  try {
    const promises = params.data.map((element) =>
      execQuery({
        query: `INSERT INTO ${params.table} SET ?`,
        set: element,
        connection,
        full_query: true,
      }),
    );
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
}

async function seedDatabase() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const loadJSON = (fileName) =>
    JSON.parse(fs.readFileSync(__dirname + fileName, 'utf8'));
  const authors = loadJSON('/authors.json');
  const papers = loadJSON('/papers.json');

  const queries = [
    `
DROP TABLE IF EXISTS research_Papers;
`,
    `
DROP TABLE IF EXISTS authors_Papers;
`,
    `
CREATE TABLE IF NOT EXISTS research_Papers
(
  paper_id INT PRIMARY KEY AUTO_INCREMENT,
  paper_title VARCHAR(255),
  conference VARCHAR(255),
  publish_date DATE
);
`,
    `
CREATE TABLE IF NOT EXISTS authors_Papers
(
  author_id INT,
  paper_id INT,
  PRIMARY KEY (author_id, paper_id),
  FOREIGN KEY (author_id) REFERENCES authors (author_id)
    ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (paper_id) REFERENCES research_Papers (paper_id)
    ON DELETE CASCADE ON UPDATE CASCADE
);
`,
    `
DELETE FROM research_Papers;
`,
    `
DELETE FROM authors_Papers;
`,
    `
DELETE FROM authors;
`,
  ];
  queries.forEach((query) =>
    execQuery({ query, connection, full_query: true }),
  );
  await execInsert({ data: authors, table: 'authors' });
  await execInsert({ data: papers, table: 'research_Papers' });
}

connection.changeUser({ database: 'authors' });
//connection.connect();
seedDatabase();
connection.end();
