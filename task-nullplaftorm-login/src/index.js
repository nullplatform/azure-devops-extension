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
const tl = require("azure-pipelines-task-lib/task");
const client_1 = __importDefault(require("./client"));
const validate_1 = require("./validate");
const enums_1 = require("./enums");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = new client_1.default();
            const apiKey = tl.getInput(enums_1.Input.API_KEY);
            if ((0, validate_1.isEmpty)(apiKey)) {
                tl.setResult(tl.TaskResult.Failed, `Input "${enums_1.Input.API_KEY}" cannot be empty`);
            }
            const body = {
                api_key: apiKey
            };
            const { access_token: accessToken } = yield client.post('/login', body);
            if ((0, validate_1.isEmpty)(accessToken)) {
                tl.setResult(tl.TaskResult.Failed, `Output "${enums_1.Output.ACCESS_TOKEN}" cannot be empty`);
            }
            console.info('Successfully logged in into Nullplatform');
            tl.setSecret(accessToken);
            tl.setVariable(enums_1.Output.ACCESS_TOKEN, accessToken, true, true);
            tl.setVariable(enums_1.Variable.NULLPLATFORM_ACCESS_TOKEN, accessToken);
        }
        catch (err) {
            if (err instanceof Error) {
                tl.setResult(tl.TaskResult.Failed, err.message);
                return;
            }
            tl.setResult(tl.TaskResult.Failed, `Unknown error thrown: ${err}`);
        }
    });
}
run();
