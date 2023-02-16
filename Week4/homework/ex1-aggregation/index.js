async function main() {
  const mongodb = await import('mongodb');
  const dotenv = await import('dotenv');
  const { seedDatabase } = await import('./seedDatabase.js');
  const { queryTotalPopulationCountry, queryTotalPopulationContinents } =
    await import('./queryFunctions.js');
  dotenv.config();
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

    // Total population of country by year
    await queryTotalPopulationCountry(client, 'Netherlands');

    // Number of people who are 100+
    await queryTotalPopulationContinents(client, '100+', 2020);
  } catch (err) {
    console.error(err);
  } finally {
    // Always close the connection at the end
    client.close();
  }
}

main();
