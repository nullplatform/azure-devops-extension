interface Config {
    baseUrl: string;
}

const config: Config = Object.freeze({
    baseUrl: process.env.BASE_URL || 'https://ci.nullplatform.com',
});

export default config;
