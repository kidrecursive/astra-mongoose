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
exports.Connection = void 0;
const client_1 = require("../collections/client");
const collection_1 = require("./collection");
const connection_1 = __importDefault(require("mongoose/lib/connection"));
const connectionstate_1 = __importDefault(require("mongoose/lib/connectionstate"));
class Connection extends connection_1.default {
    constructor(base) {
        super(base);
        this.debugType = 'AstraMongooseConnection';
    }
    collection(name, options) {
        if (!(name in this.collections)) {
            this.collections[name] = new collection_1.Collection(name, this, options);
        }
        return super.collection(name, options);
    }
    async createCollection(name, callback) {
        const db = this.client.db();
        return await db.createCollection(name);
    }
    async dropCollection(name, callback) {
        const db = this.client.db();
        return await db.dropCollection(name);
    }
    openUri(uri, options, callback) {
        if (typeof options === 'function') {
            callback = options;
            options = null;
        }
        this._connectionString = uri;
        this.readyState = connectionstate_1.default.connecting;
        this._closeCalled = false;
        const _this = this;
        return new Promise((resolve, reject) => {
            client_1.Client.connect(uri, function (err, client) {
                if (err) {
                    _this.readyState = connectionstate_1.default.disconnected;
                }
                _this.client = client;
                _this.db = client.db();
                _this.readyState = connectionstate_1.default.connected;
                if (callback) {
                    return callback(err, _this);
                }
                if (err) {
                    return reject(err);
                }
                return resolve(_this);
            });
        });
    }
    /**
     *
     * @param cb
     * @returns Client
     */
    doClose(force, cb) {
        if (cb) {
            cb(undefined);
        }
        return this;
    }
}
exports.Connection = Connection;
//# sourceMappingURL=connection.js.map