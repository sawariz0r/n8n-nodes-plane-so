
import type {
    IAuthenticateGeneric,
    ICredentialTestRequest,
    ICredentialType,
    INodeProperties,
} from 'n8n-workflow';

export class PlaneApi implements ICredentialType {
    name = 'planeApi';

    displayName = 'Plane API';

    documentationUrl = 'https://docs.plane.so';

    properties: INodeProperties[] = [
        {
            displayName: 'Base URL',
            name: 'url',
            type: 'string',
            default: '',
            placeholder: 'https://plane.example.com',
            required: true,
            description:
                'The base URL of your Plane installation. Include the protocol and omit the trailing slash.',
        },
        {
            displayName: 'API Key',
            name: 'apiKey',
            type: 'string',
            default: '',
            required: true,
            typeOptions: {
                password: true,
            },
            description:
                'Personal API key generated from Plane (Profile → Developer → API Keys).',
        },
        {
            displayName: 'Workspace Slug',
            name: 'workspaceSlug',
            type: 'string',
            default: '',
            required: true,
            description: 'The slug of the workspace that contains your projects.',
        },
    ];

    authenticate: IAuthenticateGeneric = {
        type: 'generic',
        properties: {
            headers: {
                'X-API-Key': '={{$credentials.apiKey}}',
            },
        },
    };

    test: ICredentialTestRequest = {
        request: {
            method: 'GET',
            url: "={{($credentials.url.endsWith('/') ? $credentials.url.slice(0, -1) : $credentials.url) + '/api/v1/workspaces/' + $credentials.workspaceSlug + '/projects/'}}",
        },
    };
}
