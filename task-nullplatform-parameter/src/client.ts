import { Client } from 'undici';
import config from "./config";
import tl = require('azure-pipelines-task-lib/task');
import {Variable} from "./enums";
import {isEmpty} from "./validate";

class HttpClient {
    private client = new Client(config.baseUrl);
    private readonly headers: { [key: string]: string };

    constructor() {
        this.client = new Client(config.baseUrl);
        this.headers = {
            'Content-type': 'application/json',
            'Authorization': `Bearer ${tl.getVariable(Variable.NULLPLATFORM_ACCESS_TOKEN) || ""}`
        };
    }

    async get(path: string, query: any): Promise<any> {
        let url = path
        if (!isEmpty(query)) {
            url = `${url}?${query}`
        }
        const response = await this.client.request({
            method: 'GET',
            path: url,
            headers: this.headers,
        });

        const statusCode = response.statusCode;
        const responseBody = await response.body.json();
        console.log(responseBody);
        await this.client.close();

        if (statusCode !== 200) {
            throw new Error(`GET to ${path} failed: [${statusCode}] - ${responseBody}`);
        }

        return responseBody;
    }

    async post(path: string, body: any): Promise<any> {
        const response = await this.client.request({
            method: 'POST',
            path: path,
            headers: this.headers,
            body: JSON.stringify(body)
        });

        const statusCode = response.statusCode;
        const responseBody = await response.body.json();
        await this.client.close();

        if (statusCode !== 200) {
            throw new Error(`POST to ${path} failed: [${statusCode}] - ${responseBody}`);
        }

        return responseBody;
    }
}

export default HttpClient;
