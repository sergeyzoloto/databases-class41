async function getNumber(client, accountNumber) {
  const account = await client
    .db('databaseWeek4')
    .collection('accounts')
    .findOne({ account_number: accountNumber });
  if (account.account_changes.length > 0) {
    const lastChange =
      account.account_changes[account.account_changes.length - 1];
    return lastChange.change_number + 1;
  } else {
    return 0;
  }
}

export const transfer = async (client, sourceId, targetId, amount) => {
  const session = client.startSession();
  const accounts = await client.db('databaseWeek4').collection('accounts');
  try {
    const transactionResults = await session.withTransaction(async () => {
      const sourceChangeNumber = await getNumber(client, sourceId);
      const targetChangeNumber = await getNumber(client, targetId);

      const subtractAmount = await accounts.updateOne(
        { account_number: sourceId },
        {
          $inc: { balance: -amount },
          $push: {
            account_changes: {
              change_number: sourceChangeNumber,
              amount: -amount,
              changed_date: new Date(),
              remark: `${amount} sent to ID ${targetId}`,
            },
          },
        },
        { session },
      );

      if (subtractAmount.modifiedCount !== 1) {
        await session.abortTransaction();
        return;
      }

      const addAmount = await accounts.updateOne(
        { account_number: targetId },
        {
          $inc: { balance: amount },
          $push: {
            account_changes: {
              change_number: targetChangeNumber,
              amount: amount,
              changed_date: new Date(),
              remark: `${amount} received from ID ${sourceId}`,
            },
          },
        },
        { session },
      );
      if (addAmount.modifiedCount !== 1) {
        await session.abortTransaction();
        return;
      }
    });
    if (transactionResults) {
      console.log(
        `Success: ${amount} transferred from ${sourceId} to ${targetId}.`,
      );
    } else {
      console.log('Transaction aborted.');
    }
  } catch (error) {
    console.log(`Unexpected error: ${error}`);
  }
};
