import { isEmpty } from '../core/helpers'

import { t } from '../core/translate'
import { QRCodeTypeManager } from './qr-types'

export class QRCodeModel {
    is_selected = false

    constructor(record) {
        for (const key in record) {
            if (Object.hasOwnProperty.call(record, key)) {
                const value = record[key]

                Object.defineProperty(this, key, {
                    value,
                    enumerable: true,
                })
            }
        }
        if (!this.manager) this.manager = new QRCodeTypeManager()
    }

    getFileUrl() {
        const updated = new Date(this.updated_at).getTime()

        return `${this.svg_url}?v=${updated}`
    }

    getEditLink() {
        return `/dashboard/qrcodes/edit/${this.id}`
    }

    getStatsLink() {
        return `/dashboard/qrcodes/stats/${this.id}`
    }

    getRedirectDestination(preview = true) {
        const r = this.redirect?.route

        if (!r) return null

        return preview ? `${r}?preview=true` : r
    }

    getDate(key) {
        const date = new Date(this[key])

        return date.toLocaleDateString()
    }

    createdAt() {
        return this.getDate('created_at')
    }

    updatedAt() {
        return this.getDate('updated_at')
    }

    isDynamic() {
        return this.manager.isDynamic(this.type)
    }

    getName() {
        if (!this.data) {
            return t('no data')
        }

        if (!isEmpty(this.name)) {
            return this.name
        }

        return t('no name')
    }

    getLink() {
        return ''
    }
}
