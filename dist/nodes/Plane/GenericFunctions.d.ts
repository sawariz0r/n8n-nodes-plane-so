import type { IDataObject, IExecuteFunctions, IHookFunctions, ILoadOptionsFunctions, IWebhookFunctions } from 'n8n-workflow';
export type PlaneCredentialData = {
    url: string;
    apiKey: string;
    workspaceSlug: string;
};
type PlaneContext = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions;
export declare function planeApiRequest(this: PlaneContext, method: string, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<any>;
export declare function planeApiRequestAllItems(this: PlaneContext, method: string, endpoint: string, body?: IDataObject, qs?: IDataObject): Promise<IDataObject[]>;
export {};
