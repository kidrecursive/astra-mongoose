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
exports.getConnection = exports.Collection = exports.ReadPreference = exports.Decimal128 = exports.ObjectId = exports.Binary = void 0;
const connection_1 = require("./connection");
var mongodb_1 = require("mongodb");
Object.defineProperty(exports, "Binary", { enumerable: true, get: function () { return mongodb_1.Binary; } });
Object.defineProperty(exports, "ObjectId", { enumerable: true, get: function () { return mongodb_1.ObjectId; } });
Object.defineProperty(exports, "Decimal128", { enumerable: true, get: function () { return mongodb_1.Decimal128; } });
Object.defineProperty(exports, "ReadPreference", { enumerable: true, get: function () { return mongodb_1.ReadPreference; } });
var collection_1 = require("./collection");
Object.defineProperty(exports, "Collection", { enumerable: true, get: function () { return collection_1.Collection; } });
const getConnection = () => connection_1.Connection;
exports.getConnection = getConnection;
//# sourceMappingURL=index.js.map