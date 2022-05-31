import { createAstraUri } from '@/src/collections/utils';
import { Client } from '@/src/collections/client';

export const astraUri = createAstraUri(
  process.env.ASTRA_DB_ID || '',
  process.env.ASTRA_DB_REGION || '',
  process.env.ASTRA_DB_KEYSPACE || '',
  process.env.ASTRA_DB_APPLICATION_TOKEN || ''
);

export const getClient = async () => await Client.connect(astraUri);

export const sampleUser = { firstName: 'Cliff', lastName: 'Wicklow' };
