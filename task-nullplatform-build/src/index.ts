import tl = require('azure-pipelines-task-lib/task');
import HttpClient from './client';
import {isEmpty, isValidResource} from './validate';
import {BuildStatus, Input, Output, ActionType} from './enums';

const client = new HttpClient();
const getAction = (): string => tl.getInput(Input.ACTION ) || "";

const setFailed = (error: string): void => {
    tl.setResult(tl.TaskResult.Failed, error);
    process.exit(1);
};

const buildRepositoryCommitWebUrl = (repositoryUri: string) => {
    const orgPattern = /[^@]+@[^/]+\//;
    const modifiedUrl = repositoryUri.replace(orgPattern, '');
    return `https://dev.azure.com/${modifiedUrl}/commit`;
}

const createBuild = (): Promise<any> => {
    console.info('Validating inputs...');

    const status = BuildStatus.IN_PROGRESS;
    const applicationId: string = tl.getInput(Input.APPLICATION_ID) || "";
    const commitId: string = tl.getInput(Input.COMMIT_ID) || tl.getVariable('BUILD_SOURCE_VERSION') || "";
    const commitPermalink: string = tl.getInput(Input.COMMIT_PERMALINK)
        || `${buildRepositoryCommitWebUrl(tl.getVariable('BUILD_REPOSITORY_URI') || "")}/${tl.getVariable('BUILD_SOURCEVERSION') || ""}`;
    const description: string = tl.getInput(Input.DESCRIPTION)
        || tl.getVariable('BUILD_SOURCEVERSIONMESSAGE') || "";
    const branch: string = tl.getInput(Input.BRANCH) || tl.getVariable('BUILD_SOURCEBRANCHNAME') || "";

    if (isEmpty(status)) {
        setFailed(`Input "${Input.STATUS}" cannot be empty`);
    }

    if (isEmpty(applicationId)) {
        setFailed(`Input "${Input.APPLICATION_ID}" cannot be empty`);
    }

    if (isEmpty(commitId)) {
        setFailed(`Input "${Input.COMMIT_ID}" cannot be empty`);
    }

    if (isEmpty(commitPermalink)) {
        setFailed(`Input "${Input.COMMIT_PERMALINK}" cannot be empty`);
    }

    if (isEmpty(description)) {
        setFailed(`Input "${Input.DESCRIPTION}" cannot be empty`);
    }

    if (isEmpty(branch)) {
        setFailed(`Input "${Input.BRANCH}" cannot be empty`);
    }

    const body = {
        status,
        application_id: applicationId,
        commit: {
            id: commitId,
            permalink: commitPermalink,
        },
        description,
        branch,
    };

    return client.post('build', body);
};

const updateBuild = async (): Promise<any> => {
    console.info('Validating inputs...');

    const id: string = tl.getInput(Input.ID) || "";
    const status = tl.getInput(Input.STATUS) || "";
    const imageRepositoryUrl: string = tl.getInput(Input.IMAGE_REPOSITORY_URL) || "";

    if (isEmpty(id)) {
        setFailed(`Input "${Input.ID}" cannot be empty`);
    }

    if (isEmpty(status)) {
        setFailed(`Input "${Input.STATUS}" cannot be empty`);
    }

    const body = {
        id: parseInt(id, 10),
        status,
    };

    return await client.patch(`build/${id}`, body);
};


async function run() {
    try {
        const action = getAction();
        let build = null;
        if (action === ActionType.CREATE) {
            build = await createBuild();
            console.info(`Successfully created build with id "${build.id}"`);
        } else if (action === ActionType.UPDATE) {
            build = await updateBuild();
            console.info(`Successfully updated build with id "${build.id}" and status "${build.status}"`);
        } else {
            setFailed(`Invalid action type "${action}"`);
        }
        const { id, status, application_id: applicationId } = build;

        tl.setVariable(Output.ID, id, false, true);
        tl.setVariable(Output.STATUS, status, false, true);
        tl.setVariable(Output.APPLICATION_ID, applicationId, false, true);
    } catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, `Build action failed: ${err.message}`);
            return;
        }
        tl.setResult(tl.TaskResult.Failed, `Unknown error thrown: ${err}`);
    }
}

run();
