/*
1. Write a query that prints names of all `authors` and their corresponding `mentors`.
2. Write a query that prints all columns of `authors` and their published `paper_title`.
   If there is an author without any `research_Papers`, print the information of that `author` too.
*/

import { db as connection, execQuery } from '../../db.js';

const queries = [
  `
SELECT
  a1.author_name,
  a2.author_name AS mentor
FROM authors AS a1
LEFT JOIN authors AS a2
  ON a2.author_id = a1.mentor
WHERE a1.mentor IS NOT NULL;
`,
  `
SELECT
  authors.*,
  paper_title
FROM authors
LEFT JOIN authors_papers
  ON authors.author_id = authors_papers.author_id
LEFT JOIN research_papers
  ON authors_papers.paper_id = research_papers.paper_id
`,
];

// Execute queries
connection.changeUser({ database: 'authors' });
queries.forEach((query) => execQuery({ query, connection, full_query: false }));

// Close connection
connection.end();
