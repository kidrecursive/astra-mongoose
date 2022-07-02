import { Collection } from './collection';
interface ResultCallback {
    (err: Error | undefined, res: Array<any>): void;
}
export declare class FindCursor {
    collection: Collection;
    query: any;
    options: any;
    documents: Record<string, any>[];
    status: string;
    nextPageState?: string;
    limit: number;
    /**
     *
     * @param collection
     * @param query
     * @param options
     */
    constructor(collection: any, query: any, options?: any);
    /**
     *
     * @returns void
     */
    private getAll;
    /**
     *
     * @param cb
     * @returns Promise
     */
    toArray(cb?: ResultCallback): Promise<Array<any>>;
    /**
     *
     * @param iterator
     * @param cb
     */
    forEach(iterator: any, cb?: any): Promise<any>;
    /**
     *
     * @param options
     * @param cb
     * @returns Promise<number>
     */
    count(options?: any, cb?: any): Promise<any>;
    /**
     *
     * @param options
     */
    stream(options?: any): void;
}
export {};
