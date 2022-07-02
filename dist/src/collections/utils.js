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
exports.executeOperation = exports.setOptionsAndCb = exports.addDefaultId = exports.createAstraUri = exports.parseUri = exports.formatQuery = void 0;
const lodash_1 = __importDefault(require("lodash"));
const url_1 = __importDefault(require("url"));
const mongodb_1 = require("mongodb");
const logger_1 = require("../../logger");
const types = ['String', 'Number', 'Boolean', 'ObjectId'];
const formatQuery = (query, options) => {
    const modified = lodash_1.default.mapValues(query, (value) => {
        if (options?.collation) {
            throw new Error('Collations are not supported');
        }
        if (value == null) {
            return value;
        }
        if (types.includes(value.constructor.name)) {
            return { $eq: value };
        }
        return value;
    });
    return modified;
};
exports.formatQuery = formatQuery;
/**
 * Parse an Astra connection URI
 * @param uri a uri in the format of: https://${databaseId}-${region}.apps.astra.datastax.com/${keyspace}?applicationToken=${applicationToken}
 * @returns ParsedUri
 */
const parseUri = (uri) => {
    const parsedUrl = url_1.default.parse(uri, true);
    const baseUrl = `${parsedUrl.protocol}//${parsedUrl.host}`;
    const keyspaceName = parsedUrl.pathname?.replace('/', '');
    const applicationToken = parsedUrl.query?.applicationToken;
    const logLevel = parsedUrl.query?.logLevel;
    if (!keyspaceName) {
        throw new Error('Invalid URI: keyspace is required');
    }
    if (!applicationToken) {
        throw new Error('Invalid URI: applicationToken is required');
    }
    return {
        baseUrl,
        keyspaceName,
        applicationToken,
        logLevel
    };
};
exports.parseUri = parseUri;
/**
 * Create a production Astra connection URI
 * @param databaseId the database id of the Astra database
 * @param region the region of the Astra database
 * @param keyspace the keyspace to connect to
 * @param applicationToken an Astra application token
 * @returns string
 */
const createAstraUri = (databaseId, region, keyspace, applicationToken, logLevel) => {
    let uri = new url_1.default.URL(`https://${databaseId}-${region}.apps.astra.datastax.com`);
    if (keyspace) {
        uri.pathname = `/${keyspace}`;
    }
    if (applicationToken) {
        uri.searchParams.append('applicationToken', applicationToken);
    }
    if (logLevel) {
        uri.searchParams.append('logLevel', logLevel);
    }
    return uri.toString();
};
exports.createAstraUri = createAstraUri;
/**
 *
 * @param doc
 * @returns Object
 */
const addDefaultId = (doc) => {
    if (!doc._id) {
        doc._id = new mongodb_1.ObjectId().toHexString();
    }
    return doc;
};
exports.addDefaultId = addDefaultId;
/**
 *
 * @param options
 * @param cb
 * @returns Object
 */
const setOptionsAndCb = (options, cb) => {
    if (typeof options === 'function') {
        cb = options;
        options = {};
    }
    return { options, cb };
};
exports.setOptionsAndCb = setOptionsAndCb;
/**
 * executeOperation handles running functions that have a callback parameter and that also can
 * return a promise.
 * @param operation a function that takes no parameters and returns a response
 * @param cb a node callback function
 * @returns Promise
 */
const executeOperation = async (operation, cb) => {
    let res = {};
    let err = undefined;
    try {
        res = await operation();
    }
    catch (e) {
        logger_1.logger.error(e.message);
        err = e;
    }
    if (cb) {
        return cb(err, res);
    }
    if (err) {
        throw err;
    }
    return res;
};
exports.executeOperation = executeOperation;
//# sourceMappingURL=utils.js.map