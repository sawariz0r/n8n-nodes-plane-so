"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plane = void 0;
const n8n_workflow_1 = require("n8n-workflow");
const GenericFunctions_1 = require("./GenericFunctions");
class Plane {
    constructor() {
        this.description = {
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
        this.methods = {
            loadOptions: {
                async getProjects() {
                    const projects = await GenericFunctions_1.planeApiRequestAllItems.call(this, 'GET', 'projects/');
                    return projects.map((project) => ({
                        name: `${project.name}${project.identifier ? ` (${project.identifier})` : ''}`,
                        value: project.id,
                        description: project.description,
                    }));
                },
                async getStates() {
                    var _a, _b;
                    const nodeParameters = ((_a = this.getCurrentNodeParameters()) !== null && _a !== void 0 ? _a : {});
                    const projectId = nodeParameters.projectId;
                    if (!projectId) {
                        return [];
                    }
                    const response = (await GenericFunctions_1.planeApiRequest.call(this, 'GET', `projects/${projectId}/states/`));
                    const states = Array.isArray(response)
                        ? response
                        : ((_b = response.results) !== null && _b !== void 0 ? _b : []);
                    return states.map((state) => ({
                        name: state.name,
                        value: state.id,
                    }));
                },
            },
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const resource = this.getNodeParameter('resource', i);
                const operation = this.getNodeParameter('operation', i);
                if (resource === 'project') {
                    if (operation === 'getAll') {
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const qs = {};
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i);
                            qs.limit = limit;
                            qs.page_size = limit;
                        }
                        let responseData;
                        if (returnAll) {
                            responseData = await GenericFunctions_1.planeApiRequestAllItems.call(this, 'GET', 'projects/', {}, qs);
                        }
                        else {
                            const response = (await GenericFunctions_1.planeApiRequest.call(this, 'GET', 'projects/', {}, qs));
                            const results = response.results;
                            responseData = Array.isArray(results) ? results : [];
                        }
                        for (const data of responseData) {
                            returnData.push({ json: data });
                        }
                    }
                }
                else if (resource === 'task') {
                    if (operation === 'getAll') {
                        const projectId = this.getNodeParameter('projectId', i);
                        const returnAll = this.getNodeParameter('returnAll', i);
                        const qs = {};
                        if (!returnAll) {
                            const limit = this.getNodeParameter('limit', i);
                            qs.limit = limit;
                            qs.page_size = limit;
                        }
                        const endpoint = `projects/${projectId}/issues/`;
                        let responseData;
                        if (returnAll) {
                            responseData = await GenericFunctions_1.planeApiRequestAllItems.call(this, 'GET', endpoint, {}, qs);
                        }
                        else {
                            const response = (await GenericFunctions_1.planeApiRequest.call(this, 'GET', endpoint, {}, qs));
                            const results = response.results;
                            responseData = Array.isArray(results) ? results : [];
                        }
                        for (const data of responseData) {
                            returnData.push({ json: data });
                        }
                    }
                    else if (operation === 'create') {
                        const projectId = this.getNodeParameter('projectId', i);
                        const name = this.getNodeParameter('name', i);
                        const description = this.getNodeParameter('description', i);
                        const additionalFields = this.getNodeParameter('additionalFields', i);
                        const body = {
                            name,
                        };
                        if (description) {
                            body.description_html = description;
                        }
                        Object.assign(body, additionalFields);
                        const response = await GenericFunctions_1.planeApiRequest.call(this, 'POST', `projects/${projectId}/issues/`, body);
                        returnData.push({ json: response });
                    }
                    else if (operation === 'update') {
                        const projectId = this.getNodeParameter('projectId', i);
                        const issueId = this.getNodeParameter('issueId', i);
                        const updateFields = this.getNodeParameter('updateFields', i);
                        if (!Object.keys(updateFields).length) {
                            throw new n8n_workflow_1.NodeOperationError(this.getNode(), 'No update fields set.');
                        }
                        const response = await GenericFunctions_1.planeApiRequest.call(this, 'PATCH', `projects/${projectId}/issues/${issueId}/`, updateFields);
                        returnData.push({ json: response });
                    }
                }
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Plane = Plane;
