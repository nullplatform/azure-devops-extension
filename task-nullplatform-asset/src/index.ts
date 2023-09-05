import tl = require('azure-pipelines-task-lib/task');
import * as dotenv from 'dotenv';
import HttpClient from './client';
import { isEmpty } from './validate';
import {Input, Output, ActionType} from './enums';

dotenv.config();
const inputToKey = (input: string) => (!isEmpty(input) ? input.replace(/-/g, '_') : "");

const client = new HttpClient();

const getAction = () => tl.getInput(Input.ACTION);

const setFailed = (error: string): void => {
    tl.setResult(tl.TaskResult.Failed, error);
    process.exit(1);
};

const createAsset = () => {
    console.info('Validating inputs...');

    const buildId = tl.getInput(Input.BUILD_ID) || "";
    const name = tl.getInput(Input.NAME);
    const type = tl.getInput(Input.TYPE);
    const url = tl.getInput(Input.URL);

    console.log((buildId))

    if (isEmpty(buildId)) {
        setFailed(`Input "${Input.BUILD_ID}" cannot be empty`);
    }

    if (isEmpty(type)) {
        setFailed(`Input "${Input.TYPE}" cannot be empty`);
    }

    if (!isEmpty(url) && !isEmpty(name)) {
        setFailed(`Input "${Input.NAME}" cannot be together with input ${Input.URL}`);
    }

    const body = {
        [inputToKey(Input.BUILD_ID)]: parseInt(buildId, 10),
        [inputToKey(Input.TYPE)]: type,
        metadata: {},
    };

    if (!isEmpty(url)) {
        body[inputToKey(Input.URL)] = url;
    }

    if (!isEmpty(name)) {
        body[inputToKey(Input.NAME)] = name;
    }

    console.log(body);
    return client.post(`/build/${buildId}/asset`, body);
};


async function run() {
    try {
        const action = getAction();
        let asset = null;
        if (action === ActionType.CREATE) {
            asset = await createAsset();
            console.info(`Successfully created asset with id "${asset.id}"`);
        } else if (action === ActionType.UPDATE) {
            setFailed(`Unsupported action type "${action}"`);
        } else {
            setFailed(`Invalid action type "${action}"`);
        }
        const {
            id,
            build_id: buildId,
            name,
            type,
            targets,
            metadata,
        } = asset;
        tl.setVariable(Output.ID, id);
        tl.setVariable(Output.BUILD_ID, buildId);
        tl.setVariable(Output.NAME, name);
        tl.setVariable(Output.TYPE, type);
        tl.setVariable(Output.TARGETS, targets);
        tl.setVariable(Output.METADATA, metadata);
    } catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, `Asset action failed: ${err.message}`);
            return;
        }
        tl.setResult(tl.TaskResult.Failed, `Unknown error thrown: ${err}`);
    }
}

run();
