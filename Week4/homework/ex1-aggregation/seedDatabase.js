const CSVToJSON = (data, delimiter = ',') => {
  const headers = data
    .slice(0, data.indexOf('\n'))
    .replace('\r', '')
    .split(delimiter);
  const result = data
    .slice(data.indexOf('\n') + 1)
    .split('\n')
    .map((v) => {
      const values = v.replace('\r', '').split(delimiter);
      const parsedValues = values.map((element) => {
        return /^\d+$/.test(element) ? Number(element) : element;
      });
      return headers.reduce(
        (obj, header, index) => ((obj[header] = parsedValues[index]), obj),
        {},
      );
    });
  return result;
};

async function loadFile(fileName) {
  const fs = await import('fs');
  const path = await import('path');
  const url = await import('url');
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const data = fs.readFileSync(__dirname + fileName, 'utf8');
  return data;
}

export const seedDatabase = async (client) => {
  const csvFilePath = '/population_pyramid_1950-2022.csv';
  const file = await loadFile(csvFilePath);
  const data = CSVToJSON(file);

  await client
    .db('databaseWeek4')
    .collection('population_pyramid')
    .deleteMany();
  await client
    .db('databaseWeek4')
    .collection('population_pyramid')
    .insertMany(data);
};
