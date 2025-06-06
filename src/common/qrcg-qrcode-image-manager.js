import { get } from '../core/api'
import { SvgPngConverter } from './qrcg-svg-png-converter'

export class QRCodeImageManager {
    #svgApiUrl

    #objectUrls = []

    constructor() {}

    withUrl(svgApiUrl) {
        this.#svgApiUrl = svgApiUrl

        return this
    }

    #getUrl() {
        return this.#svgApiUrl
    }

    async #createObjectURL(blob) {
        const url = URL.createObjectURL(blob)

        this.#objectUrls.push(url)

        await this.preloadImage(url)

        return url
    }

    #clearObjectURLs() {
        this.#objectUrls.forEach((url) => URL.revokeObjectURL(url))
    }

    async #fetchSvgString({ decodeBase64 } = {}) {
        const { response } = await get(this.#getUrl())

        const data = await response.json()

        if (decodeBase64) return window.atob(data.content)

        return data.content
    }

    async getSvgBase64String() {
        return this.#fetchSvgString({
            decodeBase64: false,
        })
    }

    async getSvgString() {
        return this.#fetchSvgString({
            decodeBase64: true,
        })
    }

    async getSvgObjectUrl() {
        const svg = await this.getSvgString()

        var blob = new Blob([svg], {
            type: 'image/svg+xml;charset=utf-8',
        })

        return this.#createObjectURL(blob)
    }

    async getPngObjectUrl({ width = 300, height = 300 }) {
        const url = await this.getSvgObjectUrl()

        const converter = new SvgPngConverter(url)

        await converter.renderSvgImage()

        const blob = await converter.getPngBlob(width, height)

        return this.#createObjectURL(blob)
    }

    async preloadImage(url) {
        return new Promise((resolve) => {
            const img = new Image()

            img.onload = (() => {
                const _img = img
                return () => {
                    setTimeout(() => {
                        _img.remove()
                        resolve()
                    }, 50)
                }
            })()

            img.src = url
        })
    }

    disconnect() {
        this.#clearObjectURLs()
    }
}
