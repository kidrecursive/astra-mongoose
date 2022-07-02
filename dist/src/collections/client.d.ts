import { Db } from './db';
import { HTTPClient } from '../../client';
interface ClientOptions {
    applicationToken: string;
    keyspaceName?: string;
    logLevel?: string;
}
interface ClientCallback {
    (err: Error | undefined, client: Client): void;
}
export declare class Client {
    applicationToken: string;
    baseURL: string;
    httpClient: HTTPClient;
    keyspaceName?: string;
    /**
     * Set up a MongoClient that works with the Stargate/Astra document API
     * @param uri an Astra/Stargate connection uri. It should be formed like so if using
     *            Astra: https://${databaseId}-${region}.apps.astra.datastax.com
     * @param options provide the Astra applicationToken here along with the keyspace name (optional)
     */
    constructor(uri: string, options: ClientOptions);
    /**
     * Setup a connection to the Astra/Stargate document API
     * @param uri an Astra/Stargate connection uri. It should be formed like so if using
     *            Astra: https://${databaseId}-${region}.apps.astra.datastax.com/${keyspace}?applicationToken=${applicationToken}
     *            You can also have it formed for you using utils.createAstraUri()
     * @param cb an optional callback whose parameters are (err, client)
     * @returns MongoClient
     */
    static connect(uri: string, cb?: ClientCallback): Promise<Client>;
    /**
     * Connect the MongoClient instance to Astra
     * @param cb an optional callback whose parameters are (err, client)
     * @returns a MongoClient instance
     */
    connect(cb?: ClientCallback): Promise<Client>;
    /**
     * Use a Astra keyspace
     * @param dbName the Astra keyspace to connect to
     * @returns Db
     */
    db(dbName?: string): Db;
    /**
     *
     * @param maxListeners
     * @returns number
     */
    setMaxListeners(maxListeners: number): number;
    /**
     *
     * @param cb
     * @returns Client
     */
    close(cb?: ClientCallback): this;
}
export {};
