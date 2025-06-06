import { html, css } from 'lit'
import { isEmpty, kebabCase, url } from '../core/helpers'
import { t } from '../core/translate'
import { QrcgModal } from '../ui/qrcg-modal'

import '../domain-module/qrcg-domain-select'
import { QRCGApiConsumer } from '../core/qrcg-api-consumer'
import { QRCGFormController } from '../core/qrcg-form-controller'

import { getDomainDisplayName } from '../models/domain'

import '../ui/qrcg-copy-icon'

export class QrcgQrcodeLinkModal extends QrcgModal {
    form = new QRCGFormController(this, false)

    static styles = [
        super.styles,
        css`
            .qrcode-link-form {
                display: flex;
                flex-direction: column;
                position: relative;
            }

            .result-link {
                margin: 0 auto;
                font-size: 1rem;
                font-weight: bold;
                color: var(--gray-2);
                white-space: nowrap;
                overflow-x: auto;
                max-width: 80%;
                user-select: all;
                -webkit-user-select: all;
                text-align: center;
            }

            .add-your-domain-link {
                color: var(--primary-0);
                display: block;
                margin-top: 1rem;
            }

            qrcg-input {
                margin-bottom: 1rem;
            }
        `,
    ]

    static get properties() {
        return {
            redirect: {},
            data: {},
            domain: {},
        }
    }

    static async open({ redirect }) {
        const modal = new QrcgQrcodeLinkModal()

        modal.redirect = redirect

        modal.data = redirect

        document.body.appendChild(modal)

        await new Promise((resolve) => setTimeout(resolve, 250))

        return modal.open()
    }

    constructor() {
        super()

        this.api = QRCGApiConsumer.instance({
            host: this,
            disableableInputsSelector: '[name], [modal-negative]',
        })

        this.data = {}
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)

        this.addEventListener(
            'qrcg-domain-select:domain-changed',
            this.onDomainChanged
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
        this.removeEventListener(
            'qrcg-domain-select:domain-changed',
            this.onDomainChanged
        )
    }

    onDomainChanged(e) {
        this.domain = e.detail.domain
    }

    renderTitle() {
        return t`Customize your link`
    }

    onInput(e) {
        this.data = {
            ...this.data,
            [e.detail.name]: this.getValue(e.detail),
        }
    }

    getValue(detail) {
        if (detail.name === 'slug') {
            return this.formatSlug(detail.value)
        }

        return detail.value
    }

    formatSlug(value) {
        return kebabCase(value, false).replace(/[^a-zA-Z0-9\\-\\@\\.]/, '')
    }

    updated(changed) {
        if (changed.has('data')) {
            Object.keys(this.data).forEach((name) => {
                if (!name) return

                const elem = this.$(`[name=${name}]`)

                if (!elem) return

                elem.value = this.data[name]
            })
        }
    }

    $(selector) {
        return this.shadowRoot?.querySelector(selector)
    }

    async onAffirmativeClick() {
        try {
            await this.submitForm()
            this.resolve()
            this.close()
        } catch {
            //
        }
    }

    submitForm = async () => {
        const redirect = await this.api.put(
            `qrcode/${this.redirect.qrcode_id}/redirect`,
            this.data
        )

        this.dispatchEvent(
            new CustomEvent('qrcg-qrcode-link-modal:redirect-saved', {
                detail: { redirect },
                composed: true,
                bubbles: true,
            })
        )
    }

    renderActions() {
        return html`
            <qrcg-button transparent modal-negative>${t`Cancel`}</qrcg-button>

            <qrcg-button modal-affirmative type="submit">
                ${t`Save`}
            </qrcg-button>
        `
    }

    renderDomain(url) {
        if (!this.domain) return url

        const parts = url.split('/')

        const slug = parts[parts.length - 1]

        return `${getDomainDisplayName(this.domain)}/${slug}`
    }

    renderUrl() {
        if (isEmpty(this.data.slug)) {
            return this.redirect.route
        }

        const parts = this.redirect.route.split('/')

        const redirectWithoutSlug = this.redirect.route.replace(
            parts[parts.length - 1],
            ''
        )

        const url = `${redirectWithoutSlug}${this.data.slug}`

        return this.renderDomain(url)
    }

    renderBody() {
        return html`
            <qrcg-form class="qrcode-link-form">
                <div class="result-link">${this.renderUrl()}</div>

                <qrcg-input
                    name="slug"
                    placeholder="${t`Leave empty to keep unchanged`}"
                >
                    ${t`Slug`}
                </qrcg-input>

                <qrcg-domain-select name="domain_id"></qrcg-domain-select>

                <a
                    href="${url('/dashboard/domains/add')}"
                    target="_blank"
                    class="add-your-domain-link"
                >
                    ${t`Add your own domain / subdomain`}
                </a>
            </qrcg-form>
        `
    }
}
window.defineCustomElement('qrcg-qrcode-link-modal', QrcgQrcodeLinkModal)
