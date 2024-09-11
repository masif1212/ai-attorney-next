import { promises as fs } from 'fs';
import Typesense from 'typesense';

async function createCollection() {
  const client = new Typesense.Client({
    nodes: [
      {
        host: 'localhost',
        port: 8108,
        protocol: 'http',
      },
    ],
    apiKey: 'qxfa25ROV2MmKOE',
    connectionTimeoutSeconds: 2,
  });

  const schema: any = {
    name: 'cases',
    fields: [
      {
        name: 'id',
        type: 'string',
        facet: false,
      },
      {
        name: 'citation',
        type: 'string',
        facet: true,
      },
      {
        name: 'title',
        type: 'string',
        facet: false,
      },
      {
        name: 'description',
        type: 'string',
        facet: true,
      },
      {
        name: 'case_description',
        type: 'string',
        facet: true,
      },
      {
        name: 'year',
        type: 'string',
        facet: true,
      },
      {
        name: 'citation_name',
        type: 'string',
        facet: true,
      },
      {
        name: 'page_no',
        type: 'string',
        facet: true,
      },
      {
        name: 'court',
        type: 'string',
        facet: true,
      },
      {
        name: 'judges',
        type: 'string',
        facet: true,
      },
      {
        name: 'order_num',
        type: 'string',
        facet: true,
      },
      {
        name: 'formatted_links',
        type: 'string[]',
        facet: false,
        optional: true,
      },
    ],
  };

  try {
    // Check if the collection already exists
    const existingCollection = await client.collections('cases').retrieve().catch(() => null);

    // If it exists, delete it
    if (existingCollection) {
      await client.collections('cases').delete();
      console.log('Existing collection deleted.');
    }

    // Create the new collection with the schema
    const collection = await client.collections().create(schema);
    console.log('Collection created:', collection);

    // Load JSON data
    const jsonData = await fs.readFile('./data/casesdata.json', 'utf8');
    const cases = JSON.parse(jsonData)
      .map((doc: any) => JSON.stringify(doc))
      .join('\n');

    // Import data into the collection
    const results = await client
      .collections('cases')
      .documents()
      .import(cases, { action: 'upsert' });

    console.log('Data import results:', results);
  } catch (error) {
    console.error('Error creating collection or importing data:', error);
  }
}

createCollection();
