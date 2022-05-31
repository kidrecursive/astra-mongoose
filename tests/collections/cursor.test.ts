import assert from 'assert';
import { Db } from '@/src/collections/db';
import { FindCursor } from '@/src/collections/cursor';
import { Collection } from '@/src/collections/collection';
import { Client } from '@/src/collections/client';
import { getClient } from '@/tests/fixtures';

describe('AstraMongoose - collections.cursor', async () => {
  let astraClient: Client;
  let db: Db;
  let collection: Collection;
  before(async () => {
    astraClient = await getClient();
    db = astraClient.db();
    await db.createCollection('cursor_tests');
    collection = db.collection('cursor_tests');
    await collection.insertMany([
      { firstName: 'Cliff', lastName: 'Wicklow' },
      { firstName: 'Dang', lastName: 'Boss' },
      { firstName: 'Yep', lastName: 'Bruh' }
    ]);
  });

  after(() => {
    // run drop collection async to save time
    db.dropCollection('cursor_tests');
  });

  describe('Cursor initialization', () => {
    it('should initialize a Cursor', () => {
      const cursor = new FindCursor(collection, { firstName: 'Cliff' });
      assert.ok(cursor);
    });
  });

  describe('Cursor operations', () => {
    it('should execute a query', async () => {
      const cursor = new FindCursor(collection, { firstName: 'Cliff' });
      const res = await cursor.toArray();
      assert.strictEqual(res.length, 1);
      assert.ok(res);
    });
    it('should execute a query with a callback', done => {
      const cursor = new FindCursor(collection, { firstName: 'Cliff' });
      const res = cursor.toArray((err, res) => {
        assert.strictEqual(undefined, err);
        assert.strictEqual(res.length, 1);
        assert.ok(res);
        done();
      });
    });
  });

  describe('Cursor noops', () => {
    it('should handle noop: stream', async () => {
      const cursor = new FindCursor(collection, { firstName: 'Cliff' });
      try {
        const stream = cursor.stream();
        assert.ok(stream);
      } catch (e) {
        assert.ok(e);
      }
    });
  });
});
