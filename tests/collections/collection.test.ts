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
import { Collection } from '@/src/collections/collection';
import { Client } from '@/src/collections/client';
import { getClient, createSampleUser, getSampleUsers, sleep } from '@/tests/fixtures';
import _ from 'lodash';

describe('AstraMongoose - collections.collection', async () => {
  let astraClient: Client;
  let db: Db;
  let collection: Collection;
  const sampleUser = createSampleUser();
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
      assert.strictEqual(res.documentId, undefined);
      assert.strictEqual(res.acknowledged, true);
      assert.ok(res.insertedId);
      assert.ok(res);
    });
    it('should insertOne document with a callback', done => {
      collection.insertOne(sampleUser, (err: any, res: any) => {
        assert.strictEqual(undefined, err);
        assert.ok(res);
        done();
      });
    });
    it('should not insertOne document that is invalid', async () => {
      try {
        const res = await collection.insertOne({ 'dang.bro.yep': 'boss' });
        assert.ok(res);
      } catch (e) {
        assert.ok(e);
      }
    });
    it('should insertMany documents', async () => {
      const res = await collection.insertMany(getSampleUsers(3));
      assert.strictEqual(res.documentIds, undefined);
      assert.strictEqual(res.acknowledged, true);
      assert.strictEqual(_.keys(res.insertedIds).length, 3);
    });
    it('should updateOne document', async () => {
      const { insertedId } = await collection.insertOne({ dang: 'boss' });
      await sleep();
      const res = await collection.updateOne(
        { _id: insertedId },
        { dang: 'yep', $set: { wew: 'son' }, $inc: { count: 1 } }
      );
      assert.strictEqual(res.modifiedCount, 1);
      assert.strictEqual(res.matchedCount, 1);
      assert.strictEqual(res.acknowledged, true);
      await sleep();
      const doc = await collection.findOne({ _id: insertedId });
      assert.strictEqual(doc.dang, 'yep');
      assert.strictEqual(doc.wew, 'son');
      assert.strictEqual(doc.count, 1);
    });
    it('should updateOne with upsert', async () => {
      const res = await collection.updateOne(
        { name: 'test name' },
        { $setOnInsert: { prop: 'test prop' } },
        { upsert: true }
      );
      assert.ok(res.acknowledged);
      assert.equal(res.upsertedCount, 1);
      assert.ok(res.upsertedId);
      await sleep();
      const doc = await collection.findOne({ name: 'test name' });
      assert.strictEqual(doc.name, 'test name');
      assert.strictEqual(doc.prop, 'test prop');
    });
    it('should updateMany documents', async () => {
      const { insertedIds } = await collection.insertMany([
        { many: true },
        { many: true, count: 1 }
      ]);
      await sleep();
      const res = await collection.updateMany({ many: true }, { dang: 'yep', $inc: { count: 1 } });
      assert.strictEqual(res.modifiedCount, 2);
      assert.strictEqual(res.matchedCount, 2);
      assert.strictEqual(res.acknowledged, true);
      await sleep();
      const doc = await collection.findOne({ _id: insertedIds[1] });
      assert.strictEqual(doc.dang, 'yep');
      assert.strictEqual(doc.count, 2);
    });
    it('should updateMany documents with upsert', async () => {
      const res = await collection.updateMany(
        { name: 'test name' },
        { $setOnInsert: { prop: 'test prop' } },
        { upsert: true }
      );
      assert.ok(res.acknowledged);
      assert.equal(res.upsertedCount, 1);
      assert.ok(res.upsertedId);
      await sleep();
      const doc = await collection.findOne({ name: 'test name' });
      assert.strictEqual(doc.name, 'test name');
      assert.strictEqual(doc.prop, 'test prop');
    });
    it('should replaceOne document', async () => {
      const { insertedId } = await collection.insertOne({ will: 'end' });
      await sleep();
      const res = await collection.replaceOne({ _id: insertedId }, { will: 'start' });
      assert.strictEqual(res.modifiedCount, 1);
      assert.strictEqual(res.matchedCount, 1);
      assert.strictEqual(res.acknowledged, true);
    });
    it('should replaceOne document with upsert', async () => {
      const res = await collection.replaceOne(
        { name: 'test' },
        { prop: 'test prop' },
        { upsert: true }
      );
      assert.strictEqual(res.modifiedCount, 0);
      assert.strictEqual(res.matchedCount, 0);
      assert.strictEqual(res.acknowledged, true);
      assert.strictEqual(res.upsertedCount, 1);

      const doc = await collection.findOne({ _id: res.upsertedId });
      assert.ok(doc);
      assert.strictEqual(doc.name, 'test');
      assert.strictEqual(doc.prop, 'test prop');
    });
    it('should deleteOne document', async () => {
      const { insertedId } = await collection.insertOne({ will: 'die' });
      await sleep();
      const res = await collection.deleteOne({ _id: insertedId });
      assert.strictEqual(res.deletedCount, 1);
    });
    it('should findOneAndUpdate', async () => {
      const { insertedId: _id } = await collection.insertOne({ name: 'before' });
      await sleep();
      let res = await collection.findOneAndUpdate({ _id }, { name: 'after' });
      assert.ok(res.value);
      assert.equal(res.value._id.toString(), _id.toString());
      assert.equal(res.value.name, 'before');

      res = await collection.findOneAndUpdate({ _id }, { name: 'after 2' }, { returnDocument: 'after' });
      assert.ok(res.value);
      assert.equal(res.value._id.toString(), _id.toString());
      assert.equal(res.value.name, 'after 2');
    });
    it('should findOneAndUpdate with upsert', async () => {
      let res = await collection.findOneAndUpdate(
        { name: 'before' },
        { name: 'after' },
        { upsert: true }
      );
      assert.ok(!res.value);
      
      let doc = await collection.findOne({ name: 'after' });
      assert.ok(doc);

      await collection.deleteOne({ name: 'after' });

      res = await collection.findOneAndUpdate(
        { name: 'before' },
        { name: 'after' },
        { upsert: true, returnDocument: 'after' }
      );
      assert.ok(res.value);
      assert.equal(res.value.name, 'after');
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
