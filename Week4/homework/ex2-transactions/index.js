async function main() {
  const mongodb = await import('mongodb');
  const dotenv = await import('dotenv');
  dotenv.config();
  const { seedDatabase } = await import('./setup.js');
  const { transfer } = await import('./transfer.js');
  if (process.env.MONGODB_URL == null) {
    throw Error(
      `You did not set up the environment variables correctly. Did you create a '.env' file and add a package to create it?`,
    );
  }
  const client = new mongodb.MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: mongodb.ServerApiVersion.v1,
  });

  try {
    await client.connect();

    // Seed our database
    await seedDatabase(client);

    // Transaction:
    await transfer(client, 101, 102, 500);
  } catch (err) {
    console.error(err);
  } finally {
    // Always close the connection at the end
    client.close();
  }
}

main();
