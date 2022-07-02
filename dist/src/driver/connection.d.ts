import { default as MongooseConnection } from 'mongoose/lib/connection';
export declare class Connection extends MongooseConnection {
    debugType: string;
    constructor(base: any);
    collection(name: string, options: any): any;
    createCollection(name: string, callback: any): Promise<any>;
    dropCollection(name: string, callback: any): Promise<any>;
    openUri(uri: string, options: any, callback: any): Promise<unknown>;
    /**
     *
     * @param cb
     * @returns Client
     */
    doClose(force?: boolean, cb?: (err: Error | undefined) => void): this;
}
