
import type {
    IDataObject,
    IExecuteFunctions,
    ILoadOptionsFunctions,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

import { planeApiRequest, planeApiRequestAllItems } from './GenericFunctions';

export class Plane implements INodeType {
    description: INodeTypeDescription = {
        displayName: 'Plane',
        name: 'plane',
        icon: 'file:plane.svg',
        group: ['transform'],
        version: 1,
        subtitle: '={{$parameter["resource"] + ": " + $parameter["operation"]}}',
        description: 'Interact with Plane work management platform.',
        defaults: {
            name: 'Plane',
        },
        inputs: ['main'],
        outputs: ['main'],
        credentials: [
            {
                name: 'planeApi',
                required: true,
            },
        ],
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Project',
                        value: 'project',
                    },
                    {
                        name: 'Task',
                        value: 'task',
                    },
                ],
                default: 'task',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['project'],
                    },
                },
                options: [
                    {
                        name: 'Get Many',
                        value: 'getAll',
                        description: 'Retrieve many projects',
                        action: 'Get many projects',
                    },
                ],
                default: 'getAll',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['task'],
                    },
                },
                options: [
                    {
                        name: 'Create',
                        value: 'create',
                        description: 'Create a task',
                        action: 'Create a task',
                    },
                    {
                        name: 'Get Many',
                        value: 'getAll',
                        description: 'Retrieve many tasks in a project',
                        action: 'Get many tasks',
                    },
                    {
                        name: 'Update',
                        value: 'update',
                        description: 'Update a task',
                        action: 'Update a task',
                    },
                ],
                default: 'getAll',
            },
            {
                displayName: 'Project',
                name: 'projectId',
                type: 'options',
                typeOptions: {
                    loadOptionsMethod: 'getProjects',
                },
                displayOptions: {
                    show: {
                        resource: ['task'],
                    },
                },
                options: [],
                default: '',
                required: true,
                description: 'Project that the task belongs to.',
            },
            {
                displayName: 'Return All',
                name: 'returnAll',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: ['project'],
                        operation: ['getAll'],
                    },
                },
            },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 50,
                typeOptions: {
                    minValue: 1,
                    maxValue: 500,
                },
                displayOptions: {
                    show: {
                        resource: ['project'],
                        operation: ['getAll'],
                        returnAll: [false],
                    },
                },
                description: 'Max number of projects to return',
            },
            {
                displayName: 'Return All',
                name: 'returnAll',
                type: 'boolean',
                default: false,
                displayOptions: {
                    show: {
                        resource: ['task'],
                        operation: ['getAll'],
                    },
                },
            },
            {
                displayName: 'Limit',
                name: 'limit',
                type: 'number',
                default: 100,
                typeOptions: {
                    minValue: 1,
                    maxValue: 1000,
                },
                displayOptions: {
                    show: {
                        resource: ['task'],
                        operation: ['getAll'],
                        returnAll: [false],
                    },
                },
                description: 'Max number of tasks to return',
            },
            {
                displayName: 'Name',
                name: 'name',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['task'],
                        operation: ['create'],
                    },
                },
                description: 'Title of the task',
            },
            {
                displayName: 'Description',
                name: 'description',
                type: 'string',
                typeOptions: {
                    rows: 4,
                },
                default: '',
                displayOptions: {
                    show: {
                        resource: ['task'],
                        operation: ['create'],
                    },
                },
            },
            {
                displayName: 'Additional Fields',
                name: 'additionalFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['task'],
                        operation: ['create'],
                    },
                },
                options: [
                    {
                        displayName: 'Assignee IDs',
                        name: 'assignees',
                        type: 'string',
                        typeOptions: {
                            multipleValues: true,
                            multipleValueButtonText: 'Add Assignee',
                        },
                        default: [],
                    },
                    {
                        displayName: 'Label IDs',
                        name: 'labels',
                        type: 'string',
                        typeOptions: {
                            multipleValues: true,
                            multipleValueButtonText: 'Add Label',
                        },
                        default: [],
                    },
                    {
                        displayName: 'Priority',
                        name: 'priority',
                        type: 'string',
                        default: '',
                        description: 'Priority value configured in Plane (for example: urgent, high, medium, low)',
                    },
                    {
                        displayName: 'Start Date',
                        name: 'start_date',
                        type: 'dateTime',
                        default: '',
                    },
                    {
                        displayName: 'Target Date',
                        name: 'target_date',
                        type: 'dateTime',
                        default: '',
                    },
                    {
                        displayName: 'State',
                        name: 'state',
                        type: 'options',
                        typeOptions: {
                            loadOptionsDependsOn: ['projectId'],
                            loadOptionsMethod: 'getStates',
                        },
                        default: '',
                        description: 'Status/state for the task',
                    },
                    {
                        displayName: 'Estimate Points',
                        name: 'point',
                        type: 'number',
                        default: 0,
                        description: 'Numeric estimate assigned to the task',
                    },
                ],
            },
            {
                displayName: 'Issue ID',
                name: 'issueId',
                type: 'string',
                required: true,
                default: '',
                displayOptions: {
                    show: {
                        resource: ['task'],
                        operation: ['update'],
                    },
                },
                description: 'The UUID of the task to update',
            },
            {
                displayName: 'Update Fields',
                name: 'updateFields',
                type: 'collection',
                placeholder: 'Add Field',
                default: {},
                displayOptions: {
                    show: {
                        resource: ['task'],
                        operation: ['update'],
                    },
                },
                options: [
                    {
                        displayName: 'Assignee IDs',
                        name: 'assignees',
                        type: 'string',
                        typeOptions: {
                            multipleValues: true,
                            multipleValueButtonText: 'Add Assignee',
                        },
                        default: [],
                    },
                    {
                        displayName: 'Description',
                        name: 'description_html',
                        type: 'string',
                        typeOptions: {
                            rows: 4,
                        },
                        default: '',
                    },
                    {
                        displayName: 'Label IDs',
                        name: 'labels',
                        type: 'string',
                        typeOptions: {
                            multipleValues: true,
                            multipleValueButtonText: 'Add Label',
                        },
                        default: [],
                    },
                    {
                        displayName: 'Name',
                        name: 'name',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Priority',
                        name: 'priority',
                        type: 'string',
                        default: '',
                    },
                    {
                        displayName: 'Start Date',
                        name: 'start_date',
                        type: 'dateTime',
                        default: '',
                    },
                    {
                        displayName: 'State',
                        name: 'state',
                        type: 'options',
                        typeOptions: {
                            loadOptionsDependsOn: ['projectId'],
                            loadOptionsMethod: 'getStates',
                        },
                        default: '',
                    },
                    {
                        displayName: 'Target Date',
                        name: 'target_date',
                        type: 'dateTime',
                        default: '',
                    },
                ],
            },
        ],
    };

    methods = {
        loadOptions: {
            async getProjects(this: ILoadOptionsFunctions) {
                const projects = await planeApiRequestAllItems.call(this, 'GET', 'projects/');

                return projects.map((project) => ({
                    name: `${project.name as string}${project.identifier ? ` (${project.identifier})` : ''}`,
                    value: project.id as string,
                    description: project.description as string,
                }));
            },
            async getStates(this: ILoadOptionsFunctions) {
                const nodeParameters = (this.getCurrentNodeParameters() ?? {}) as IDataObject;
                const projectId = nodeParameters.projectId as string | undefined;

                if (!projectId) {
                    return [];
                }

                const response = (await planeApiRequest.call(
                    this,
                    'GET',
                    `projects/${projectId}/states/`,
                )) as IDataObject | IDataObject[];

                const states = Array.isArray(response)
                    ? response
                    : ((response.results as IDataObject[]) ?? []);

                return states.map((state) => ({
                    name: state.name as string,
                    value: state.id as string,
                }));
            },
        },
    };

    async execute(this: IExecuteFunctions) {
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i) as string;
                const operation = this.getNodeParameter('operation', i) as string;

                if (resource === 'project') {
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
                        const qs: IDataObject = {};

                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i) as number;
                            qs.limit = limit;
                            qs.page_size = limit;
                        }

                        let responseData: IDataObject[];

                        if (returnAll) {
                            responseData = await planeApiRequestAllItems.call(this, 'GET', 'projects/', {}, qs);
                        } else {
                            const response = (await planeApiRequest.call(
                                this,
                                'GET',
                                'projects/',
                                {},
                                qs,
                            )) as IDataObject;
                            const results = response.results as IDataObject[] | undefined;
                            responseData = Array.isArray(results) ? results : [];
                        }

                        for (const data of responseData) {
                            returnData.push({ json: data });
                        }
                    }
                } else if (resource === 'task') {
                    if (operation === 'getAll') {
                        const projectId = this.getNodeParameter('projectId', i) as string;
                        const returnAll = this.getNodeParameter('returnAll', i) as boolean;
                        const qs: IDataObject = {};

                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i) as number;
                            qs.limit = limit;
                            qs.page_size = limit;
                        }

                        const endpoint = `projects/${projectId}/issues/`;

                        let responseData: IDataObject[];

                        if (returnAll) {
                            responseData = await planeApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                        } else {
                            const response = (await planeApiRequest.call(
                                this,
                                'GET',
                                endpoint,
                                {},
                                qs,
                            )) as IDataObject;

                            const results = response.results as IDataObject[] | undefined;
                            responseData = Array.isArray(results) ? results : [];
                        }

                        for (const data of responseData) {
                            returnData.push({ json: data });
                        }
                    } else if (operation === 'create') {
                        const projectId = this.getNodeParameter('projectId', i) as string;
                        const name = this.getNodeParameter('name', i) as string;
                        const description = this.getNodeParameter('description', i) as string;
                        const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

                        const body: IDataObject = {
                            name,
                        };

                        if (description) {
                            body.description_html = description;
                        }

                        Object.assign(body, additionalFields);

                        const response = await planeApiRequest.call(
                            this,
                            'POST',
                            `projects/${projectId}/issues/`,
                            body,
                        );

                        returnData.push({ json: response as IDataObject });
                    } else if (operation === 'update') {
                        const projectId = this.getNodeParameter('projectId', i) as string;
                        const issueId = this.getNodeParameter('issueId', i) as string;
                        const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

                        if (!Object.keys(updateFields).length) {
                            throw new NodeOperationError(this.getNode(), 'No update fields set.');
                        }

                        const response = await planeApiRequest.call(
                            this,
                            'PATCH',
                            `projects/${projectId}/issues/${issueId}/`,
                            updateFields,
                        );

                        returnData.push({ json: response as IDataObject });
                    }
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: (error as Error).message } });
                    continue;
                }
                throw error;
            }
        }

        return [returnData];
    }
}
