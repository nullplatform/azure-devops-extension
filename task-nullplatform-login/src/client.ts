import { Client } from 'undici';
import config from "./config";

class HttpClient {
    private client = new Client(config.baseUrl);
    private readonly headers: { [key: string]: string };

    constructor() {
        this.client = new Client(config.baseUrl);
        this.headers = {
            'Content-type': 'application/json',
        };
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
