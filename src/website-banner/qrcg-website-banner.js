import { LitElement, css } from 'lit'

import { observeState } from 'lit-element-state'

import { html, unsafeStatic } from 'lit/static-html.js'

import './qrcg-type-selector'
import '../qrcode-module/qrcg-qrcode-image'
import '../ui/qrcg-selector'
import '../ui/qrcg-selector-host'
import '../type-forms/index'
import './qrcg-preview'
import { state } from './state'

import '../qrcode-module/qrcg-qrcode-designer'
import { mdiCloseCircle } from '@mdi/js'
import { isEmpty, url } from '../core/helpers'
import { t } from '../core/translate'
import { loggedIn } from '../core/auth'
import { showSubscriptionModal } from '../core/subscription/modal'
import { QRCGColorPicker } from '../ui/qrcg-color-picker'
import { QRCGQRCodeDesigner } from '../qrcode-module/qrcg-qrcode-designer'
import { QRCodeTypeManager, qrTypes } from '../models/qr-types'
import { shouldEnforceSubscriptionRules } from '../core/subscription/logic'
import { CustomStyleInjector } from '../core/custom-style-injector'
import { QRCGBox } from '../ui/qrcg-box'
import { DirectionAwareController } from '../core/direction-aware-controller'
import { Config } from '../core/qrcg-config'

import './qrcg-teaser-form'

export class WebsiteBanner extends observeState(LitElement) {
    customStyleInjector = new CustomStyleInjector(this)

    typeManager = new QRCodeTypeManager()

    // eslint-disable-next-line
    #dir = new DirectionAwareController(this)

    static get styles() {
        return css`
            :host {
                position: relative;

                display: grid;
                grid-gap: 1rem;

                grid-template-columns: 100%;
            }

            @media (min-width: 980px) {
                :host {
                    grid-template-columns: 2fr 1fr;
                }

                :host([showing-advanced-designer]) {
                    grid-template-columns: 100%;
                }
            }

            .data-box {
                border-radius: 0.5rem;
                padding: 1rem;
                background-color: white;
                box-shadow: ${QRCGBox.boxShadow};
            }

            qrcg-preview {
                height: fit-content;
            }

            qrcg-qrcode-designer {
                background: white;
                width: 100%;
            }

            .advanced-designer-close {
                width: 3rem;
                height: 3rem;
                color: var(--gray-2);
                margin-left: auto;
                cursor: pointer;
            }

            .advanced-designer-close-button {
                margin-bottom: 1rem;
                margin-left: auto;
            }

            .advanced-designer-close-button::part(button) {
                border-radius: 50%;
                padding: 0;
                min-width: initial;
            }

            .advanced-designer-close-button::part(content) {
                display: flex;
            }

            .advanced-designer-close-button:hover .advanced-designer-close {
                color: black;
            }

            .designer-container {
                background-color: white;
                padding: 2rem;
            }

            .disabled-file-input-instructions {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                color: var(--gray-2);
            }

            .disabled-file-input-instructions qrcg-button {
                margin-top: 1rem;
            }

            .warning {
                background-color: var(--warning-0);
                font-size: 0.8rem;
                line-height: 1.5;
                padding: 0.5rem;
                margin-top: 1rem;
            }

            a {
                color: var(--primary-0);
                text-decoration: none;
                font-weight: bold;
            }

            .download {
                margin-top: 1rem;
            }

            .form-container {
                margin-top: 1rem;
            }
        `
    }

    static get properties() {
        return {
            types: {},
            showingAdvancedDesigner: {
                type: Boolean,
                reflect: true,
                attribute: 'showing-advanced-designer',
            },
            selectedTypeId: {
                attribute: 'selected-type-id',
            },
        }
    }

    constructor() {
        super()

        this.types = qrTypes

        this.showingAdvancedDesigner = false
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-submit', this.onSubmit)

        this.addEventListener(
            'qrcg-website-banner:request-show-advanced-designer',
            this.onRequestShowAdvancedDesigner
        )

        this.addEventListener('on-input', this.onInput)

        this.defaultRandomColorsCount = QRCGColorPicker.randomColorsCount

        QRCGColorPicker.randomColorsCount = 4

        QRCGQRCodeDesigner.validateShapeWith(this.validateShape)

        QRCGQRCodeDesigner.validateAdvancedShapeWith(this.validateShape)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-submit', this.onSubmit)

        this.removeEventListener(
            'qrcg-website-banner:request-show-advanced-designer',
            this.onRequestShowAdvancedDesigner
        )

        this.removeEventListener('on-input', this.onInput)

        QRCGColorPicker.randomColorsCount = this.defaultRandomColorsCount

        QRCGQRCodeDesigner.validateShapeWith(null)

        QRCGQRCodeDesigner.validateAdvancedShapeWith(null)
    }

