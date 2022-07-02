interface ParsedUri {
    baseUrl: string;
    keyspaceName: string;
    applicationToken: string;
    logLevel: string;
}
export declare const formatQuery: (query: any, options?: any) => {
    [x: string]: any;
};
/**
 * Parse an Astra connection URI
 * @param uri a uri in the format of: https://${databaseId}-${region}.apps.astra.datastax.com/${keyspace}?applicationToken=${applicationToken}
 * @returns ParsedUri
 */
export declare const parseUri: (uri: string) => ParsedUri;
/**
 * Create a production Astra connection URI
 * @param databaseId the database id of the Astra database
 * @param region the region of the Astra database
 * @param keyspace the keyspace to connect to
 * @param applicationToken an Astra application token
 * @returns string
 */
export declare const createAstraUri: (databaseId: string, region: string, keyspace?: string, applicationToken?: string, logLevel?: string) => string;
/**
 *
 * @param doc
 * @returns Object
 */
export declare const addDefaultId: (doc: any) => any;
/**
 *
 * @param options
 * @param cb
 * @returns Object
 */
export declare const setOptionsAndCb: (options: any, cb: any) => {
    options: any;
    cb: any;
};
/**
 * executeOperation handles running functions that have a callback parameter and that also can
 * return a promise.
 * @param operation a function that takes no parameters and returns a response
 * @param cb a node callback function
 * @returns Promise
 */
export declare const executeOperation: (operation: any, cb: any) => Promise<any>;
export {};
