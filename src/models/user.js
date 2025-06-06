import { userHomePage } from '../core/auth'

import { get } from '../core/api'
import { QRCodeTypeManager } from './qr-types'
/**
 *
 * @returns home page path of logged in user
 */
export function homePage() {
    return userHomePage()
}

export async function getTotalScans({ type } = {}) {
    if (!type) {
        type = new QRCodeTypeManager().getDynamicSlugs().join(',')
    }

    const { response } = await get(`qrcodes/count/scans?type=${type}`)

    return (await response.json()).count
}

export async function getDynamicQRCodeCount() {
    const dynamicTypes = new QRCodeTypeManager().getDynamicSlugs().join(',')

    const { response } = await get(`qrcodes/count?qrcode_type=${dynamicTypes}`)

    return (await response.json()).count
}

export async function getTotalQRCodeCount({ type = 'url' } = {}) {
    const { response } = await get(`qrcodes/count?qrcode_type=${type}`)

    return (await response.json()).count
}
