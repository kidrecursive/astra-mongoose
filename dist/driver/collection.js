"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collection = void 0;
const collection_1 = __importDefault(require("mongoose/lib/collection"));
class Collection extends collection_1.default {
    constructor(name, conn, options) {
        super(name, conn, options);
        this.debugType = 'AstraMongooseCollection';
        this.Promise = options.Promise || Promise;
        this.modelName = options.modelName;
        delete options.modelName;
        this._closed = false;
    }
    get collection() {
        return this.conn.db.collection(this.name);
    }
    find(query, options, cb) {
        return this.collection.find(query, options, cb);
    }
    async findOne(query, options, cb) {
        return await this.collection.findOne(query, options, cb);
    }
    async insertOne(doc, options, cb) {
        return await this.collection.insertOne(doc, options, cb);
    }
    async insert(docs, options, cb) {
        return await this.collection.insertMany(docs, options, cb);
    }
    async insertMany(docs, options, cb) {
        return await this.collection.insertMany(docs, options, cb);
    }
    async findAndModify(query, update, options, cb) {
        return await this.collection.updateMany(query, update, options, cb);
    }
    async findOneAndUpdate(query, update, options, cb) {
        return await this.collection.findOneAndUpdate(query, update, options, cb);
    }
    async findOneAndDelete(query, options, cb) {
        return await this.collection.findOneAndDelete(query, options, cb);
    }
    async findOneAndReplace(query, newDoc, options, cb) {
        return await this.collection.updateMany(query, newDoc, options, cb);
    }
    async deleteMany(query, options, cb) {
        return await this.collection.deleteMany(query, options, cb);
    }
    async remove(query, options, cb) {
        return await this.collection.remove(query, options, cb);
    }
    // No-ops
    async dropIndexes(cb) {
        return await this.collection.dropIndexes(cb);
    }
}
exports.Collection = Collection;
//  Collection.prototype.ensureIndex = function() {
//   throw new Error('Collection#ensureIndex unimplemented by driver');
// };
// Collection.prototype.createIndex = function() {
//   throw new Error('Collection#createIndex unimplemented by driver');
// };
// Collection.prototype.save = function() {
//   throw new Error('Collection#save unimplemented by driver');
// };
// Collection.prototype.update = function() {
//   throw new Error('Collection#update unimplemented by driver');
// };
// Collection.prototype.getIndexes = function() {
//   throw new Error('Collection#getIndexes unimplemented by driver');
// };
// Collection.prototype.mapReduce = function() {
//   throw new Error('Collection#mapReduce unimplemented by driver');
// };
// Collection.prototype.watch = function() {
//   throw new Error('Collection#watch unimplemented by driver');
// };
//# sourceMappingURL=collection.js.map