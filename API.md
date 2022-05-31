# API Reference
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

<a name="FindCursor"></a>

## FindCursor
**Kind**: global class  

* [FindCursor](#FindCursor)
    * [new FindCursor(collection, query, options)](#new_FindCursor_new)
    * [.toArray(cb)](#FindCursor+toArray) ⇒
    * [.stream(options)](#FindCursor+stream)

<a name="new_FindCursor_new"></a>

### new FindCursor(collection, query, options)

| Param |
| --- |
| collection | 
| query | 
| options | 

<a name="FindCursor+toArray"></a>

### findCursor.toArray(cb) ⇒
**Kind**: instance method of [<code>FindCursor</code>](#FindCursor)  
**Returns**: <p>Promise</p>  

| Param |
| --- |
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

