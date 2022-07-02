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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const db_1 = require("./db");
const utils_1 = require("./utils");
const client_1 = require("../client");
class Client {
    /**
     * Set up a MongoClient that works with the Stargate/Astra document API
     * @param uri an Astra/Stargate connection uri. It should be formed like so if using
     *            Astra: https://${databaseId}-${region}.apps.astra.datastax.com
     * @param options provide the Astra applicationToken here along with the keyspace name (optional)
     */
    constructor(uri, options) {
        this.baseURL = uri;
        this.keyspaceName = options.keyspaceName;
        this.applicationToken = options.applicationToken;
        this.httpClient = new client_1.HTTPClient({
            baseUrl: this.baseURL,
            applicationToken: options.applicationToken,
            logLevel: options.logLevel
        });
    }
    /**
     * Setup a connection to the Astra/Stargate document API
     * @param uri an Astra/Stargate connection uri. It should be formed like so if using
     *            Astra: https://${databaseId}-${region}.apps.astra.datastax.com/${keyspace}?applicationToken=${applicationToken}
     *            You can also have it formed for you using utils.createAstraUri()
     * @param cb an optional callback whose parameters are (err, client)
     * @returns MongoClient
     */
    static async connect(uri, cb) {
        const parsedUri = (0, utils_1.parseUri)(uri);
        const client = new Client(parsedUri.baseUrl, {
            applicationToken: parsedUri.applicationToken,
            keyspaceName: parsedUri.keyspaceName,
            logLevel: parsedUri.logLevel
        });
        await client.connect();
        if (cb) {
            cb(undefined, client);
        }
        return client;
    }
    /**
     * Connect the MongoClient instance to Astra
     * @param cb an optional callback whose parameters are (err, client)
     * @returns a MongoClient instance
     */
    async connect(cb) {
        if (cb) {
            cb(undefined, this);
        }
        return this;
    }
    /**
     * Use a Astra keyspace
     * @param dbName the Astra keyspace to connect to
     * @returns Db
     */
    db(dbName) {
        if (dbName) {
            return new db_1.Db(this.httpClient, dbName);
        }
        if (this.keyspaceName) {
            return new db_1.Db(this.httpClient, this.keyspaceName);
        }
        throw new Error('Database name must be provided');
    }
    // NOOPS and unimplemented
    /**
     *
     * @param maxListeners
     * @returns number
     */
    setMaxListeners(maxListeners) {
        return maxListeners;
    }
    /**
     *
     * @param cb
     * @returns Client
     */
    close(cb) {
        if (cb) {
            cb(undefined, this);
        }
        return this;
    }
}
exports.Client = Client;
//# sourceMappingURL=client.js.map