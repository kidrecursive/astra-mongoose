import { AxiosRequestConfig } from 'axios';
interface AstraClientOptions {
    applicationToken: string;
    baseUrl?: string;
    databaseId?: string;
    databaseRegion?: string;
    authHeaderName?: string;
    logLevel?: string;
}
interface RequestOptions {
    'page-size': string;
    where?: any;
    ttl?: string;
}
export declare class HTTPClient {
    baseUrl: string;
    applicationToken: string;
    authHeaderName: string;
    logLevel: string;
    constructor(options: AstraClientOptions);
    _request(options: AxiosRequestConfig): Promise<any>;
    get(path: string, options?: RequestOptions): Promise<any>;
    post(path: string, data: Record<string, any>, options?: RequestOptions): Promise<any>;
    put(path: string, data: Record<string, any>, options?: RequestOptions): Promise<any>;
    patch(path: string, data: Record<string, any>, options?: RequestOptions): Promise<any>;
    delete(path: string, options?: RequestOptions): Promise<any>;
}
export {};
