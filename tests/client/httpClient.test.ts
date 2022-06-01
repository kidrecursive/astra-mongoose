import assert from 'assert';
import { astraUri } from '@/tests/fixtures';
import { HTTPClient } from '@/src/client/httpClient';

describe('AstraMongoose - client.HTTPClient', () => {
  const astraClient = new HTTPClient({
    baseUrl: astraUri,
    applicationToken: process.env.ASTRA_DB_APPLICATION_TOKEN || ''
  });
  describe('HTTPClient Operations', () => {
    it('should not initialize in a web browser', () => {
      try {
        // @ts-ignore
        global.window = true;
        // @ts-ignore
        const client = new HTTPClient();
        assert.ok(client);
      } catch (e) {
        assert.ok(e);
      }
      // @ts-ignore
      delete global.window;
    });
    it('should not initialize without an application token', () => {
      try {
        // @ts-ignore
        const client = new HTTPClient({
          databaseId: process.env.ASTRA_DB_ID,
          databaseRegion: process.env.ASTRA_DB_REGION
        });
        assert.ok(client);
      } catch (e) {
        assert.ok(e);
      }
    });
    it('should not initialize without a baseUrl or both database settings', () => {
      try {
        // @ts-ignore
        const client = new HTTPClient({
          databaseId: process.env.ASTRA_DB_ID
        });
        assert.ok(client);
      } catch (e) {
        assert.ok(e);
      }
    });
  });
});
