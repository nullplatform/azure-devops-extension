export const Resource = Object.freeze({
    APPLICATION: 'application',
    BUILD: 'build',
    ASSET: 'asset',
    RELEASE: 'release',
    DEPLOYMENT: 'deployment',
});

export const ApplicationStatus = Object.freeze({
    PENDING: 'pending',
    CREATING: 'creating',
    UPDATING: 'updating',
    ACTIVE: 'active',
    INACTIVE: 'inactive',
    FAILED: 'failed',
});

export const Input = Object.freeze({
    RESOURCE: 'resource',
    NAME: 'name',
    STATUS: 'status',
    CODE_REPOSITORY: {
        URL: 'code-repository-url',
        APPLICATION_PATH: 'code-repository-application-path',
    },
});

export const Output = Object.freeze({
    METADATA: 'metadata',
});

export const Variable = Object.freeze({
    NULLPLATFORM_ACCESS_TOKEN: 'NULLPLATFORM_ACCESS_TOKEN',
});
