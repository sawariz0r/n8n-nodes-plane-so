
import type {
    IDataObject,
    IExecuteFunctions,
    IHttpRequestMethods,
    IHookFunctions,
    ILoadOptionsFunctions,
    IRequestOptions,
    IWebhookFunctions,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

export type PlaneCredentialData = {
    url: string;
    apiKey: string;
    workspaceSlug: string;
};

type PlaneContext = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions;

export async function planeApiRequest(
    this: PlaneContext,
    method: string,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
) {
    const credentials = (await this.getCredentials('planeApi')) as PlaneCredentialData;

    if (!credentials?.url || !credentials?.apiKey || !credentials?.workspaceSlug) {
        throw new NodeOperationError(this.getNode(), 'Missing credentials for Plane API');
    }

    const baseUrl = credentials.url.replace(/\/$/, '');
    const workspacePrefix = `workspaces/${credentials.workspaceSlug}/`;
    const sanitizedEndpoint = endpoint.startsWith('workspaces/')
        ? endpoint.replace(/^\//, '')
        : `${workspacePrefix}${endpoint.replace(/^\//, '')}`;

    const options: IRequestOptions = {
        method: method.toUpperCase() as IHttpRequestMethods,
        uri: `${baseUrl}/api/v1/${sanitizedEndpoint}`,
        qs,
        body,
        headers: {
            'X-API-Key': credentials.apiKey,
        },
        json: true,
    };

    if (method.toUpperCase() === 'GET') {
        delete options.body;
    }

    try {
        return await this.helpers.request!(options);
    } catch (error) {
        throw new NodeOperationError(this.getNode(), error as Error);
    }
}

export async function planeApiRequestAllItems(
    this: PlaneContext,
    method: string,
    endpoint: string,
    body: IDataObject = {},
    qs: IDataObject = {},
) {
    const returnData: IDataObject[] = [];

    let responseData: IDataObject;
    let requestQs = { ...qs };

    do {
        responseData = (await planeApiRequest.call(this, method, endpoint, body, requestQs)) as IDataObject;

        const results = responseData.results as IDataObject[] | undefined;

        if (!Array.isArray(results)) {
            throw new NodeOperationError(
                this.getNode(),
                'Unexpected API response format: expected an array of results.',
            );
        }

        returnData.push(...results);

        const nextCursor = responseData.next_cursor as string | null | undefined;

        if (nextCursor) {
            requestQs = {
                ...requestQs,
                cursor: nextCursor,
            };
        } else {
            break;
        }
    } while (responseData?.next_cursor);

    return returnData;
}
