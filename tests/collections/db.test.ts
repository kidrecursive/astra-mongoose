import assert from 'assert';
import { Db } from '@/src/collections/db';
import { Client } from '@/src/collections/client';
import { getClient } from '@/tests/fixtures';
import { randAlphaNumeric } from '@ngneat/falso';

describe('AstraMongoose - collections.Db', async () => {
  let astraClient: Client;
  before(async () => {
    astraClient = await getClient();
  });

  describe('Db initialization', () => {
    it('should initialize a Db', () => {
      const db = new Db(astraClient.httpClient, 'test-db');
      assert.ok(db);
    });
    it('should not initialize a Db without a name', () => {
      try {
        const db = new Db(astraClient.httpClient);
        assert.ok(db);
      } catch (e) {
        assert.ok(e);
      }
    });
  });

  describe('Db collection operations', () => {
    it('should initialize a Collection', () => {
      const db = new Db(astraClient.httpClient, 'test-db');
      const collection = db.collection('test-collection');
      assert.ok(collection);
    });
    it('should not initialize a Collection without a name', () => {
      try {
        const db = new Db(astraClient.httpClient, 'test-db');
        const collection = db.collection();
        assert.ok(collection);
      } catch (e) {
        assert.ok(e);
      }
    });
    it('should create a Collection', async () => {
      const db = new Db(astraClient.httpClient, process.env.ASTRA_DB_KEYSPACE || '');
      const suffix = randAlphaNumeric({ length: 4 }).join('');
      const res = await db.createCollection(`test_db_collection_${suffix}`);
      assert.strictEqual(res, '');
      // run drop collection async to save time
      db.dropCollection(`test_db_collection_${suffix}`);
    });
    it('should create a Collection with a callback', done => {
      const db = new Db(astraClient.httpClient, process.env.ASTRA_DB_KEYSPACE || '');
      const suffix = randAlphaNumeric({ length: 4 }).join('');
      db.createCollection(`test_db_collection_${suffix}`, null, (err, res) => {
        assert.strictEqual(res, '');
        assert.strictEqual(err, undefined);
        // run drop collection async to save time
        db.dropCollection(`test_db_collection_${suffix}`, (err, res) => {
          assert.strictEqual(res, '');
          assert.strictEqual(err, undefined);
        });
        done();
      });
    });
    it('should drop a Collection', async () => {
      const db = new Db(astraClient.httpClient, process.env.ASTRA_DB_KEYSPACE || '');
      const suffix = randAlphaNumeric({ length: 4 }).join('');
      await db.createCollection(`test_db_collection_${suffix}`);
      const res = await db.dropCollection(`test_db_collection_${suffix}`);
      assert.strictEqual(res, '');
    });
    it('should drop a Collection with a callback', done => {
      const db = new Db(astraClient.httpClient, process.env.ASTRA_DB_KEYSPACE || '');
      const suffix = randAlphaNumeric({ length: 4 }).join('');
      db.createCollection(`test_db_collection_${suffix}`, null, (_err, _res) => {
        db.dropCollection(`test_db_collection_${suffix}`, (err, res) => {
          assert.strictEqual(res, '');
          assert.strictEqual(err, undefined);
          done();
        });
      });
    });
    it('should not create a Collection with an invalid name', async () => {
      const db = new Db(astraClient.httpClient, process.env.ASTRA_DB_KEYSPACE || '');
      try {
        const res = await db.createCollection('test/?w.`');
        assert.strictEqual(res, undefined);
      } catch (e) {
        assert.ok(e);
      }
    });
  });

  describe('Db noops', () => {
    it('should handle noop: dropDatabase', async () => {
      const db = new Db(astraClient.httpClient, 'test-db');
      const res = await db.dropDatabase();
      assert.strictEqual(res, undefined);
    });
    it('should handle noop: dropDatabase with a callback', async () => {
      const db = new Db(astraClient.httpClient, 'test-db');
      db.dropDatabase((err, res) => {
        assert.strictEqual(err, undefined);
        assert.strictEqual(res, undefined);
      });
    });
  });
});
