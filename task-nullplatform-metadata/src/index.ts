import tl = require('azure-pipelines-task-lib/task');
import * as dotenv from 'dotenv';
import HttpClient from './client';
import { isEmpty, isValidResource } from './validate';
import {
    Resource,
    Input,
    Output,
    ApplicationStatus,
} from './enums';

dotenv.config();

const inputToQuery = (input: any) => (!isEmpty(input) ? input.replace(/-/g, '_') : null);

const buildApplicationQuery = () => {
    const query: Record<string, string | undefined> = {};
    const name = tl.getInput(Input.NAME);
    const repositoryUrl = tl.getInput(Input.CODE_REPOSITORY.URL) || buildRepositoryWebUrl(tl.getVariable('BUILD_REPOSITORY_URI') || "")
    console.log(repositoryUrl);
    const repositoryAppPath = tl.getInput(Input.CODE_REPOSITORY.APPLICATION_PATH);
    const status = tl.getInput(Input.STATUS);

    if (!isEmpty(name)) {
        query[inputToQuery(Input.NAME)] = name;
    }

    if (!isEmpty(repositoryUrl)) {
        query[inputToQuery('REPOSITORY_URL')] = repositoryUrl;
    }

    if (!isEmpty(repositoryUrl) && !isEmpty(repositoryAppPath)) {
        query[inputToQuery('REPOSITORY_APP_PATH')] = repositoryAppPath;
    }

    query[inputToQuery(Input.STATUS)] = isEmpty(status) ? ApplicationStatus.ACTIVE : status;

    return query;
};

const buildRepositoryWebUrl = (repositoryUri: string) => {
    const repositoryUrl = repositoryUri.split('/').slice(0, -2).join('/');
    const parsedUrl = new URL(repositoryUrl);
    return `https://${parsedUrl.hostname}${parsedUrl.pathname}`;
}

// @ts-ignore
const buildQuery = (resource: Resource) => {
    let queryObject: Record<string, string | undefined> = {};
    switch (resource) {
        case Resource.APPLICATION:
            queryObject = buildApplicationQuery();
            break;
        case Resource.BUILD:
            // Not supported yet
            break;
        case Resource.RELEASE:
            // Not supported yet
            break;
        case Resource.DEPLOYMENT:
            // Not supported yet
            break;
        default:
            // No query
            break;
    }
    // @ts-ignore
    return new URLSearchParams(queryObject).toString();
};


async function run() {
    try {

        const client = new HttpClient();

        const resource = tl.getInput(Input.RESOURCE) || undefined;

        console.info('Validating inputs...');

        if (isEmpty(resource)) {
            tl.setResult(tl.TaskResult.Failed, 'Input "resource" cannot be empty');
        } else if (!isValidResource(<string>resource)) {
            tl.setResult(tl.TaskResult.Failed, 'Input "resource" must be one of these valid resources: application, build, release, deployment');
        }

        const query = buildQuery(resource);
        console.info(`Getting Nullplatform metadata for ${resource} resource with query: ${query}...`);

        if (resource != null) {
            const result = await client.get(`/${resource}`, query);
            console.info(`Successfully queried ${resource} resource, got ${result.length} results`);
            tl.setVariable(Output.METADATA, JSON.stringify(JSON.stringify(result)), false, true);
        }
    } catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
            return;
        }
        tl.setResult(tl.TaskResult.Failed, `Unknown error thrown: ${err}`);
    }
}

run();
