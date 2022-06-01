# astra-mongoose

![tests workflow](https://github.com/kidrecursive/astra-mongoose/actions/workflows/main.yml/badge.svg)

`astra-mongoose` is a mongoose driver for [Astra DB](https://astra.datastax.com).

## Table of contents

1. [Quickstart](#quickstart)
2. [Compatability](#compatability)
3. [MongoDB Driver Overriding](#nodejs-mongodb-driver-overriding-experimental)
4. [API Reference](#api-reference)

## Quickstart

To get started, install the the package and then override the `node-mongodb-native` driver that mongoose sets up by default. After that, set up your connection to Astra DB and get started! Refer to the combatability section of the README to see what will just work and what won't.

```bash
npm i -s astra-mongoose
```

```javascript
import mongoose from 'mongoose';
import { driver, createAstraUri } from 'astra-mongoose';

// override the default mongodb native driver
mongoose.driver.set(astraMongooseDriver);
mongoose.Connection = astraMongooseDriver.getConnection();
mongoose.Collection = astraMongooseDriver.Collection;
mongoose.connections = [new mongoose.Connection(mongoose)];

// create an Astra DB URI
const astraUri = createAstraUri(
  process.env.ASTRA_DB_ID,
  process.env.ASTRA_DB_REGION,
  process.env.ASTRA_DB_KEYSPACE,
  process.env.ASTRA_DB_APPLICATION_TOKEN
);

// get mongoose connected to Astra
await mongoose.connect(astraUri);
```

## Compatability

MongoDB and AstraDB have some key differences that this library attempts to account for. However, there are some features that are not supported at this time. The tables below cover what is supported, not supported, and in progress. Please refer to them if your application is not behaving as expected.

### Query Operators

These are operators that are available when forming a MongoDB compatible query or providing options to a Cursor.

| Operation      | Status        | Notes                                                             |
| -------------- | ------------- | ----------------------------------------------------------------- |
| $eq            | supported     |                                                                   |
| $gt            | supported     |                                                                   |
| $gte           | supported     |                                                                   |
| $in            | supported     |                                                                   |
| $lt            | supported     |                                                                   |
| $lte           | supported     |                                                                   |
| $ne            | supported     |                                                                   |
| $nin           | supported     |                                                                   |
| $and           | supported     |                                                                   |
| $not           | not supported |                                                                   |
| $nor           | not supported |                                                                   |
| $or            | supported     |                                                                   |
| $exists        | supported     |                                                                   |
| $type          | not supported |                                                                   |
| $expr          | not supported |                                                                   |
| $jsonSchema    | in progress   | [Issue](https://github.com/datastax-labs/astra-mongoose/issues/2) |
| $mod           | not supported |                                                                   |
| $regex         | not supported |                                                                   |
| $text          | not supported |                                                                   |
| $where         | not supported |                                                                   |
| $geoIntersects | not supported |                                                                   |
| $geoWithin     | not supported |                                                                   |
| $near          | not supported |                                                                   |
| $nearSphere    | not supported |                                                                   |
| $all           | not supported |                                                                   |
| $elemMatch     | not supported |                                                                   |
| $size          | not supported |                                                                   |
| $bitsAllClear  | not supported |                                                                   |
| $bitsAllSet    | not supported |                                                                   |
| $bitsAnyClear  | not supported |                                                                   |
| $bitsAnySet    | not supported |                                                                   |
| $              | not supported |                                                                   |
| $elemMatch     | not supported |                                                                   |
| $meta          | not supported |                                                                   |
| $slice         | not supported |                                                                   |
| $comment       | in progress   | [Issue](https://github.com/datastax-labs/astra-mongoose/issues/3) |
| $rand          | in progress   | [Issue](https://github.com/datastax-labs/astra-mongoose/issues/4) |
| projection     | supported     |                                                                   |
| sort           | not supported |                                                                   |
| skip           | not supported |                                                                   |
| limit          | supported     | The maximum page size is 20                                       |
| collation      | not supported |                                                                   |

### Update Operators

These are operators that are available when forming a MongoDB compatible update operation.

| Operation    | Status      | Notes                                                              |
| ------------ | ----------- | ------------------------------------------------------------------ |
| $addFields   | supported   |                                                                    |
| $set         | supported   |                                                                    |
| $projection  | in progress | [Issue](https://github.com/datastax-labs/astra-mongoose/issues/10) |
| $unset       | in progress | [Issue](https://github.com/datastax-labs/astra-mongoose/issues/10) |
| $replaceRoot | supported   |                                                                    |
| $replaceWith | supported   |                                                                    |

### Collection Operations

These are operations that are available when working with a mongodb Collection or a Mongoose Model.

| Operation                 | Status          | Notes                                                              |
| ------------------------- | --------------- | ------------------------------------------------------------------ |
| aggregate                 | not supported   |                                                                    |
| bulkWrite                 | supported       |                                                                    |
| count                     | limited support | [Issue](https://github.com/datastax-labs/astra-mongoose/issues/11) |
| countDocuments            | limited support | [Issue](https://github.com/datastax-labs/astra-mongoose/issues/11) |
| estimatedDocumentCount    | limited support | [Issue](https://github.com/datastax-labs/astra-mongoose/issues/11) |
| createIndex               | not supported   |                                                                    |
| deleteMany                | supported       |                                                                    |
| deleteOne                 | supported       |                                                                    |
| distinct                  | not supported   |                                                                    |
| drop                      | supported       |                                                                    |
| dropIndex                 | not supported   |                                                                    |
| find                      | supported       |                                                                    |
| findOne                   | supported       |                                                                    |
| findOneAndDelete          | supported       |                                                                    |
| findOneAndReplace         | supported       |                                                                    |
| findOneAndUpdate          | supported       |                                                                    |
| indexExists               | not supported   |                                                                    |
| indexes                   | not supported   |                                                                    |
| indexInformation          | not supported   |                                                                    |
| initializeOrderedBulkOp   | supported       |                                                                    |
| initializeUnorderedBulkOp | supported       |                                                                    |
| insert                    | supported       |                                                                    |
| insertMany                | supported       |                                                                    |
| insertOne                 | supported       |                                                                    |
| isCapped                  | not supported   |                                                                    |
| mapReduce                 | not supported   |                                                                    |
| options                   | not supported   |                                                                    |
| rename                    | not supported   |                                                                    |
| replaceOne                | supported       |                                                                    |
| stats                     | not supported   |                                                                    |
| update                    | supported       |                                                                    |
| updateMany                | supported       |                                                                    |
| updateOne                 | supported       |                                                                    |
| watch                     | not supported   |                                                                    |

### Database Operations

These are operations that are available when working with a mongodb Db or a Mongoose Connection.

| Operation        | Status        | Notes |
| ---------------- | ------------- | ----- |
| aggregate        | not supported |       |
| collection       | supported     |       |
| collections      | supported     |       |
| listCollections  | supported     |       |
| createCollection | supported     |       |
| createIndex      | not supported |       |
| dropCollection   | supported     |       |
| dropDatabase     | not supported |       |
| renameCollection | not supported |       |
| stats            | not supported |       |
| watch            | not supported |       |

### Index Operations

MongoDB compatible index operations are not supported. There is one caveat for `ttl` indexes: When adding a document, you can add a `ttl` option (determined in seconds) that will behave in the similar way to a `ttl` index. For example, with the collections client:

```javascript
import { Client, createAstraUri } from 'astra-mongoose';

// create an Astra DB URI
const astraUri = createAstraUri(
  process.env.ASTRA_DB_ID,
  process.env.ASTRA_DB_REGION,
  process.env.ASTRA_DB_KEYSPACE,
  process.env.ASTRA_DB_APPLICATION_TOKEN
);

// connect to Astra
const client = await Client.connect(astraUri);

// get a collection
const collection = client.db().collection('docs');

// insert and expire this document in 10 seconds
await collection.insertOne({ hello: 'world' }, { ttl: 10 });
```

### Aggregation Operations

MongoDB compatible aggregation operations are not supported.

### Transaction Operations

MongoDB compatible transaction operations are not supported.

## NodeJS MongoDB Driver Overriding (experimental)

If you have an application that uses the NodeJS MongoDB driver, or a dependency that uses the NodeJS MongoDB driver, it is possible to override it's use with the collections package of `astra-mongoose`. This makes your application use Astra DB documents instead of MongoDB documents. Doing so requires code changes in your application that address the compatibility section of this README, and a change in how you set up your client connection.

If your application uses `mongodb` you can override it's usage like so:

In your app's `mongodb` `package.json` entry:

```json
"mongodb": "astra-mongoose@0.1.0",
```

Then, re-install your dependencies

```bash
npm i
```

Finally, modify your connection so that your driver connects to Astra

```javascript
import { MongoClient, createAstraUri } from 'astra-mongoose';

// create an Astra DB URI
const astraUri = createAstraUri(
  process.env.ASTRA_DB_ID,
  process.env.ASTRA_DB_REGION,
  process.env.ASTRA_DB_KEYSPACE,
  process.env.ASTRA_DB_APPLICATION_TOKEN
);

// connect to Astra
const client = await MongoClient.connect(astraUri);
```

If you have an application dependency that uses `mongodb`, you can override it's usage like so (this example uses `mongoose`):

Add an override to your app's `package.json` (requires NPM 8.3+), also, add `astra-mongoose as a dependency:

```json
"dependencies": {
    "astra-mongoose": "^0.1.0"
},
"overrides": {
    "mongoose": {
        "mongodb":  "astra-mongoose@0.1.0"
    }
},
```

Then, re-install your dependencies

```bash
npm i
```

Finally, modify your depdendencies connection so that your driver connects to Astra

```javascript
import mongoose from 'mongoose';
import { createAstraUri } from 'astra-mongoose';

// create an Astra DB URI
const astraUri = createAstraUri(
  process.env.ASTRA_DB_ID,
  process.env.ASTRA_DB_REGION,
  process.env.ASTRA_DB_KEYSPACE,
  process.env.ASTRA_DB_APPLICATION_TOKEN
);

// connect to Astra
await mongoose.connect(astraUri);
```

## API Reference
## Classes

<dl>
<dt><a href="#Client">Client</a></dt>
<dd></dd>
<dt><a href="#Collection">Collection</a></dt>
<dd></dd>
<dt><a href="#FindCursor">FindCursor</a></dt>
<dd></dd>
<dt><a href="#Db">Db</a></dt>
<dd></dd>
</dl>

## Members

<dl>
<dt><a href="#formatQuery">formatQuery</a> ⇒</dt>
<dd><p>Parse an Astra connection URI</p></dd>
<dt><a href="#parseUri">parseUri</a> ⇒</dt>
<dd><p>Create a production Astra connection URI</p></dd>
<dt><a href="#createAstraUri">createAstraUri</a> ⇒</dt>
<dd></dd>
<dt><a href="#addDefaultId">addDefaultId</a> ⇒</dt>
<dd></dd>
<dt><a href="#setOptionsAndCb">setOptionsAndCb</a> ⇒</dt>
<dd><p>executeOperation handles running functions that have a callback parameter and that also can
return a promise.</p></dd>
</dl>

<a name="Client"></a>

## Client
**Kind**: global class  

* [Client](#Client)
    * [new Client(uri, options)](#new_Client_new)
    * _instance_
        * [.connect(cb)](#Client+connect) ⇒
        * [.db(dbName)](#Client+db) ⇒
        * [.setMaxListeners(maxListeners)](#Client+setMaxListeners) ⇒
        * [.close(cb)](#Client+close) ⇒
    * _static_
        * [.connect(uri, cb)](#Client.connect) ⇒

<a name="new_Client_new"></a>

### new Client(uri, options)
<p>Set up a MongoClient that works with the Stargate/Astra document API</p>


| Param | Type | Description |
| --- | --- | --- |
| uri | <code>databaseId</code> | <p>an Astra/Stargate connection uri. It should be formed like so if using Astra: https://$-${region}.apps.astra.datastax.com</p> |
| options |  | <p>provide the Astra applicationToken here along with the keyspace name (optional)</p> |

<a name="Client+connect"></a>

### client.connect(cb) ⇒
<p>Connect the MongoClient instance to Astra</p>

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <p>a MongoClient instance</p>  

| Param | Description |
| --- | --- |
| cb | <p>an optional callback whose parameters are (err, client)</p> |

<a name="Client+db"></a>

### client.db(dbName) ⇒
<p>Use a Astra keyspace</p>

**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <p>Db</p>  

| Param | Description |
| --- | --- |
| dbName | <p>the Astra keyspace to connect to</p> |

<a name="Client+setMaxListeners"></a>

### client.setMaxListeners(maxListeners) ⇒
**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <p>number</p>  

| Param |
| --- |
| maxListeners | 

<a name="Client+close"></a>

### client.close(cb) ⇒
**Kind**: instance method of [<code>Client</code>](#Client)  
**Returns**: <p>Client</p>  

| Param |
| --- |
| cb | 

<a name="Client.connect"></a>

### Client.connect(uri, cb) ⇒
<p>Setup a connection to the Astra/Stargate document API</p>

**Kind**: static method of [<code>Client</code>](#Client)  
**Returns**: <p>MongoClient</p>  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>databaseId</code> | <p>an Astra/Stargate connection uri. It should be formed like so if using Astra: https://$-${region}.apps.astra.datastax.com/${keyspace}?applicationToken=${applicationToken} You can also have it formed for you using utils.createAstraUri()</p> |
| cb |  | <p>an optional callback whose parameters are (err, client)</p> |

<a name="Collection"></a>

## Collection
**Kind**: global class  

* [Collection](#Collection)
    * [new Collection(httpClient, name)](#new_Collection_new)
    * [.insertOne(mongooseDoc, options, cb)](#Collection+insertOne) ⇒
    * [.aggregate(pipeline, options)](#Collection+aggregate)
    * [.createIndex(index, options, cb)](#Collection+createIndex) ⇒

<a name="new_Collection_new"></a>

### new Collection(httpClient, name)

| Param |
| --- |
| httpClient | 
| name | 

<a name="Collection+insertOne"></a>

### collection.insertOne(mongooseDoc, options, cb) ⇒
**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Returns**: <p>Promise</p>  

| Param |
| --- |
| mongooseDoc | 
| options | 
| cb | 

<a name="Collection+aggregate"></a>

### collection.aggregate(pipeline, options)
**Kind**: instance method of [<code>Collection</code>](#Collection)  

| Param |
| --- |
| pipeline | 
| options | 

<a name="Collection+createIndex"></a>

### collection.createIndex(index, options, cb) ⇒
**Kind**: instance method of [<code>Collection</code>](#Collection)  
**Returns**: <p>any</p>  

| Param |
| --- |
| index | 
| options | 
| cb | 

<a name="FindCursor"></a>

## FindCursor
**Kind**: global class  

* [FindCursor](#FindCursor)
    * [new FindCursor(collection, query, options)](#new_FindCursor_new)
    * [.getAll()](#FindCursor+getAll) ⇒
    * [.toArray(cb)](#FindCursor+toArray) ⇒
    * [.forEach(iterator, cb)](#FindCursor+forEach)
    * [.count(options, cb)](#FindCursor+count) ⇒
    * [.stream(options)](#FindCursor+stream)

<a name="new_FindCursor_new"></a>

### new FindCursor(collection, query, options)

| Param |
| --- |
| collection | 
| query | 
| options | 

<a name="FindCursor+getAll"></a>

### findCursor.getAll() ⇒
**Kind**: instance method of [<code>FindCursor</code>](#FindCursor)  
**Returns**: <p>void</p>  
<a name="FindCursor+toArray"></a>

### findCursor.toArray(cb) ⇒
**Kind**: instance method of [<code>FindCursor</code>](#FindCursor)  
**Returns**: <p>Promise</p>  

| Param |
| --- |
| cb | 

<a name="FindCursor+forEach"></a>

### findCursor.forEach(iterator, cb)
**Kind**: instance method of [<code>FindCursor</code>](#FindCursor)  

| Param |
| --- |
| iterator | 
| cb | 

<a name="FindCursor+count"></a>

### findCursor.count(options, cb) ⇒
**Kind**: instance method of [<code>FindCursor</code>](#FindCursor)  
**Returns**: <p>Promise<number></p>  

| Param |
| --- |
| options | 
| cb | 

<a name="FindCursor+stream"></a>

### findCursor.stream(options)
**Kind**: instance method of [<code>FindCursor</code>](#FindCursor)  

| Param |
| --- |
| options | 

<a name="Db"></a>

## Db
**Kind**: global class  

* [Db](#Db)
    * [new Db(astraClient, name)](#new_Db_new)
    * [.collection(collectionName)](#Db+collection) ⇒
    * [.createCollection(collectionName, options, cb)](#Db+createCollection) ⇒
    * [.dropCollection(collectionName, cb)](#Db+dropCollection) ⇒
    * [.dropDatabase(cb)](#Db+dropDatabase) ⇒

<a name="new_Db_new"></a>

### new Db(astraClient, name)

| Param |
| --- |
| astraClient | 
| name | 

<a name="Db+collection"></a>

### db.collection(collectionName) ⇒
**Kind**: instance method of [<code>Db</code>](#Db)  
**Returns**: <p>Collection</p>  

| Param |
| --- |
| collectionName | 

<a name="Db+createCollection"></a>

### db.createCollection(collectionName, options, cb) ⇒
**Kind**: instance method of [<code>Db</code>](#Db)  
**Returns**: <p>Promise</p>  

| Param |
| --- |
| collectionName | 
| options | 
| cb | 

<a name="Db+dropCollection"></a>

### db.dropCollection(collectionName, cb) ⇒
**Kind**: instance method of [<code>Db</code>](#Db)  
**Returns**: <p>Promise</p>  

| Param |
| --- |
| collectionName | 
| cb | 

<a name="Db+dropDatabase"></a>

### db.dropDatabase(cb) ⇒
**Kind**: instance method of [<code>Db</code>](#Db)  
**Returns**: <p>Promise</p>  

| Param |
| --- |
| cb | 

<a name="formatQuery"></a>

## formatQuery ⇒
<p>Parse an Astra connection URI</p>

**Kind**: global variable  
**Returns**: <p>ParsedUri</p>  

| Param | Type | Description |
| --- | --- | --- |
| uri | <code>databaseId</code> | <p>a uri in the format of: https://$-${region}.apps.astra.datastax.com/${keyspace}?applicationToken=${applicationToken}</p> |

<a name="parseUri"></a>

## parseUri ⇒
<p>Create a production Astra connection URI</p>

**Kind**: global variable  
**Returns**: <p>string</p>  

| Param | Description |
| --- | --- |
| databaseId | <p>the database id of the Astra database</p> |
| region | <p>the region of the Astra database</p> |
| keyspace | <p>the keyspace to connect to</p> |
| applicationToken | <p>an Astra application token</p> |

<a name="createAstraUri"></a>

## createAstraUri ⇒
**Kind**: global variable  
**Returns**: <p>Object</p>  

| Param |
| --- |
| doc | 

<a name="addDefaultId"></a>

## addDefaultId ⇒
**Kind**: global variable  
**Returns**: <p>Object</p>  

| Param |
| --- |
| options | 
| cb | 

<a name="setOptionsAndCb"></a>

## setOptionsAndCb ⇒
<p>executeOperation handles running functions that have a callback parameter and that also can
return a promise.</p>

**Kind**: global variable  
**Returns**: <p>Promise</p>  

| Param | Description |
| --- | --- |
| operation | <p>a function that takes no parameters and returns a response</p> |
| cb | <p>a node callback function</p> |

