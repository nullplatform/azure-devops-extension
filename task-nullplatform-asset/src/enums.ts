export const ActionType = Object.freeze({
    CREATE: 'create',
    UPDATE: 'update',
});

export const Input = Object.freeze({
    ACTION: 'action',
    BUILD_ID: 'buildId',
    TYPE: 'type',
    NAME: 'name',
    URL: 'url',
    METADATA: 'metadata',
});

export const Output = Object.freeze({
    ID: 'id',
    BUILD_ID: 'buildId',
    NAME: 'name',
    TYPE: 'type',
    TARGETS: 'targets',
    METADATA: 'metadata',
});

export const Variable = Object.freeze({
    NULLPLATFORM_ACCESS_TOKEN: 'NULLPLATFORM_ACCESS_TOKEN',
});
