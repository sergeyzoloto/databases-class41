// Function to log query results
export default function executeQuery(query, db, full_query = false) {
  db.query(query, (error, result) => {
    if (error) {
      // Formate error message conditionally
      logErrorMessage(error, query, full_query);
    } else {
      // Formate message conditionally
      logQueryResult(result, query, full_query);
    }
  });
}

// Function rendering error message
const logErrorMessage = (error, query, full_query) => {
  let message = `ERROR. Query `;
  if (full_query) message = message + indentString(`\n${query}`, 2) + `\n`;
  message += `execution failed, returned message: `;
  message += `${error.sqlMessage}`;
  // Log the error message
  console.log(`${message}`);
  if (full_query) console.log(`\n\n`);
};

// Function rendering query result
const logQueryResult = (result, query, full_query) => {
  let message = `Query `;
  if (full_query) message = message + indentString(`\n${query}`, 2) + `\n`;
  message += `executed.`;
  if (typeof result.affectedRows === 'number') {
    message += ` ${result.affectedRows} rows affected`;
    // Log the query status message
    console.log(message);
  } else {
    message += ` Results:\n`;
    // Log the query status message
    console.log(message);
    // Log the query results
    if (result.affectedRows == null) console.table(result);
  }
  if (full_query) console.log(`\n`);
};

const indentString = (string, count, indent = ' ') =>
  string.replace(/^/gm, indent.repeat(count));
