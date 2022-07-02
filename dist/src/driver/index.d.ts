import { Connection } from './connection';
export { Binary, ObjectId, Decimal128, ReadPreference } from 'mongodb';
export { Collection } from './collection';
export declare const getConnection: () => typeof Connection;
