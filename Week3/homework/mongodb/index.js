async function createEpisodeExercise(client) {
  const result = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .insertOne({
      episode: 'S09E13',
      title: 'MOUNTAIN HIDE-AWAY',
      elements: [
        'CIRRUS',
        'CLOUDS',
        'CONIFER',
        'DECIDIOUS',
        'GRASS',
        'MOUNTAIN',
        'MOUNTAINS',
        'RIVER',
        'SNOWY_MOUNTAIN',
        'TREE',
        'TREES',
      ],
    });
  console.log(
    `Created season 9 episode 13 and the document got the id ${result.insertedId}`,
  );
}

async function findEpisodesExercises(client) {
  const { title } = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .findOne({ episode: 'S02E02' });

  console.log(`The title of episode 2 in season 2 is ${title}`);

  const { episode } = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .findOne({ title: 'BLACK RIVER' });

  console.log(
    `The season and episode number of the "BLACK RIVER" episode is ${episode}`,
  );

  const foundCliff = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .find({ elements: 'CLIFF' });
  const cliffArray = await foundCliff.toArray();
  const mappedCliffArray = cliffArray.map((result) => result.title);
  console.log(
    `The episodes that Bob Ross painted a CLIFF are ${mappedCliffArray}`,
  );

  const foundLighthouse = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .find({ elements: { $all: ['CLIFF', 'LIGHTHOUSE'] } });
  const lighthouseArray = await foundLighthouse.toArray();
  const mappedLighthouseArray = lighthouseArray.map((result) => result.title);
  console.log(
    `The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are ${mappedLighthouseArray}`,
  );
}

async function updateEpisodeExercises(client) {
  const update1 = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .updateOne({ episode: 'S30E13' }, { $set: { title: 'BLUE RIDGE FALLS' } });
  console.log(
    `Ran a command to update episode 13 in season 30 and it updated ${update1.modifiedCount} episodes`,
  );

  // Unfortunately we made a mistake in the arrays and the element type called 'BUSHES' should actually be 'BUSH' as sometimes only one bush was painted.
  // Update all of the documents in the collection that have `BUSHES` in the elements array to now have `BUSH`
  // It should update 120 episodes!

  let update2 = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .updateMany(
      { elements: 'BUSHES' },
      { $set: { 'elements.$[element]': 'BUSH' } },
      { arrayFilters: [{ element: 'BUSHES' }] },
    );

  console.log(
    `Ran a command to update all the BUSHES to BUSH and it updated ${update2.modifiedCount} episodes`,
  );
}

async function deleteEpisodeExercise(client) {
  /**
   * It seems an errand episode has gotten into our data.
   * This is episode 14 in season 31. Please remove it and verify that it has been removed!
   */
  const deleted = await client
    .db('databaseWeek3')
    .collection('bob_ross_episodes')
    .deleteOne({ episode: 'S31E14' });
  console.log(
    `Ran a command to delete episode and it deleted ${deleted.deletedCount} episodes`,
  );
}

async function main() {
  const mongodb = await import('mongodb');
  const dotenv = await import('dotenv');
  const { seedDatabase } = await import('./seedDatabase.js');
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

    // CREATE
    await createEpisodeExercise(client);

    // READ
    await findEpisodesExercises(client);

    // UPDATE
    await updateEpisodeExercises(client);

    // DELETE
    await deleteEpisodeExercise(client);
  } catch (err) {
    console.error(err);
  } finally {
    // Always close the connection at the end
    client.close();
  }
}

main();

/**
 * In the end the console should read something like this: 

Created season 9 episode 13 and the document got the id 625e9addd11e82a59aa9ff93
The title of episode 2 in season 2 is WINTER SUN
The season and episode number of the "BLACK RIVER" episode is S02E06
The episodes that Bob Ross painted a CLIFF are NIGHT LIGHT, EVENING SEASCAPE, SURF'S UP, CLIFFSIDE, BY THE SEA, DEEP WILDERNESS HOME, CRIMSON TIDE, GRACEFUL WATERFALL
The episodes that Bob Ross painted a CLIFF and a LIGHTHOUSE are NIGHT LIGHT
Ran a command to update episode 13 in season 30 and it updated 1 episodes
Ran a command to update all the BUSHES to BUSH and it updated 120 episodes
Ran a command to delete episode and it deleted 1 episodes
 
*/
