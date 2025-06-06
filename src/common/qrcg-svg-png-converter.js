export class SvgPngConverter {
    #svgContent

    constructor(svgUrl, name) {
        this.svgUrl = svgUrl
        this.name = name
    }

    withSvgContent(svgContent) {
        this.#svgContent = svgContent

        return this
    }

    async #fetchIfNeeded() {
        if (this.#svgContent) return

        this.response = await fetch(this.svgUrl)
    }

    async #getSvgContent() {
        if (this.#svgContent) return this.#svgContent

        return this.response.clone().text()
    }

    async renderSvgImage() {
        await this.#fetchIfNeeded()

        const src = URL.createObjectURL(await this.getResponseBlob())

        return new Promise((resolve) => {
            this.image = document.createElement('img')

            this.image.setAttribute('crossOrigin', 'anonymous')

            this.image.onload = () => {
                resolve()

                this.image.onload = null
            }

            this.image.style = `position: fixed; top: -999999px; max-width: initial !important;`

            document.body.appendChild(this.image)

            this.image.src = src
        })
    }

    async getViewboxSize() {
        const text = await this.#getSvgContent()

        const line = text.substring(0, 500)

        const viewBox = line
            .match(/viewBox="(.*?)"/)[1]
            .split(' ')
            .map((n) => +n)

        const width = viewBox[2],
            height = viewBox[3]

        return [width, height]
    }

    async getResponseBlob() {
        const blobType = 'image/svg+xml'

        let text = await this.#getSvgContent()

        const length = 700

        let line = text.substring(0, length)

        let svgTag = line.match(/<svg.*?>/)[0]

        const [width, height] = await this.getViewboxSize()

        if (!svgTag.match('width'))
            line = line.replace(
                '<svg',
                `<svg width="${width}px" height="${height}px"`
            )

        text = line + text.substring(length)

        return new Blob([text], {
            type: blobType,
        })
    }

    getPngBlob(width = 0, height = 0) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas')

            this.getViewboxSize().then(([w, h]) => {
                canvas.width = width === 0 ? w : width

                canvas.height = height === 0 ? h : (height * h) / w

                const ctx = canvas.getContext('2d')

                ctx.globalAlpha = 100

                ctx.drawImage(this.image, 0, 0, canvas.width, canvas.height)

                canvas.toBlob((blob) => {
                    URL.revokeObjectURL(this.image.src)

                    this.image.remove()

                    resolve(blob)

                    canvas.remove()

                    this.image = null
                })
            })
        })
    }

    downloadBlob(data) {
        const link = document.createElement('a')

        link.download = this.name

        link.href = URL.createObjectURL(data)

        document.body.appendChild(link)

        link.click()

        setTimeout(() => {
            URL.revokeObjectURL(link.href)

            link.remove()
        }, 50)
    }

    async downloadPng(width = 0, height = 0) {
        await this.renderSvgImage()

        const data = await this.getPngBlob(width, height)

        this.downloadBlob(data)
    }
}
