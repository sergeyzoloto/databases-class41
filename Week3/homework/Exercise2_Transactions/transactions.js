import { db as connection, execBoundQuery } from '../../../db.js';
import { insertValues } from './transactions-insert-values.js';
import { createTables } from './transactions-create-tables.js';

async function transfer(sourceId, targetId, amount) {
  try {
    // check source account money sufficiency
    const sourceRow = await execBoundQuery(
      `SELECT balance FROM account WHERE account_number = ?`,
      [sourceId],
    );
    const sourceAmount = await JSON.parse(JSON.stringify(sourceRow))[0].balance;
    if (sourceAmount >= amount) {
      const targetRow = await execBoundQuery(
        `SELECT balance FROM account WHERE account_number = ?`,
        [targetId],
      );
      const targetAmount = await JSON.parse(JSON.stringify(targetRow))[0]
        .balance;
      const today = new Date();
      await execBoundQuery('START TRANSACTION');
      // update source account amount
      await execBoundQuery(
        'UPDATE account SET balance = ? WHERE account_number = ?',
        [sourceAmount - amount, sourceId],
      );
      // update target account amount
      await execBoundQuery(
        'UPDATE account SET balance = ? WHERE account_number = ?',
        [targetAmount + amount, targetId],
      );
      // insert details into account_changes table
      await execBoundQuery(
        'INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES (?)',
        [[sourceId, -amount, today, `${amount} sent to ID ${targetId}`]],
      );
      await execBoundQuery(
        'INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES (?)',
        [[targetId, amount, today, `${amount} received from ID ${sourceId}`]],
      );
      // commit transaction
      await execBoundQuery('COMMIT');
    } else {
      console.log('Insufficient sum on the source account!');
    }
  } catch (error) {
    // rollback if error
    console.error(error);
    connection.rollback();
  }
}

connection.changeUser({ database: 'transactions' });
createTables();
insertValues();
await transfer(101, 102, 1000);
connection.end();
