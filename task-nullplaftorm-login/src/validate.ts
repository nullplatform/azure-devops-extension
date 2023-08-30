class Validate {
    static isEmpty(str: string | undefined) {
        return !str;
    }
}
export const isEmpty = Validate.isEmpty;
