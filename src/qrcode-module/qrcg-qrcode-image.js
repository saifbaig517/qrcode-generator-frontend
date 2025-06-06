import { LitElement, html, css } from 'lit'

import { classMap } from 'lit/directives/class-map.js'

import { isEmpty, url } from '../core/helpers'

import { Config } from '../core/qrcg-config'

import '../ui/qrcg-loader'

import { iPhoneSafari } from '../core/helpers'

import { t } from '../core/translate'

import { QRCodeImageManager } from '../common/qrcg-qrcode-image-manager'

import { ConfigHelper } from '../core/config-helper'

export class QRCG_QRcodeImage extends LitElement {
    imageManager = new QRCodeImageManager()

    get defaultImage() {
        return url('assets/images/default-qrcode-placeholder.png')
    }

    static get styles() {
        return css`
            :host {
                display: block;
                position: relative;
                user-select: none;
                -webkit-user-select: none;
            }

            :host([preview-on-dbl-click]) {
                cursor: pointer;
            }

            .image {
                padding-bottom: 100%;
                width: 100%;
                background-position: center;
                background-size: contain;
                background-repeat: no-repeat;
                position: relative;
                transition: opacity 0.5s ease-in-out;
            }

            .instructions {
                color: var(--gray-2);
                font-size: 0.8rem;
                text-align: center;
                margin-top: 1rem;
            }

            qrcg-loader {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translateX(-50%) translateY(-50%) scale(0.5);
            }

            .inactive {
                opacity: 0.5;
            }

            .loading {
                opacity: 0.1;
            }

            svg {
                width: 100%;
                height: 100%;
            }

            #svg-container {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
            }
        `
    }

    static get properties() {
        return {
            url: {},
            imageUrl: {
                state: true,
            },
            loading: {
                type: Boolean,
                state: true,
            },
            previewOnDblClick: {
                type: Boolean,
                attribute: 'preview-on-dbl-click',
                reflect: true,
            },
            dblClickUrl: {
                attribute: 'dbl-click-url',
            },
            converToPng: {
                type: Boolean,
                attribute: 'convert-to-png',
            },
            renderSvgTag: {
                type: Boolean,
                attribute: 'render-svg-tag',
            },
            svgContent: {},
        }
    }

    constructor() {
        super()

        this.loaders = 0
        this.clickCount = 0
        this.converToPng = false
        this.renderSvgTag = false
        this.svgContent = ''
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('click', this.onClick)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
        this.imageManager.disconnect()
    }

    onClick = () => {
        this.clickCount++

        this.dblClickHandle = setTimeout(() => {
            this.clickCount = 0
        }, 500)

        if (this.clickCount > 1) {
            if (!this.previewOnDblClick) {
                return
            }

            this.clickCount = 0

            window.open(
                QRCG_QRcodeImage.getPreviewPageUrl(this.dblClickUrl),
                '_blank'
            )
        }
    }

    static getPreviewPageUrl(url) {
        //

        const params = {
            src: url,
        }

        const searchParams = new URLSearchParams(params).toString()

        return (
            Config.get('app.url') +
            '/dashboard/qrcodes/designer/preview?' +
            searchParams
        )
    }

    updated(changed) {
        if (changed.has('url')) {
            this.fetch()
        }
    }

    shouldRenderPng() {
        return !iPhoneSafari() || this.converToPng
    }

    fetch() {
        try {
            this.doFetch()
        } catch (ex) {
            if (ConfigHelper.isLocal()) {
                console.error(ex)
            }
        }
    }

    async doFetch() {
        if (isEmpty(this.url)) {
            this.imageUrl = null
            return
        }

        this.loading = ++this.loaders > 0

        this.imageManager.withUrl(this.url)

        if (this.renderSvgTag) {
            this.svgContent = await this.imageManager.getSvgString()

            this.updateComplete.then(() => {
                this.renderSvgContent()
            })
        } else if (this.shouldRenderPng()) {
            this.imageUrl = await this.imageManager.getPngObjectUrl({
                width: 300,
                height: 300,
            })
        } else {
            this.imageUrl = await this.imageManager.getSvgObjectUrl()
        }

        this.loading = --this.loaders > 0
    }

    renderSvgContent() {
        const svgContainer = this.shadowRoot.querySelector('#svg-container')

        if (!svgContainer) {
            return
        }

        if (isEmpty(this.svgContent)) {
            svgContainer.innerHTML = ''
            return
        }

        svgContainer.innerHTML = this.svgContent

        this.dispatchEvent(
            new CustomEvent('qrcg-qrcode-image:svg-after-render', {
                composed: true,
                bubbles: true,
                detail: {
                    svgContainer,
                },
            })
        )
    }

    renderSvgContainer() {
        const containerBackgroundImage = isEmpty(this.svgContent)
            ? this.defaultImage
            : ''

        return html`
            <div
                class=${classMap({
                    image: true,
                    inactive: isEmpty(this.svgContent),
                    loading: this.loading,
                })}
                style="background-image:url(${containerBackgroundImage})"
            >
                <div id="svg-container"></div>
            </div>
        `
    }

    renderImageContainer() {
        if (this.renderSvgTag) {
            return this.renderSvgContainer()
        }

        let url = isEmpty(this.imageUrl) ? this.defaultImage : this.imageUrl

        return html`
            <div
                class=${classMap({
                    image: true,
                    inactive: isEmpty(this.imageUrl),
                    loading: this.loading,
                })}
                style="background-image:url(${url})"
            ></div>
        `
    }

    renderLoader() {
        if (!this.loading) return

        return html`<qrcg-loader></qrcg-loader>`
    }

    renderInstructions() {
        if (!this.previewOnDblClick) return

        return html`
            <div class="instructions" part="instructions">
                ${t`Double click to enlarge`}
            </div>
        `
    }

    render() {
        return html`
            ${this.renderImageContainer()}

            <!-- -->

            ${this.renderLoader()}

            <!-- -->

            ${this.renderInstructions()}
        `
    }
}

window.defineCustomElement('qrcg-qrcode-image', QRCG_QRcodeImage)