    get selectedTypeId() {
        return state.type
    }

    set selectedTypeId(id) {
        state.type = id
    }

    validateShape() {
        return true
    }

    onInput(e) {
        if (e.detail.name === 'qrcg-qrcode-designer') {
            state.design = e.detail.value
        }
    }

    onRequestShowAdvancedDesigner = () => {
        if (isEmpty(state.data)) {
            state.data = {
                text: 'This is QR Code demo',
            }

            state.type = 'text'
        }

        window.scrollTo(0, 0)

        setTimeout(() => {
            this.showingAdvancedDesigner = true
        })
    }

    onSubmit = (e) => {
        state.data = e.detail.data

        this.dispatchEvent(
            new CustomEvent('qrcg-banner-preview:update', {
                bubbles: true,
                composed: true,
            })
        )
    }

    _resetPreview() {
        state.data = {}

        this.dispatchEvent(
            new CustomEvent('qrcg-banner-preview:reset', {
                bubbles: true,
                composed: true,
            })
        )
    }

    isTeaserType(id) {
        return this.typeManager.isDynamic(id) && id != 'url'
    }

    renderCurrentTypeForm() {
        const type = this.selectedTypeId

        if (this.isTeaserType(type)) {
            return html`<qrcg-teaser-form></qrcg-teaser-form>`
        }

        let tag = `qrcg-${type}-form`

        let attrs = ''

        if (['url', 'text'].indexOf(type) > -1) {
            attrs = 'submit-on-input'
        }

        tag = unsafeStatic(`<${tag} ${attrs} show-submit-button></${tag}>`)

        return html`${tag}`
    }

    onAdvancedDesignerClose() {
        this.showingAdvancedDesigner = false
    }

    renderDisabledFileInputInstructions() {
        if (loggedIn()) {
            return html`
                <div class="disabled-file-input-instructions">
                    <div class="text">
                        ${t`Create QR Code from your dashboard to enable this feature`}
                    </div>
                    <qrcg-button href="/dashboard/qrcodes/new">
                        ${t`Create QR Code`}
                    </qrcg-button>
                </div>
            `
        }

        return html`
            <div class="disabled-file-input-instructions">
                <div class="text">${t`Sign up now to enable this feature`}</div>
                <qrcg-button href="/account/sign-up">
                    ${t`Sign up`}
                </qrcg-button>
            </div>
        `
    }

    onDownloadClick() {
        showSubscriptionModal({
            title: t('Sign up now'),
            message: shouldEnforceSubscriptionRules()
                ? t('Sign up for a free trial to enable all features.')
                : t`Create a free account to enable all features.`,
            link: url('/account/sign-up'),
            affirmativeText: t('Sign up'),
        })
    }

    renderBelowPreviewImage() {
        if (loggedIn()) {
            return html`
                <div class="warning">
                    ${t`Create QR codes from `}

                    <a href="/dashboard/qrcodes/new">
                        ${t`the dashboard area`}
                    </a>

                    ${t` to be able to download.`}
                </div>
            `
        }

        return html`
            <qrcg-button @click=${this.onDownloadClick} class="download">
                ${t`Download now`}
            </qrcg-button>
        `
    }

    homePageGeneratorEnabled() {
        return Config.get('homepage.homepage-generator') != 'disabled'
    }

    render() {
        if (!this.homePageGeneratorEnabled()) {
            return
        }

        if (this.showingAdvancedDesigner) {
            return html`
                <qrcg-button
                    class="advanced-designer-close-button"
                    transparent
                    @click=${this.onAdvancedDesignerClose}
                >
                    <qrcg-icon
                        mdi-icon=${mdiCloseCircle}
                        class="advanced-designer-close"
                    ></qrcg-icon>
                </qrcg-button>
                <qrcg-box class="designer-container">
                    <qrcg-qrcode-designer
                        stick-top-rem="2"
                        .data=${state.data}
                        .type=${state.type}
                        .design=${state.design}
                    >
                        <div slot="file-input-instructions-foreground-image">
                            ${this.renderDisabledFileInputInstructions()}
                        </div>

                        <div slot="file-input-instructions-logo">
                            ${this.renderDisabledFileInputInstructions()}
                        </div>

                        <div slot="below-preview-image">
                            ${this.renderBelowPreviewImage()}
                        </div>
                    </qrcg-qrcode-designer>
                </qrcg-box>
            `
        }

        return html`
            <div class="data-box">
                <qrcg-type-selector
                    @selected-type-changed=${this._resetPreview}
                ></qrcg-type-selector>
                <div class="form-container">
                    ${this.renderCurrentTypeForm(state.type)}
                </div>
            </div>
            <qrcg-preview></qrcg-preview>
        `
    }
}

window.defineCustomElement('qrcg-website-banner', WebsiteBanner)
