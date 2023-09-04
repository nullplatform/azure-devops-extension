export const BuildStatus = Object.freeze({
    PENDING: 'pending',
    IN_PROGRESS: 'in_progress',
    FAILED: 'failed',
    SUCCESSFUL: 'successful',
});

export const ActionType = Object.freeze({
    CREATE: 'create',
    UPDATE: 'update',
});

export const Input = Object.freeze({
    ACTION: 'action',
    ID: 'id',
    STATUS: 'status',
    APPLICATION_ID: 'applicationId',
    COMMIT_ID: 'commitId',
    COMMIT_PERMALINK: 'commitPermalink',
    DESCRIPTION: 'description',
    BRANCH: 'branch',
    IMAGE_REPOSITORY_URL: 'imageRepositoryUrl',
});

export const Output = Object.freeze({
    ID: 'id',
    STATUS: 'status',
    APPLICATION_ID: 'applicationId',
});

export const Variable = Object.freeze({
    GITHUB_TOKEN: 'GITHUB_TOKEN',
    NULLPLATFORM_ACCESS_TOKEN: 'NULLPLATFORM_ACCESS_TOKEN',
});
