import mysql from 'mysql';
import executeQuery from '../../query_functions.js';

// Establish connection to the database
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'world',
});
connection.connect();

// Create list with objects containing questions and queries
const queries = [
  {
    question:
      '1. What are the names of countries with population greater than 8 million?',
    statement: `SELECT name FROM country WHERE population > 8000000`,
  },
  {
    question:
      '2. What are the names of countries that have “land” in their names?',
    statement: `SELECT name FROM country WHERE name LIKE '%land%'`,
  },
  {
    question:
      '3. What are the names of the cities with population in between 500,000 and 1 million?',
    statement: `SELECT name FROM city WHERE population BETWEEN 500000 AND 1000000`,
  },
  {
    question: `4. What's the name of all the countries on the continent Europe?`,
    statement: `SELECT name FROM country WHERE continent = 'Europe'`,
  },
  {
    question: `5. List all the countries in the descending order of their surface areas.`,
    statement: `SELECT name FROM country ORDER BY SurfaceArea DESC`,
  },
  {
    question: `6. What are the names of all the cities in the Netherlands?`,
    statement: `SELECT name FROM city WHERE CountryCode = 'NLD'`,
  },
  {
    question: `7. What is the population of Rotterdam?`,
    statement: `SELECT population FROM city WHERE name = 'Rotterdam'`,
  },
  {
    question: `8. What's the top 10 countries by Surface Area?`,
    statement: `SELECT name, SurfaceArea FROM country ORDER BY SurfaceArea DESC LIMIT 10`,
  },
  {
    question: `9. What's the top 10 most populated cities?`,
    statement: `SELECT name, population FROM city ORDER BY population DESC LIMIT 10`,
  },
  {
    question: `10. What is the population number of the world?`,
    statement: `SELECT SUM(population) AS Total FROM country`,
  },
];

// Clear console / terminal
process.stdout.write('\u001b[3J\u001b[2J\u001b[1J');
console.clear();

// Execute queries
queries.forEach((query) => executeQuery(query.statement, connection));

// Close connection
connection.end();
