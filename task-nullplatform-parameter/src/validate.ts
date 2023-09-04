class Validate {
    static isEmpty(string: string | undefined | null): boolean {
        return !string;
    }

}
export const isEmpty = Validate.isEmpty;
