export async function queryTotalPopulationCountry(client, country) {
  const populationByYear = [
    {
      $match: { Country: country },
    },
    {
      $group: {
        _id: '$Year',
        countPopulation: {
          $sum: {
            $add: ['$M', '$F'],
          },
        },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ];

  const cursor = await client
    .db('databaseWeek4')
    .collection('population_pyramid')
    .aggregate(populationByYear);

  console.log(`Population by years in ${country}`);
  await cursor.forEach((result) => {
    console.log(result);
  });
}

export async function queryTotalPopulationContinents(client, age, year) {
  const populationByContinent = [
    {
      $addFields: {
        TotalPopulation: {
          $add: ['$M', '$F'],
        },
      },
    },
    {
      $match: {
        Country: {
          $in: [
            'AFRICA',
            'ASIA',
            'EUROPE',
            'LATIN AMERICA AND THE CARIBBEAN',
            'NORTHERN AMERICA',
            'OCEANIA',
          ],
        },
        Year: year,
        Age: age,
      },
    },
  ];

  const cursor = await client
    .db('databaseWeek4')
    .collection('population_pyramid')
    .aggregate(populationByContinent);

  console.log(`Population by continents in ${year} and ${age} age group`);
  await cursor.forEach((result) => {
    console.log(result);
  });
}
