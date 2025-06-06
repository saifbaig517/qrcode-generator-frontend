import { html } from 'lit'
import { t } from '../core/translate'
import { showToast } from '../ui/qrcg-toast'
import { post } from '../core/api'
import { push } from '../core/qrcg-router'
import { mdiCog } from '@mdi/js'
import { loadUser, permitted } from '../core/auth'
import { QrcgQrCodeTemplateModal } from './qrcg-qrcode-template-modal'
import { QRCodeTypeManager } from '../models/qr-types'
import { BaseComponent } from '../core/base-component/base-component'
import style from './qrcg-qrcode-template-card.scss?inline'

export class QrcgQRCodeTemplateCard extends BaseComponent {
    static tag = 'qrcg-qrcode-template-card'

    static styleSheets = [...super.styleSheets, style]

    static EVENT_REQUEST_DISABLE_ALL_TEMPLATE_CARDS = `${this.tag}:request-disable-all-template-cards`
    static EVENT_REQUEST_ENABLE_ALL_TEMPLATE_CARDS = `${this.tag}:request-enable-all-template-cards`
    static EVENT_BEFORE_CREATE_QRCODE = `${this.tag}:before-create-qrcode`

    static get properties() {
        return {
            qrcodeTemplate: {
                type: Object,
            },

            disabled: {
                type: Boolean,
                reflect: true,
            },

            loading: {
                reflect: true,
                type: Boolean,
            },
        }
    }

    typeManager = new QRCodeTypeManager()

    constructor() {
        super()

        this.qrcodeTemplate = {}
    }

    connectedCallback() {
        super.connectedCallback()

        document.addEventListener(
            QrcgQRCodeTemplateCard.EVENT_REQUEST_DISABLE_ALL_TEMPLATE_CARDS,
            this.onDisableRequested
        )

        document.addEventListener(
            QrcgQRCodeTemplateCard.EVENT_REQUEST_ENABLE_ALL_TEMPLATE_CARDS,
            this.onEnableRequested
        )

        window.addEventListener('resize', this.onWindowResize)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        document.removeEventListener(
            QrcgQRCodeTemplateCard.EVENT_REQUEST_DISABLE_ALL_TEMPLATE_CARDS,
            this.onDisableRequested
        )

        document.removeEventListener(
            QrcgQRCodeTemplateCard.EVENT_REQUEST_ENABLE_ALL_TEMPLATE_CARDS,
            this.onEnableRequested
        )

        window.removeEventListener('resize', this.onWindowResize)
    }

    firstUpdated() {
        super.firstUpdated()

        this.bindScreenshotWidthVariable()
    }

    onWindowResize = async () => {
        this.bindScreenshotWidthVariable()
    }

    bindScreenshotWidthVariable() {
        //
        clearTimeout(this.__bindTimeout)

        this.__bindTimeout = setTimeout(() => {
            const { width } = this.$('.screenshot').getBoundingClientRect()

            this.style.setProperty('--screenshot-width', width)
        }, 300)
    }

    onDisableRequested = () => {
        this.disabled = true
    }

    onEnableRequested = () => {
        this.disabled = false
    }

    onSettingsClicked() {
        QrcgQrCodeTemplateModal.open({
            qrcode: this.qrcodeTemplate,
        })
    }

    dispatchBeforeCreateQRCode() {
        return this.dispatchEvent(
            new CustomEvent(QrcgQRCodeTemplateCard.EVENT_BEFORE_CREATE_QRCODE, {
                cancelable: true,
                bubbles: true,
                composed: true,
                detail: {
                    template: this.qrcodeTemplate,
                },
            })
        )
    }

    async onUseTemplateClick() {
        if (!this.dispatchBeforeCreateQRCode()) {
            return
        }

        try {
            this.loading = true

            this.requestDisableAllTemplates()

            const savePromise = post(
                'qrcode-templates/' + this.qrcodeTemplate.id + '/use'
            )

            await Promise.all([showToast(t`Creating QR Code`), savePromise])

            const { response } = await savePromise

            const newQRCode = await response.json()

            push('/dashboard/qrcodes/edit/' + newQRCode.id)

            showToast(t`QR Code created successfully`)
        } catch (err) {
            this.loading = false

            console.log(err)

            this.requestEnableAllTemplates()

            showToast(
                t`Sorry, there is an error when trying to use this template.`
            )
        }
    }

    requestEnableAllTemplates() {
        document.dispatchEvent(
            new CustomEvent(
                this.constructor.EVENT_REQUEST_ENABLE_ALL_TEMPLATE_CARDS,
                {
                    detail: {
                        qrcodeTemplate: this.qrcodeTemplate,
                    },
                }
            )
        )
    }

    requestDisableAllTemplates() {
        document.dispatchEvent(
            new CustomEvent(
                QrcgQRCodeTemplateCard.EVENT_REQUEST_DISABLE_ALL_TEMPLATE_CARDS,
                {
                    detail: {
                        qrcodeTemplate: this.qrcodeTemplate,
                    },
                }
            )
        )
    }

    resolveScreenshot() {
        return this.qrcodeTemplate.screenshot_url
    }

    getScreenshotUrl() {
        const defaultSrc = '/assets/images/image-placeholder.svg'

        const src = this.resolveScreenshot() ?? defaultSrc

        return src
    }

    renderTemplateScreenshot() {
        return html`
            <div
                @click=${this.onUseTemplateClick}
                class="screenshot"
                style="background-image: url(${this.getScreenshotUrl()});"
            >
                ${this.renderIframePreview()}
            </div>
        `
    }

    renderIframePreview() {
        const screenshot = this.qrcodeTemplate.screenshot_url

        if (screenshot) return

        const ignoredTypes = ['url', 'google-review']

        if (ignoredTypes.indexOf(this.qrcodeTemplate.type) >= 0) {
            return
        }

        if (!this.typeManager.isDynamic(this.qrcodeTemplate.type)) return

        const route = this.qrcodeTemplate.redirect?.route

        if (!route) return

        return html`
            <iframe src=${route} seamless="seamless" scrolling="no"></iframe>
        `
    }

    shouldShowSettingsButton() {
        if (permitted('qrcode-template.manage-all')) return true

        return this.qrcodeTemplate.user_id == loadUser().id
    }

    renderSettingsButton() {
        if (!this.shouldShowSettingsButton()) return

        return html`
            <qrcg-icon
                class="settings"
                mdi-icon=${mdiCog}
                @click=${this.onSettingsClicked}
            ></qrcg-icon>
        `
    }

    renderDescription() {
        return html` <div
            class="description"
            title="${this.qrcodeTemplate.description}"
        >
            ${this.qrcodeTemplate.description}
        </div>`
    }

    render() {
        return html`
            ${this.renderTemplateScreenshot()}

            <div class="name" title=${this.qrcodeTemplate.name}>
                <div class="name-text">${this.qrcodeTemplate.name}</div>
            </div>

            ${this.renderDescription()}

            <div class="meta">
                <div class="type">${this.qrcodeTemplate.type}</div>

                <div class="cat">
                    ${this.typeManager.isDynamic(this.qrcodeTemplate.type)
                        ? t`Dynamic`
                        : t`Static`}
                </div>
            </div>

            <div class="buttons">${this.renderSettingsButton()}</div>
        `
    }
}

QrcgQRCodeTemplateCard.register()
