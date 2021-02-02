export const clean = <T>(obj: T): T => {
    let res: Partial<T> = {};
    for (let key in obj) {
        if (obj[key] !== undefined && obj[key] !== null) {
            res[key] = obj[key];
        }
    }
    return res as T;
};
