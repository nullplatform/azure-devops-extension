"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const undici_1 = require("undici");
const config_1 = __importDefault(require("./config"));
class HttpClient {
    constructor() {
        this.client = new undici_1.Client(config_1.default.baseUrl);
        this.client = new undici_1.Client(config_1.default.baseUrl);
        this.headers = {
            'Content-type': 'application/json',
        };
    }
    post(path, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.client.request({
                method: 'POST',
                path: path,
                headers: this.headers,
                body: JSON.stringify(body)
            });
            console.log(JSON.stringify(body));
            const statusCode = response.statusCode;
            const responseBody = yield response.body.json();
            yield this.client.close();
            if (statusCode !== 200) {
                throw new Error(`POST to ${path} failed: [${statusCode}] - ${responseBody}`);
            }
            return responseBody;
        });
    }
}
exports.default = HttpClient;
