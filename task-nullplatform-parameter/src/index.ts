import tl = require('azure-pipelines-task-lib/task');
import * as dotenv from 'dotenv';
import HttpClient from './client';
import { isEmpty } from './validate';
import { Input } from './enums';

dotenv.config();

const client = new HttpClient();

const setFailed = (error: string): void => {
    tl.setResult(tl.TaskResult.Failed, error);
    process.exit(1);
};
async function run() {
    try {
        const applicationId = tl.getInput(Input.APPLICATION_ID);

        console.info('Validating inputs...');

        if (isEmpty(applicationId)) {
            setFailed(`Input "${Input.APPLICATION_ID}" cannot be empty`);
        }

        const parameters = await client.get(`/application/${applicationId}/parameter`, null);

        // eslint-disable-next-line no-restricted-syntax
        for (const { name, value, secret } of parameters) {
            tl.setVariable(name, value, secret, true)
            tl.setVariable(name, value, secret)
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
