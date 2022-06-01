import { Client } from '@/src/collections/client';
import { Collection } from './collection';
import { default as MongooseConnection } from 'mongoose/lib/connection';
import STATES from 'mongoose/lib/connectionstate';
import _ from 'lodash';

export class Connection extends MongooseConnection {
  debugType = 'AstraMongooseConnection';
  constructor(base: any) {
    super(base);
  }

  collection(name: string, options: any) {
    if (!(name in this.collections)) {
      this.collections[name] = new Collection(name, this, options);
    }
    return super.collection(name, options);
  }

  async createCollection(name: string, callback: any) {
    const db = this.client.db();
    return await db.createCollection(name);
  }

  async dropCollection(name: string, callback: any) {
    const db = this.client.db();
    return await db.dropCollection(name);
  }

  openUri(uri: string, options: any, callback: any) {
    if (typeof options === 'function') {
      callback = options;
      options = null;
    }

    this._connectionString = uri;
    this.readyState = STATES.connecting;
    this._closeCalled = false;
    const _this = this;

    return new Promise((resolve, reject) => {
      Client.connect(uri, function (err, client) {
        if (err) {
          _this.readyState = STATES.disconnected;
        }
        _this.client = client;
        _this.db = client.db();
        _this.readyState = STATES.connected;

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

  // NOOPS and unimplemented
}
