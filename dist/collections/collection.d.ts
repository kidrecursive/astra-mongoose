import { DeleteResult } from 'mongodb';
import { HTTPClient } from '../client';
interface DocumentCallback {
    (err: Error | undefined, res: any): void;
}
export declare class Collection {
    httpClient: any;
    name: string;
    collectionName: string;
    /**
     *
     * @param httpClient
     * @param name
     */
    constructor(httpClient: HTTPClient, name: string);
    /**
     *
     * @param mongooseDoc
     * @param options
     * @param cb
     * @returns Promise
     */
    insertOne(doc: Record<string, any>, options?: any, cb?: DocumentCallback): Promise<any>;
    insertMany(docs: any, options?: any, cb?: any): Promise<any>;
    private doUpdate;
    updateOne(query: any, update: any, options?: any, cb?: any): Promise<any>;
    updateMany(query: any, update: any, options?: any, cb?: any): Promise<any>;
    replaceOne(query: any, newDoc: any, options?: any, cb?: any): Promise<any>;
    deleteOne(query: any, options?: any, cb?: any): Promise<DeleteResult>;
    deleteMany(query: any, options: any, cb: any): Promise<any>;
    find(query: any, options?: any, cb?: any): any;
    findOne(query: any, options?: any, cb?: any): Promise<any>;
    distinct(key: any, filter: any, options?: any, cb?: any): Promise<any>;
    countDocuments(query: any, options?: any, cb?: any): Promise<any>;
    remove(query: any, options: any, cb: any): Promise<any>;
    insert(docs: any[], options?: any, cb?: any): Promise<any>;
    findOneAndDelete(query: any, options: any, cb: any): Promise<DeleteResult>;
    count(query: any, options: any, cb: any): Promise<any>;
    update(query: any, update: any, options: any, cb: any): Promise<any>;
    findOneAndUpdate(query: any, update: any, options: any, cb: any): Promise<any>;
    /**
     *
     * @param pipeline
     * @param options
     */
    aggregate<T>(pipeline?: any[], options?: any): void;
    /**
     *
     * @param index
     * @param options
     * @param cb
     * @returns any
     */
    createIndex(index: any, options: any, cb: any): Promise<any>;
    /**
     *
     * @param index
     * @param options
     * @param cb
     * @returns any
     */
    dropIndexes(cb?: any): Promise<any>;
}
export {};
