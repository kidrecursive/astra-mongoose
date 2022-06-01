// Copyright DataStax, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import assert from 'assert';
import { Db } from '@/src/collections/db';
import { FindCursor } from '@/src/collections/cursor';
import { Collection } from '@/src/collections/collection';
import { Client } from '@/src/collections/client';
import { getClient, getSampleUsers } from '@/tests/fixtures';

describe('AstraMongoose - collections.cursor', async () => {
  let astraClient: Client;
  let db: Db;
  let collection: Collection;
  let sampleSize = 42;
  const sampleUsers = getSampleUsers(sampleSize);
  before(async () => {
    astraClient = await getClient();
    db = astraClient.db();
    await db.createCollection('cursor_tests');
    collection = db.collection('cursor_tests');
    await collection.insertMany(sampleUsers);
  });

  after(() => {
    // run drop collection async to save time
    db.dropCollection('cursor_tests');
  });

  describe('Cursor initialization', () => {
    it('should initialize a Cursor', () => {
      const cursor = new FindCursor(collection, { firstName: sampleUsers[0].firstName });
      assert.strictEqual(cursor.status, 'initialized');
      assert.ok(cursor);
    });
  });

  describe('Cursor operations', () => {
    it('should execute a query', async () => {
      const cursor = new FindCursor(collection, { firstName: sampleUsers[0].firstName });
      const res = await cursor.toArray();
      assert.notStrictEqual(res.length, 0);
    });
    it('should execute a query with a callback', done => {
      const cursor = new FindCursor(collection, { firstName: sampleUsers[0].firstName });
      cursor.toArray((err, res) => {
        assert.strictEqual(undefined, err);
        assert.notStrictEqual(res.length, 0);
        done();
      });
    });
    it('should execute a limited query', async () => {
      const cursor = new FindCursor(collection, {}, { limit: 1 });
      const res = await cursor.toArray();
      assert.strictEqual(res.length, 1);
    });
    it('should execute an all query', async () => {
      const cursor = new FindCursor(collection, {});
      const res = await cursor.toArray();
      assert.strictEqual(res.length, sampleSize);
    });
    it('should not execute twice', done => {
      const cursor = new FindCursor(collection, {});
      cursor.toArray((_err, _res) => {
        assert.strictEqual(cursor.status, 'executed');
        cursor.count(undefined, (err: Error, count: number) => {
          assert.strictEqual(undefined, err);
          assert.strictEqual(count, sampleSize);
          done();
        });
        assert.strictEqual(cursor.status, 'executed');
      });
      assert.strictEqual(cursor.status, 'executing');
    });
    it('should iterate over all documents', async () => {
      const cursor = new FindCursor(collection, {});
      let docCount = 0;
      await cursor.forEach((_doc: any) => {
        docCount++;
      });
      assert.strictEqual(docCount, sampleSize);
    });
    it('should iterate over all documents with an async iterator', async () => {
      const cursor = new FindCursor(collection, {});
      let docCount = 0;
      await cursor.forEach(async (_doc: any) => {
        await Promise.resolve();
        docCount++;
      });
      assert.strictEqual(docCount, sampleSize);
    });
  });

  describe('Cursor noops', () => {
    it('should handle noop: stream', async () => {
      const cursor = new FindCursor(collection, { firstName: sampleUsers[0].firstName });
      try {
        const stream = cursor.stream();
        assert.ok(stream);
      } catch (e) {
        assert.ok(e);
      }
    });
  });
});
