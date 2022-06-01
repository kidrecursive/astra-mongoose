import { createAstraUri } from '@/src/collections/utils';
import { Client } from '@/src/collections/client';
import { randFirstName, randLastName } from '@ngneat/falso';

export const astraUri = createAstraUri(
  process.env.ASTRA_DB_ID || '',
  process.env.ASTRA_DB_REGION || '',
  process.env.ASTRA_DB_KEYSPACE || '',
  process.env.ASTRA_DB_APPLICATION_TOKEN || ''
);

export const getClient = async () => await Client.connect(astraUri);

export const sampleUser = { firstName: 'Cliff', lastName: 'Wicklow' };

export const createUser = () => ({
  firstName: randFirstName(),
  lastName: randLastName()
});

export const getSampleUsers = (numUsers: number) => Array.from({ length: numUsers }, createUser);
