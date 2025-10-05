import type { IExecuteFunctions, ILoadOptionsFunctions, INodeExecutionData, INodeType, INodeTypeDescription } from 'n8n-workflow';
export declare class Plane implements INodeType {
    description: INodeTypeDescription;
    methods: {
        loadOptions: {
            getProjects(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
                description: string;
            }[]>;
            getStates(this: ILoadOptionsFunctions): Promise<{
                name: string;
                value: string;
            }[]>;
        };
    };
    execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]>;
}
