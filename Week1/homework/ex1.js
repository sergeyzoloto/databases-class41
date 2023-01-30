import mysql from 'mysql';

// Establish connection to the database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'hyfuser',
  password: 'hyfpassword',
});
db.connect();
const DB_NAME = 'meetup';

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
CREATE TABLE IF NOT EXISTS Invitee (
  invitee_no INT PRIMARY KEY AUTO_INCREMENT,
  invitee_name VARCHAR(100) NOT NULL,
  invited_by INT,
  FOREIGN KEY FK_Invitee_Invitee (invited_by) REFERENCES Invitee (invitee_no)
);
  `,
  `
CREATE TABLE if not exists Room (
  room_no INT PRIMARY KEY AUTO_INCREMENT, 
  room_name VARCHAR(100), 
  floor_number INT NOT NULL
);
  `,
  `
CREATE TABLE if not exists Meeting (
  meeting_no INT PRIMARY KEY AUTO_INCREMENT,
  meeting_title TEXT,
  starting_time TIMESTAMP NOT NULL,
  ending_time TIMESTAMP NOT NULL,
  room_no int NOT NULL,
  FOREIGN KEY (room_no) REFERENCES Room(room_no) 
);
  `,
  `
INSERT INTO Invitee (invitee_name, invited_by) VALUES
  ('Camella Eben', NULL),
  ('Luciana Sigismund', 1),
  ('Becki Gio', 2),
  ('Vanda Norah', 1),
  ('Priscilla Sherm', 3)
;
`,
  `
INSERT INTO Room (room_name, floor_number) VALUES
  ('Alfa', 2),
  ('Beta', 3),
  ('Sigma', 3),
  ('Omega', 4),
  ('Gamma', 3)
;
`,
  `
INSERT INTO Meeting (meeting_title, starting_time, ending_time, room_no) VALUES
  ('Stand-up meeting', '2023-02-01 10:00:00', '2023-02-01 11:00:00', 1),
  ('Product Presentation', '2023-02-01 13:00:00', '2023-02-01 14:00:00', 2),
  ('Board Meeting', '2023-02-01 12:30:00', '2023-02-01 13:00:00', 1),
  ('Interview', '2023-02-01 15:00:00', '2023-02-01 15:45:00', 5),
  ('Stand-up meeting', '2023-02-02 09:00:00', '2023-02-02 09:30:00', 5)
;
`,
];

const executeQuery = (query, console_flag = false) => {
  db.query(query, (error, result) => {
    if (error) {
      // Formate error message conditionally
      console.log(`ERROR. Query ${
        console_flag
          ? `
${query}
`
          : ``
      }execution failed, returned message:

${error.sqlMessage}
`);
    } else {
      // Formate message conditionally
      const MESSAGE = `Query ${
        console_flag
          ? `
${query}
`
          : ``
      }executed. Affected rows: ${result.affectedRows}
`;
      console.log(MESSAGE);
    }
  });
};

queries.forEach((query) => executeQuery(query));
db.end();
