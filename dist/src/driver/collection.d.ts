import { default as MongooseCollection } from 'mongoose/lib/collection';
export declare class Collection extends MongooseCollection {
    debugType: string;
    constructor(name: string, conn: any, options: any);
    get collection(): any;
    find(query: any, options?: any, cb?: any): any;
    findOne(query: any, options?: any, cb?: any): Promise<any>;
    insertOne(doc: any, options?: any, cb?: any): Promise<any>;
    insert(docs: any, options?: any, cb?: any): Promise<any>;
    insertMany(docs: any, options?: any, cb?: any): Promise<any>;
    findAndModify(query: any, update: any, options?: any, cb?: any): Promise<any>;
    findOneAndUpdate(query: any, update: any, options?: any, cb?: any): Promise<any>;
    findOneAndDelete(query: any, options?: any, cb?: any): Promise<any>;
    findOneAndReplace(query: any, newDoc: any, options?: any, cb?: any): Promise<any>;
    deleteMany(query: any, options?: any, cb?: any): Promise<any>;
    remove(query: any, options: any, cb: any): Promise<any>;
    dropIndexes(cb?: any): Promise<any>;
}
