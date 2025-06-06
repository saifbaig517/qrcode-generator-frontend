import { ConfigHelper } from './config-helper'
import { isEmpty, loadStoredJson, nullOrUndefined, storeJson } from './helpers'

const localStorageKey = 'translate::db'

function getKey(key, rest) {
    if (key instanceof Array) {
        key = key
            .map((part, i) => {
                return part + (nullOrUndefined(rest[i]) ? '' : rest[i])
            })
            .join('')
    }

    return key
}

function cacheKey(key, rest) {
    if (!ConfigHelper.isLocal()) {
        return
    }

    key = getKey(key, rest)

    if (typeof key === 'object') {
        console.error('key is object, expected type is string', { key })
    }

    const language = loadStoredJson(localStorageKey) || {}

    language[key] = ''

    storeJson(language, localStorageKey)
}

export const t = (key, ...rest) => {
    cacheKey(key, rest)

    key = getKey(key, rest)

    let map = window.QRCG_TRANSLATION

    if (isEmpty(map)) {
        map = {}
    }

    if (!map || isEmpty(map[key])) {
        return key
    }

    return map[key]
}
