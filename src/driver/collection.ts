import { default as MongooseCollection } from 'mongoose/lib/collection';

export class Collection extends MongooseCollection {
  debugType = 'AstraMongooseCollection';

  constructor(name: string, conn: any, options: any) {
    super(name, conn, options);
    this.Promise = options.Promise || Promise;
    this.modelName = options.modelName;
    delete options.modelName;
    this._closed = false;
  }

  get collection() {
    return this.conn.db.collection(this.name);
  }

  async insertOne(doc: any, options: any, cb: any) {
    return await this.collection.insertOne(doc, options, cb);
  }
}
