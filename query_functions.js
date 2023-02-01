// Function to log query results
export function executeQuery(params) {
  if (!params.full_query) params.full_query = false;
  const query = params.query;
  if (params.set) {
    params.connection.query(query, params.set, callbackFunction);
  } else {
    params.connection.query(query, callbackFunction);
  }

  // Callback Function
  function callbackFunction(error, result) {
    if (error) {
      // Formate error message conditionally
      logErrorMessage(error, query, params.full_query, params.set);
    } else {
      // Formate message conditionally
      logQueryResult(result, query, params.full_query, params.set);
    }
  }
}

// Function rendering error message
const logErrorMessage = (error, query, full_query, set = null) => {
  let message = `ERROR. Query `;
  if (full_query)
    message =
      message +
      indentString(
        `\n${set ? query.replace('?', `${Object.values(set)}`) : query}`,
        2,
      ) +
      `\n`;
  message += `execution failed, returned message: `;
  message += `${error.sqlMessage}`;
  message.replace('SET ?', `SET ${set}`);
  // Log the error message
  console.log(`${message}`);
  if (full_query) console.log(`\n`);
};

// Function rendering query result
const logQueryResult = (result, query, full_query, set = null) => {
  let message = `Query `;
  if (full_query)
    message =
      message +
      indentString(
        `\n${set ? query.replace('?', `${Object.values(set)}`) : query}`,
        2,
      ) +
      `\n`;
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
    if (result.affectedRows == null) {
      console.table(result);
    }
  }
  if (full_query || result.affectedRows == null) console.log(`\n`);
};

const indentString = (string, count, indent = ' ') =>
  string.replace(/^/gm, indent.repeat(count));
