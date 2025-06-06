import { mdiCog } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { get } from '../core/api'
import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'
import { QRCodeTypeManager } from '../models/qr-types'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { QrcgQrcodeLinkModal } from './qrcg-qrcode-link-modal'
import { Config } from '../core/qrcg-config'
import { isSuperAdmin } from '../core/auth'
import { PluginManager } from '../../plugins/plugin-manager'
import { FILTER_QRCODE_LINK_SHOULD_RENDER_SETTINGS_ICON } from '../../plugins/plugin-filters'

export class QrcgQrcodeLink extends LitElement {
    types = new QRCodeTypeManager()

    static styles = [
        css`
            :host {
                display: flex;
                padding: 0.1rem 0;
                align-items: center;
                gap: 0.5rem;
            }

            .main-link {
                color: var(--primary-0);
                font-size: 0.8rem;
            }

            .container {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            label {
                display: block;
                color: var(--gray-2);
                font-size: 0.8rem;
            }

            qrcg-button::part(button) {
                padding: 0.25rem;
                min-width: initial;
                background-color: transparent;
                color: var(--gray-2);
            }

            qrcg-button:hover::part(button) {
                background-color: var(--gray-1);
                color: black;
            }

            @keyframes enter-animation {
                from {
                    opacity: 0;
                    max-height: 0;
                    transform: scale(0.95);
                }

                to {
                    opacity: 1;
                    max-height: 6rem;
                    transform: scale(1);
                }
            }
        `,
    ]

    static get properties() {
        return {
            qrcodeId: {
                attribute: 'qrcode-id',
            },
            redirect: {},
            qrcode: {},
        }
    }

    connectedCallback() {
        super.connectedCallback()
        document.addEventListener(
            'qrcg-qrcode-link-modal:redirect-saved',
            this.onRedirectSaved
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        document.removeEventListener(
            'qrcg-qrcode-link-modal:redirect-saved',
            this.onRedirectSaved
        )
    }

    updated(changed) {
        if (changed.has('qrcodeId')) {
            this.fetchQRCodeRedirect()
            this.fetchQRCode()
        }
    }

    async fetchQRCode() {
        if (isEmpty(this.qrcodeId)) {
            this.qrcode = null
            return
        }

        const { response } = await get(`qrcodes/${this.qrcodeId}`)

        this.qrcode = await response.json()
    }

    async fetchQRCodeRedirect() {
        if (isEmpty(this.qrcodeId)) {
            this.redirect = null
            return
        }

        try {
            const { response } = await get(`qrcodes/${this.qrcodeId}/redirect`)

            this.redirect = await response.json()
        } catch {
            //
        }
    }

    async openModal() {
        try {
            await confirm({
                title: t`Warning!`,
                message: t`Are you sure you want to change the short URL? All printed QR codes will not work in future!`,
            })

            await new Promise((resolve) => setTimeout(resolve, 200))

            await QrcgQrcodeLinkModal.open({
                redirect: this.redirect,
            })

            this.fireChangeEvent()
        } catch {
            //
        }
    }

    fireChangeEvent() {
        this.dispatchEvent(
            new CustomEvent('qrcg-qrcode-link:change', {
                bubbles: true,
                composed: true,
            })
        )
    }

    onRedirectSaved = (e) => {
        this.redirect = e.detail.redirect
    }

    shouldRender() {
        if (isEmpty(this.redirect) || isEmpty(this.qrcode)) return false

        return this.types.isDynamic(this.qrcode.type)
    }

    shouldShowSettingsIcon() {
        if (isSuperAdmin()) return true

        const value = Config.get('customer.short_link_change')

        return value !== 'disabled'
    }

    renderSettingsIcon() {
        if (!this.shouldShowSettingsIcon()) return

        const shouldRender = PluginManager.applyFilters(
            FILTER_QRCODE_LINK_SHOULD_RENDER_SETTINGS_ICON,
            true
        )

        if (!shouldRender) return

        return html`
            <qrcg-button no-shadow @click=${this.openModal}>
                <qrcg-icon mdi-icon=${mdiCog}></qrcg-icon>
            </qrcg-button>
        `
    }

    render() {
        if (!this.shouldRender()) {
            return
        }

        const redirectUrl = this.redirect.route

        return html`
            <label>${t`Short URL`}</label>
            <div class="container">
                <a class="main-link" target="_blank" href="${redirectUrl}">
                    ${redirectUrl}
                </a>
                <qrcg-copy-icon>${redirectUrl}</qrcg-copy-icon>

                ${this.renderSettingsIcon()}
            </div>
        `
    }
}
window.defineCustomElement('qrcg-qrcode-link', QrcgQrcodeLink)
