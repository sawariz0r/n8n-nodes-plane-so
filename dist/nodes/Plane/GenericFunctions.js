"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planeApiRequest = planeApiRequest;
exports.planeApiRequestAllItems = planeApiRequestAllItems;
const n8n_workflow_1 = require("n8n-workflow");
async function planeApiRequest(method, endpoint, body = {}, qs = {}) {
    const credentials = (await this.getCredentials('planeApi'));
    if (!(credentials === null || credentials === void 0 ? void 0 : credentials.url) || !(credentials === null || credentials === void 0 ? void 0 : credentials.apiKey) || !(credentials === null || credentials === void 0 ? void 0 : credentials.workspaceSlug)) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Missing credentials for Plane API');
    }
    const baseUrl = credentials.url.replace(/\/$/, '');
    const workspacePrefix = `workspaces/${credentials.workspaceSlug}/`;
    const sanitizedEndpoint = endpoint.startsWith('workspaces/')
        ? endpoint.replace(/^\//, '')
        : `${workspacePrefix}${endpoint.replace(/^\//, '')}`;
    const options = {
        method: method.toUpperCase(),
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
        return await this.helpers.request(options);
    }
    catch (error) {
        throw new n8n_workflow_1.NodeOperationError(this.getNode(), error);
    }
}
async function planeApiRequestAllItems(method, endpoint, body = {}, qs = {}) {
    const returnData = [];
    let responseData;
    let requestQs = { ...qs };
    do {
        responseData = (await planeApiRequest.call(this, method, endpoint, body, requestQs));
        const results = responseData.results;
        if (!Array.isArray(results)) {
            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'Unexpected API response format: expected an array of results.');
        }
        returnData.push(...results);
        const nextCursor = responseData.next_cursor;
        if (nextCursor) {
            requestQs = {
                ...requestQs,
                cursor: nextCursor,
            };
        }
        else {
            break;
        }
    } while (responseData === null || responseData === void 0 ? void 0 : responseData.next_cursor);
    return returnData;
}
