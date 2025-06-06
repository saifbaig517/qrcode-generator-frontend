import { isEmpty } from '../core/helpers'

import { Config } from '../core/qrcg-config'

export class QRCodePreviewUrlBuilder {
    host

    constructor(host) {
        this.host = host
    }

    data() {
        const data = this.host.getQrCodeData()

        return data
    }

    type() {
        return this.host.getQrCodeType()
    }

    design() {
        if (typeof this.host.getQrCodeDesign === 'function') {
            return this.host.getQrCodeDesign()
        }

        return {}
    }

    get remoteRecord() {
        try {
            return this.host.getQrCodeRemoteRecord()
        } catch (err) {
            return null
        }
    }

    getId() {
        return this.remoteRecord?.id
    }

    canBuildURL() {
        return !isEmpty(this.data())
    }

    backendTextRendering() {
        if (this.host?.design?.advancedShape === 'pincode-protected')
            return true

        return Config.get('preview.canvasTextRender') === 'disabled'
    }

    buildURL(otherParams = {}) {
        if (!this.canBuildURL()) {
            throw new Error('Cannot build URL now')
        }

        const paramsObj = {
            data: this.data(),
            type: this.type(),
            design: this.design(),
            renderText: this.backendTextRendering(),
            ...otherParams,
        }

        if (this.getId()) {
            paramsObj.id = this.getId()
        }

        this.stringifySubObjects(paramsObj)

        const params = new URLSearchParams(paramsObj).toString()

        return `${Config.get(
            'app.url'
        )}/api/qrcodes/preview?${params}&timestamp=${new Date().getTime()}`
    }

    stringifySubObjects(obj) {
        for (const key in obj) {
            if (typeof obj[key] === 'object') {
                obj[key] = JSON.stringify(obj[key])
            }
        }
    }
}
