const RESOURCE_LIST: ReadonlyArray<string> = Object.freeze([
    'application',
    'build',
    'release',
    'deploy',
]);

class Validate {
    static isEmpty(string: string | undefined | null): boolean {
        return !string;
    }

    static isValidResource(resource: string): boolean {
        return resource != null && RESOURCE_LIST.includes(resource);
    }
}
export const isEmpty = Validate.isEmpty;
export const isValidResource = Validate.isValidResource;
