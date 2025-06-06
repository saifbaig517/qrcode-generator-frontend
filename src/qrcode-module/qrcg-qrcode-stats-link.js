import { LitElement, html, css } from 'lit'
import { mdiChartBar } from '@mdi/js'
import { isEmpty, url } from '../core/helpers'
import { t } from '../core/translate'
import { get } from '../core/api'
import { QRCodeTypeManager } from '../models/qr-types'
import { DirectionAwareController } from '../core/direction-aware-controller'

export class QrcgQrcodeStatsLink extends LitElement {
    __dir = new DirectionAwareController(this)
    types = new QRCodeTypeManager()

    static styles = [
        css`
            :host {
                display: block;
            }

            a.stats {
                text-decoration: none;
                color: var(--gray-2);
                display: flex;
                align-items: center;
                padding: 1rem;
            }

            .stats qrcg-icon {
                margin-right: 0.5rem;
            }

            :host(.dir-rtl) qrcg-icon {
                margin-right: 0;
                margin-left: 0.5rem;
            }
        `,
    ]

    static get properties() {
        return {
            qrcodeId: { attribute: 'qrcode-id' },
            redirect: {},
            qrcode: {},
        }
    }

    updated(changed) {
        if (changed.has('qrcodeId')) {
            this.fetchData()
        }
    }

    async fetchData() {
        await this.fetchQRCode()
        await this.fetchQRCodeRedirect()
    }

    async fetchQRCode() {
        if (isEmpty(this.qrcodeId)) {
            this.qrcode = null
            return
        }

        const { response } = await get(`qrcodes/${this.qrcodeId}`)

        this.qrcode = await response.json()
    }

    shouldFetchRedirect() {
        if (isEmpty(this.qrcode)) return

        return this.types.isDynamic(this.qrcode.type)
    }

    async fetchQRCodeRedirect() {
        if (!this.shouldFetchRedirect()) {
            this.redirect = null
            return
        }

        const { response } = await get(`qrcodes/${this.qrcodeId}/redirect`)

        this.redirect = await response.json()
    }

    shouldRender() {
        if (isEmpty(this.redirect) || isEmpty(this.qrcode)) return false

        return this.types.isDynamic(this.qrcode.type)
    }

    render() {
        if (!this.shouldRender()) return

        return html`
            <qrcg-button
                class="elegant"
                href="${url('/dashboard/qrcodes/stats/') + this.qrcodeId}"
            >
                <qrcg-icon mdi-icon=${mdiChartBar}></qrcg-icon>
                ${t`Stats`}
            </a>
        `
    }
}
window.defineCustomElement('qrcg-qrcode-stats-link', QrcgQrcodeStatsLink)
