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
        full_query: false,
      }),
    );
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
}
async function execQueries(params) {
  try {
    const promises = params.data.map((element) =>
      execQuery({
        query: element,
        connection,
        full_query: false,
      }),
    );
    await Promise.all(promises);
  } catch (error) {
    console.log(error);
  }
}

async function createTables() {
  const queries = [
    `
DROP TABLE IF EXISTS authors_papers;
`,
    `
DROP TABLE IF EXISTS research_papers;
`,
    `
CREATE TABLE IF NOT EXISTS research_papers
(
  paper_id INT PRIMARY KEY,
  paper_title VARCHAR(255),
  conference VARCHAR(255),
  publish_date DATE
);
`,
    `
CREATE TABLE IF NOT EXISTS authors_papers
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
DELETE FROM research_papers;
`,
    `
DELETE FROM authors_papers;
`,
    `
DELETE FROM authors;
`,
  ];
  await execQueries({ data: queries });
}
async function insertPapers() {
  const papers = loadJSON('/papers.json');
  await execInsert({ data: papers, table: 'research_papers' });
}
async function insertAuthors() {
  const authors = loadJSON('/authors.json');
  await execInsert({ data: authors, table: 'authors' });
}
async function insertRelations() {
  const authors_papers = loadJSON('/authors_papers.json');
  await execInsert({ data: authors_papers, table: 'authors_papers' });
}

const loadJSON = (fileName) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  return JSON.parse(fs.readFileSync(__dirname + fileName, 'utf8'));
};

connection.changeUser({ database: 'authors' });
createTables();
insertAuthors();
insertPapers();
insertRelations();
connection.end();
