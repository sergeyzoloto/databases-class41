import { db as connection, execBoundQuery } from '../../../db.js';

async function transfer(source_id, target_id, amount) {
  try {
    // check source account money sufficiency
    const sourceRow = await execBoundQuery(
      `SELECT balance FROM account WHERE account_number = ?`,
      [source_id],
    );
    const sourceAmount = await JSON.parse(JSON.stringify(sourceRow))[0].balance;
    if (sourceAmount >= amount) {
      const targetRow = await execBoundQuery(
        `SELECT balance FROM account WHERE account_number = ?`,
        [target_id],
      );
      const targetAmount = await JSON.parse(JSON.stringify(targetRow))[0]
        .balance;
      const today = new Date();
      await execBoundQuery('START TRANSACTION');
      // update source account amount
      await execBoundQuery(
        'UPDATE account SET balance = ? WHERE account_number = ?',
        [sourceAmount - amount, source_id],
      );
      // update target account amount
      await execBoundQuery(
        'UPDATE account SET balance = ? WHERE account_number = ?',
        [targetAmount + amount, target_id],
      );
      // insert details into account_changes table
      await execBoundQuery(
        'INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES (?)',
        [[source_id, amount, today, `${amount} sent to ID ${target_id}`]],
      );
      await execBoundQuery(
        'INSERT INTO account_changes (account_number, amount, changed_date, remark) VALUES (?)',
        [[target_id, amount, today, `${amount} received from ID ${source_id}`]],
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
await transfer(101, 102, 1000);
connection.end();
