/*
Write some queries to retrieve the following rows:

1. All research papers and the number of authors that wrote that paper.
2. Sum of the research papers published by all female authors.
3. Average of the h-index of all authors per university.
4. Sum of the research papers of the authors per university.
5. Minimum and maximum of the h-index of all authors per university.
*/

import { db as connection, execQuery } from '../../db.js';

const queries = [
  `
SELECT DISTINCT
  paper_title,
  count(authors.author_id) AS authors_qnt
FROM  authors_papers
LEFT JOIN authors
  ON authors.author_id = authors_papers.author_id
LEFT JOIN research_papers
  ON research_papers.paper_id = authors_papers.paper_id
GROUP BY paper_title;
  `,
  `
SELECT
  COUNT(DISTINCT paper_title) AS papers_by_females
FROM authors_papers
JOIN authors
  ON authors.author_id = authors_papers.author_id
JOIN research_papers
  ON research_papers.paper_id = authors_papers.paper_id
WHERE gender = "female"
`,
  `
SELECT university, AVG(h_index)
FROM authors                       
GROUP BY university;
`,
  `
SELECT university, count(DISTINCT paper_title) AS papers_qnt
FROM authors_papers
JOIN authors
  ON authors.author_id = authors_papers.author_id
JOIN research_papers
  ON research_papers.paper_id = authors_papers.paper_id
GROUP BY university
`,
  `
SELECT university, MIN(h_index), MAX(h_index)
FROM authors
GROUP BY university;
`,
];

// Execute queries
connection.changeUser({ database: 'authors' });
queries.forEach((query) => execQuery({ query, connection, full_query: false }));

// Close connection
connection.end();
