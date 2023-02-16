export const seedDatabase = async (client) => {
  const hasAccountsCollection = await client
    .db('databaseWeek4')
    .listCollections({ name: 'accounts' })
    .hasNext();
  if (hasAccountsCollection)
    await client.db('databaseWeek4').collection('accounts').drop();
  await client.db('databaseWeek4').createCollection('accounts');
  const data = [
    {
      account_number: 100,
      balance: 10000,
      account_changes: [],
    },
    {
      account_number: 101,
      balance: 10000,
      account_changes: [],
    },
    {
      account_number: 102,
      balance: 10000,
      account_changes: [],
    },
  ];
  await client.db('databaseWeek4').collection('accounts').insertMany(data);
};
