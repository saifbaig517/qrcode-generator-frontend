import { Base64Encoder } from './base64-encoder'

const decodeValue = (key) => {
    if (window.QRCG_BUNDLE_TYPE == 'build') {
        key = window.btoa(key)
    }

    const configObject = window.CONFIG

    if (!configObject) return null

    let value = configObject[key]

    if (window.QRCG_BUNDLE_TYPE == 'build') {
        try {
            value = Base64Encoder.decode(value)
        } catch {
            console.log('error while decoding string: ', { key, value })
        }
    }

    return value
}

export const Config = {
    get(key, type = String) {
        let value = undefined
        try {
            value = decodeValue(key)
        } catch {
            if (window.CONFIG) {
                value = window.CONFIG[key]
            }
        }

        if (type === Boolean) {
            if (value === 'true' || value === '1') {
                return true
            }

            return false
        }

        try {
            return JSON.parse(value)
        } catch {
            return value
        }
    },
}
