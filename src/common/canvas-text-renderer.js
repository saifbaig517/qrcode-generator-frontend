import { isEmpty } from '../core/helpers'

export class CanvasTextRenderer {
    fontSize = 60

    canvasHeight = 80
    cavasWidth = 1000

    async render({ text, color, fontFamily, fontVariant = '900' }) {
        const fontFaces = await this.loadGoogleFont(fontFamily, fontVariant)

        const fontStyle = this.getFontStyle(fontVariant, fontFaces)

        const canvas = this.print(text, color, fontFamily, fontStyle)

        return this.trim(canvas).toDataURL()
    }

    getFontStyle(fontVariant, fontFaces) {
        if (fontVariant === 'regular') return ''

        let fontVariantMatch = fontVariant.match(/\d+/)

        const weight = !isEmpty(fontVariantMatch) ? fontVariantMatch[0] : '400'

        let fontStyle = fontVariant.replace(weight, '')

        if (isEmpty(fontStyle)) {
            fontStyle = fontFaces[0].fontStyle
        }

        const fontVariantFound = !!fontFaces.find(
            (font) => font.fontStyle == fontStyle && font.weight == weight
        )

        if (!fontVariantFound) {
            return ''
        }

        // add a space between numbers and words
        return fontVariant.replace(/(\d+)/, ($1) => $1 + ' ')
    }

    print(text, color, fontFamily, fontStyle) {
        const ctx = document.createElement('canvas').getContext('2d', {
            willReadFrequently: true,
        })

        ctx.canvas.width = this.cavasWidth
        ctx.canvas.height = this.canvasHeight

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        ctx.font = `${fontStyle} ${this.fontSize}px ${fontFamily}`

        ctx.fillStyle = color

        ctx.fillText(text, 0, this.fontSize)

        return ctx.canvas
    }

    async loadGoogleFont(fontFamily, fontVariant) {
        const url = `https://fonts.googleapis.com/css?family=${fontFamily.replace(
            / /g,
            '+'
        )}:${fontVariant}`

        const styleSheet = await (await fetch(url)).text()

        let fontFaces = this.parseStyleSheet(fontFamily, styleSheet)

        let promises = fontFaces.map((parsedFont) =>
            this.loadFontFace(parsedFont)
        )

        await Promise.all(promises)

        return fontFaces
    }

    loadFontFace(parsedFont) {
        const fontFace = new FontFace(
            parsedFont.fontFamily,
            `url(${parsedFont.src})`,
            {
                unicodeRange: parsedFont.unicodeRange,
                style: parsedFont.fontStyle,
                weight: parsedFont.weight,
            }
        )

        document.fonts.add(fontFace)

        return fontFace.load()
    }

    parseStyleSheet(fontFamily, styleSheet) {
        let fontFaces = styleSheet.match(/@font-face {(\n|.)*?}/g)

        fontFaces = fontFaces.map((string) => {
            return {
                fontFamily,
                unicodeRange: string.match(/unicode-range: (.*);/)[1],
                src: string.match(/src: url\((.*?)\)/)[1],
                fontStyle: string.match(/font-style: (.*);/)[1],
                weight: string.match(/font-weight: (.*);/)[1],
            }
        })

        return fontFaces
    }

    trim(c) {
        c.getContext('2d', {})
        var ctx = c.getContext('2d', {
                willReadFrequently: true,
            }),
            copy = document.createElement('canvas').getContext('2d', {
                willReadFrequently: true,
            }),
            pixels = ctx.getImageData(0, 0, c.width, c.height),
            l = pixels.data.length,
            i,
            bound = {
                top: null,
                left: null,
                right: null,
                bottom: null,
            },
            x,
            y

        for (i = 0; i < l; i += 4) {
            if (pixels.data[i + 3] !== 0) {
                x = (i / 4) % c.width
                y = ~~(i / 4 / c.width)

                if (bound.top === null) {
                    bound.top = y
                }

                if (bound.left === null) {
                    bound.left = x
                } else if (x < bound.left) {
                    bound.left = x
                }

                if (bound.right === null) {
                    bound.right = x
                } else if (bound.right < x) {
                    bound.right = x
                }

                if (bound.bottom === null) {
                    bound.bottom = y
                } else if (bound.bottom < y) {
                    bound.bottom = y
                }
            }
        }

        var trimHeight = bound.bottom - bound.top,
            trimWidth = bound.right - bound.left,
            trimmed = ctx.getImageData(
                bound.left,
                bound.top,
                trimWidth,
                trimHeight
            )

        copy.canvas.width = trimWidth
        copy.canvas.height = trimHeight
        copy.putImageData(trimmed, 0, 0)

        // open new window with trimmed image:
        return copy.canvas
    }
}
