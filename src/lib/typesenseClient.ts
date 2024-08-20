import TypesenseInstantSearchAdapter from 'typesense-instantsearch-adapter';

const typesenseInstantsearchAdapter: any = new (TypesenseInstantSearchAdapter as any)({
  server: {
    apiKey: 'qxfa25ROV2MmKOE',
    nodes: [
      {
        host: 'localhost',
        port: 8108,
        protocol: 'http',
      },
    ],
  },
  additionalSearchParameters: {
    query_by: 'name,description,title,citation,case_description,year,court',
  },
});

const searchClient = typesenseInstantsearchAdapter.searchClient;

export default searchClient;
