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
    APPLICATION_ID: 'application-id',
    COMMIT_ID: 'commit-id',
    COMMIT_PERMALINK: 'commit-permalink',
    DESCRIPTION: 'description',
    BRANCH: 'branch',
    IMAGE_REPOSITORY_URL: 'image-repository-url',
});

export const Output = Object.freeze({
    ID: 'id',
    STATUS: 'status',
    APPLICATION_ID: 'application-id',
});

export const Variable = Object.freeze({
    GITHUB_TOKEN: 'GITHUB_TOKEN',
    NULLPLATFORM_ACCESS_TOKEN: 'NULLPLATFORM_ACCESS_TOKEN',
});
