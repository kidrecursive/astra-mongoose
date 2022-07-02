import { HTTPClient } from '../../client';
import { Collection } from './collection';
interface CollectionCallback {
    (err: Error | undefined, res: undefined): void;
}
export declare class Db {
    httpClient: HTTPClient;
    name: string;
    /**
     *
     * @param astraClient
     * @param name
     */
    constructor(httpClient: HTTPClient, name: string);
    /**
     *
     * @param collectionName
     * @returns Collection
     */
    collection(collectionName: string): Collection;
    /**
     *
     * @param collectionName
     * @param options
     * @param cb
     * @returns Promise
     */
    createCollection(collectionName: string, options?: any, cb?: CollectionCallback): Promise<any>;
    /**
     *
     * @param collectionName
     * @param cb
     * @returns Promise
     */
    dropCollection(collectionName: string, cb?: CollectionCallback): Promise<any>;
    /**
     *
     * @param cb
     * @returns Promise
     */
    dropDatabase(cb?: CollectionCallback): Promise<void>;
}
export {};
