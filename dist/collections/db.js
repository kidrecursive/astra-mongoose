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
exports.Db = void 0;
const collection_1 = require("./collection");
const utils_1 = require("./utils");
const lodash_1 = __importDefault(require("lodash"));
const DEFAULT_BASE_PATH = '/api/rest/v2/namespaces';
class Db {
    /**
     *
     * @param astraClient
     * @param name
     */
    constructor(httpClient, name) {
        if (!name) {
            throw new Error('Db: name is required');
        }
        // use a clone of the underlying http client to support multiple db's from a single connection
        this.httpClient = lodash_1.default.cloneDeep(httpClient);
        this.httpClient.baseUrl = `${this.httpClient.baseUrl}${DEFAULT_BASE_PATH}/${name}`;
        this.name = name;
    }
    /**
     *
     * @param collectionName
     * @returns Collection
     */
    collection(collectionName) {
        if (!collectionName) {
            throw new Error('Db: collection name is required');
        }
        return new collection_1.Collection(this.httpClient, collectionName);
    }
    /**
     *
     * @param collectionName
     * @param options
     * @param cb
     * @returns Promise
     */
    async createCollection(collectionName, options, cb) {
        return (0, utils_1.executeOperation)(async () => {
            const data = await this.httpClient.post('/collections', {
                name: collectionName
            }).then(res => res.data).catch(err => {
                if (err?.response?.status === 409) {
                    return null; // Collection already exists
                }
                throw err;
            });
            return data;
        }, cb);
    }
    /**
     *
     * @param collectionName
     * @param cb
     * @returns Promise
     */
    async dropCollection(collectionName, cb) {
        return (0, utils_1.executeOperation)(async () => {
            const res = await this.httpClient.delete(`/collections/${collectionName}`);
            return res.data;
        }, cb);
    }
    // NOOPS and unimplemented
    /**
     *
     * @param cb
     * @returns Promise
     */
    async dropDatabase(cb) {
        if (cb) {
            cb(undefined, undefined);
        }
    }
}
exports.Db = Db;
//# sourceMappingURL=db.js.map