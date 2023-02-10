import mysql from 'mysql';

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
  database: 'world',
});

function getPopulation(Country, name, code, cb) {
  // assuming that connection to the database is established and stored as conn
  conn.query(
    `SELECT Population FROM ${Country} WHERE Name = "${name}" and code = "${code}"`,
    function (err, result) {
      if (err) cb(err);
      if (result.length == 0) cb(new Error('Not found'));
      cb(result);
    },
  );
}

conn.connect();
getPopulation('country', '" OR "1"="1', '" OR "1"="1', console.log);
conn.end();
