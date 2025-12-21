

export function pick(obj: any, keys: string[]) {
    return Object.fromEntries(keys.map(k => [k, obj[k]]));
}
