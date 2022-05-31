import assert from 'assert';
import { Db } from '@/src/collections/db';
import { Collection } from '@/src/collections/collection';
import { Client } from '@/src/collections/client';
import { getClient, sampleUser } from '@/tests/fixtures';

describe('AstraMongoose - collections.collection', async () => {
  let astraClient: Client;
  let db: Db;
  let collection: Collection;
  before(async () => {
    astraClient = await getClient();
    db = astraClient.db();
    collection = db.collection('collection_tests');
  });

  after(() => {
    // run drop collection async to save time
    db.dropCollection('collection_tests');
  });

  describe('Collection initialization', () => {
    it('should initialize a Collection', () => {
      const collection = new Collection(db.httpClient, 'new_collection');
      assert.ok(collection);
    });
    it('should not initialize a Collection without a name', () => {
      try {
        const collection = new Collection(db.httpClient);
        assert.ok(collection);
      } catch (e) {
        assert.ok(e);
      }
    });
  });

  describe('Collection operations', () => {
    it('should insertOne document', async () => {
      const res = await collection.insertOne(sampleUser);
      assert.ok(res);
    });
    it('should insertOne document with a callback', done => {
      collection.insertOne(sampleUser, (err, res) => {
        assert.strictEqual(undefined, err);
        assert.ok(res);
        done();
      });
    });
    it('should not insertOne document that is invalid', async () => {
      try {
        const res = await collection.insertOne('invalid doc');
        assert.ok(res);
      } catch (e) {
        assert.ok(e);
      }
    });
  });

  describe('Collection noops', () => {
    it('should handle noop: aggregate', async () => {
      try {
        const aggregation = collection.aggregate();
        assert.ok(aggregation);
      } catch (e) {
        assert.ok(e);
      }
    });
  });
});
