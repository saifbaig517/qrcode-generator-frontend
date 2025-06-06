import { LitElement, html, css } from 'lit'

import { ifDefined } from 'lit/directives/if-defined.js'

import '../ui/qrcg-color-picker'

import '../qrcode-module/qrcg-qrcode-image'

import { state } from './state'

import { observeState } from 'lit-element-state'

import { QRCodePreviewUrlBuilder } from '../qrcode-module/qrcg-qrcode-preview-url-builder'

import { debounce } from '../core/helpers'

import '../ui/qrcg-icon'

import { loggedIn } from '../core/auth'
import { showToast } from '../ui/qrcg-toast'
import { push } from '../core/qrcg-router'
import { SvgPngConverter } from '../common/qrcg-svg-png-converter'
import { t } from '../core/translate'
import { CustomStyleInjector } from '../core/custom-style-injector'
import { QRCGBox } from '../ui/qrcg-box'
import { Config } from '../core/qrcg-config'

class QRCGPreview extends observeState(LitElement) {
    _customStyleInjector = new CustomStyleInjector(this)
    urlBuilder = new QRCodePreviewUrlBuilder(this)

    static get styles() {
        return css`
            :host {
                display: flex;
                border-radius: 0.5rem;
                box-shadow: ${QRCGBox.boxShadow};
                align-items: center;
                justify-content: space-around;
                background-color: white;
                flex-direction: column;
                padding: 1rem 2rem;
            }

            qrcg-qrcode-image {
                width: 10rem;
                margin-bottom: 1rem;
            }

            .actions {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-top: 1rem;
            }

            qrcg-icon {
                margin-right: 0.5rem;
            }

            .button-content {
                display: flex;
                align-items: center;
            }

            qrcg-color-picker::part(color-box) {
                width: 2rem;
                height: 1.5rem;
            }

            .customize-design-instructions {
                font-size: 0.8rem;
                margin-top: 1rem;
                text-align: center;
                color: var(--gray-2);
                line-height: 1.5;
                user-select: none;
                -webkit-user-select: none;
            }
        `
    }

    constructor() {
        super()

        this._updatePreview = debounce(this._updatePreview.bind(this), 500)

        this._reset = this._reset.bind(this)
    }

    static get properties() {
        return {
            previewUrl: {},
            downloadImageUrl: {},
            downloadSvgUrl: {},
            showingAdvancedDesigner: { type: Boolean },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            'qrcg-banner-preview:update',
            this._updatePreview
        )

        document.addEventListener('qrcg-banner-preview:reset', this._reset)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            'qrcg-banner-preview:update',
            this._updatePreview
        )

        document.removeEventListener('qrcg-banner-preview:reset', this._reset)
    }

    getQrCodeData() {
        return state.data
    }

    getQrCodeType() {
        return state.type
    }

    getQrCodeDesign() {
        return state.design
    }

    _reset() {
        this.previewUrl = null
    }

    _updatePreview() {
        if (this.urlBuilder.canBuildURL())
            this.previewUrl = this.urlBuilder.buildURL()
        else this.previewUrl = null
    }

    _onColorInput(e) {
        state.design = {
            ...state.design,
            foregroundColor: e.detail.value,
            eyeExternalColor: e.detail.value,
            eyeInternalColor: e.detail.value,
        }
        this._updatePreview()
    }

    _download(e) {
        if (!loggedIn()) {
            return this.showSignupModal()
        }

        if (!this.urlBuilder.canBuildURL()) {
            return showToast(
                'Please fill the required details to be able to download.'
            )
        }

        const downloadType = e.currentTarget.getAttribute('download-type')

        if (downloadType !== 'png') {
            return push('/dashboard/qrcodes/new')
        }

        const url = this.urlBuilder.buildURL()

        const converter = new SvgPngConverter(url, 'qrcode.png')

        converter.downloadPng()
    }

    requestShowAdvancedDesigner() {
        this.dispatchEvent(
            new CustomEvent(
                'qrcg-website-banner:request-show-advanced-designer',
                {
                    bubbles: true,
                    composed: true,
                }
            )
        )
    }

    renderCustomizeDesignButton() {
        if (
            Config.get('frontpage.show_customize_design_button') === 'disabled'
        ) {
            return
        }

        return html`
            <qrcg-button @click=${this.requestShowAdvancedDesigner}>
                ${t`Customize Design`}
            </qrcg-button>

            <div class="customize-design-instructions">
                ${t`Add logo, change patterns, add stickers, and many more.`}
            </div>
        `
    }

    render() {
        return html`
            <qrcg-qrcode-image
                url=${ifDefined(
                    this.previewUrl === null ? undefined : this.previewUrl
                )}
            ></qrcg-qrcode-image>
            <qrcg-color-picker @on-input=${this._onColorInput} name="color">
            </qrcg-color-picker>
            <div class="actions">${this.renderCustomizeDesignButton()}</div>
        `
    }
}

window.defineCustomElement('qrcg-preview', QRCGPreview)
