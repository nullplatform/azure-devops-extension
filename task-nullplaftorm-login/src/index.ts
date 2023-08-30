import tl = require('azure-pipelines-task-lib/task');
import HttpClient from './client';
import { isEmpty } from './validate';
import { Variable, Input, Output } from './enums';

async function run() {
    try {
        const client = new HttpClient();

        const apiKey = tl.getInput(Input.API_KEY);

        if (isEmpty(apiKey)) {
            tl.setResult(tl.TaskResult.Failed, `Input "${Input.API_KEY}" cannot be empty`);
        }

        const body = {
            api_key: apiKey
        };
        const { access_token: accessToken } = await client.post('/login', body);

        if (isEmpty(accessToken)) {
            tl.setResult(tl.TaskResult.Failed, `Output "${Output.ACCESS_TOKEN}" cannot be empty`);
        }

        console.info('Successfully logged in into Nullplatform');

        tl.setSecret(accessToken);
        tl.setVariable(Output.ACCESS_TOKEN, accessToken, true, true);
        tl.setVariable(Variable.NULLPLATFORM_ACCESS_TOKEN, accessToken)
    } catch (err) {
        if (err instanceof Error) {
            tl.setResult(tl.TaskResult.Failed, err.message);
            return;
        }
        tl.setResult(tl.TaskResult.Failed, `Unknown error thrown: ${err}`);
    }
}

run();
