import { LitElement, html, css } from 'lit'

import { url } from '../core/helpers'
import { QRCGApiConsumer } from '../core/qrcg-api-consumer'
import { QRCGFormController } from '../core/qrcg-form-controller'
import { QRCGTitleController } from '../core/qrcg-title-controller'
import { t } from '../core/translate'

import './qrcg-my-domains-list'

import './qrcg-domain-connectivity-status'

import { put } from '../core/api'

export class QrcgDomainAdd extends LitElement {
    titleController = new QRCGTitleController(this)

    api = new QRCGApiConsumer(this, 'domains')

    formController = new QRCGFormController(this)

    static styles = [
        css`
            :host {
                display: block;
            }

            .introduction {
                line-height: 2;
            }

            qrcg-form-comment {
                margin-bottom: 1rem;
            }

            qrcg-input {
                margin-bottom: 1rem;
            }

            .actions {
                display: flex;
                justify-content: flex-end;
            }
        `,
    ]

    static get properties() {
        return {
            data: {},
            myDomains: {
                type: Array,
            },
        }
    }

    constructor() {
        super()

        this.data = {
            protocol: 'http',
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.titleController.pageTitle = t`Add your domain`

        this.addEventListener(
            'qrcg-my-domains-list:test-connection',
            this.onTestConnection
        )

        this.addEventListener(
            'qrcg-domain-connectivity-status:success',
            this.onConnectivitySuccess
        )
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener(
            'qrcg-my-domains-list:test-connection',
            this.onTestConnection
        )

        this.removeEventListener(
            'qrcg-domain-connectivity-status:success',
            this.onConnectivitySuccess
        )
    }

    onConnectivitySuccess(e) {
        const { domain } = e.detail

        if (domain.status === 'draft') {
            this.setDomainStatusInProgress(domain)
        }
    }

    async setDomainStatusInProgress(domain) {
        const { response } = await put(`domains/${domain.id}/update-status`, {
            status: 'in-progress',
        })

        const json = await response.json()

        if (json.status === 'in-progress') {
            this.refreshList()
        }
    }

    onTestConnection(e) {
        this.shadowRoot.querySelector(
            'qrcg-domain-connectivity-status'
        ).domainId = e.detail.domain.id
    }

    getHost() {
        const a = document.createElement('a')

        a.href = url('/')

        return a.hostname
    }

    submitForm = async () => {
        await this.api.save(this.data)

        this.refreshList()
    }

    refreshList() {
        this.shadowRoot.querySelector('qrcg-my-domains-list').fetch()
    }

    render() {
        return html`
            <qrcg-form>
                <p class="introduction">
                    ${t`Make your dynamic QR codes white labeled by serving them from your own domain. This would increase trust in your QR Codes and might result in a higher conversion rate.`}
                </p>

                <qrcg-form-comment label=${t`Help`}>
                    ${t`Add a CNAME Record with your domain registrar that points to` +
                    ' '}
                    <strong>${this.getHost()}</strong>
                    ${t`It may take up to 24 hours for our systems to detect the changes.`}
                </qrcg-form-comment>

                <qrcg-domain-connectivity-status
                    .shouldRenderApplicationAccessError=${false}
                ></qrcg-domain-connectivity-status>

                <qrcg-input name="host" placeholder="qr.your-website.com">
                    ${t`Domain Name`}
                    <span slot="instructions">
                        ${t`Enter your domain then click on save.`}
                    </span>
                </qrcg-input>

                <qrcg-my-domains-list></qrcg-my-domains-list>

                <div class="actions">
                    <qrcg-button type="submit">${t`Save`}</qrcg-button>
                </div>
            </qrcg-form>
        `
    }
}
window.defineCustomElement('qrcg-domain-add', QrcgDomainAdd)
