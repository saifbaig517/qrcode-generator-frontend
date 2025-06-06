import { css, html } from 'lit'
import { isEmpty } from '../core/helpers'

import { t } from '../core/translate'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { showToast } from '../ui/qrcg-toast'
import { QrcgDomainChangeAvailabilityModal } from './qrcg-domain-change-availability-modal'

import { QrcgDomainChangeStatusModal } from './qrcg-domain-change-status-modal'

import './qrcg-domain-connectivity-status'

export class QrcgDomainForm extends QrcgDashboardForm {
    static get styles() {
        return [
            super.styles,
            css`
                .instructions {
                    background-color: var(--gray-0);
                    padding: 1rem;
                }

                .status-container {
                    display: flex;
                    align-items: flex-end;
                }

                .status-container qrcg-input::part(input) {
                    margin-bottom: 0;
                }

                .status-container qrcg-button {
                    margin-left: 1rem;
                    --button-background-color: var(--gray-0);
                    --button-background-color-hover: var(--primary-0);
                    --button-color: black;
                    --button-color-hover: white;
                }
            `,
        ]
    }

    constructor() {
        super({
            apiBaseRoute: 'domains',
            disableableInputsSelector: `[name]:not([name="status"])`,
        })
    }

    static get properties() {
        return {
            ...super.properties,

            dnsIsConfigured: { type: Boolean },
            applicationIsAccessible: { type: Boolean },
        }
    }

    onApiSuccess(e) {
        super.onApiSuccess(e)

        this.shadowRoot
            .querySelector('qrcg-domain-connectivity-status')
            .refresh()
    }

    async onChangeStatus() {
        await QrcgDomainChangeStatusModal.open({ domain: this.data })

        this.fetchRecord()
    }

    async onChangeAvailability() {
        await QrcgDomainChangeAvailabilityModal.open({ domain: this.data })

        this.fetchRecord()
    }

    async onSetDefault() {
        try {
            await confirm({
                message: t`Are you sure you want to set this domain as default domain for all new QR codes?`,
            })

            await this.api.put(`domains/${this.data.id}/set-default`)

            showToast(t`Domain has been set as the default domain.`)
        } catch {
            //
        }
    }

    renderStatusInput() {
        if (!this.data?.id) return

        return html`
            <div class="status-container">
                <qrcg-input name="status" disabled> ${t`Status`} </qrcg-input>
                <qrcg-button @click=${this.onChangeStatus}>
                    ${t`Change status`}
                </qrcg-button>
            </div>
        `
    }

    renderDomainAvailabilityInput() {
        if (!this.data?.id) return

        return html`
            <div class="status-container">
                <qrcg-input .value=${this.data.availability} disabled>
                    ${t`Availability`}
                </qrcg-input>

                <qrcg-button @click=${this.onChangeAvailability}>
                    ${t`Change availability`}
                </qrcg-button>
            </div>
        `
    }

    renderIsDefaultInput() {
        if (!this.data?.id) return

        return html`
            <div class="status-container">
                <qrcg-input
                    .value=${this.data.is_default ? t`Yes` : t`No`}
                    disabled
                >
                    ${t`Is Default`}
                </qrcg-input>

                <qrcg-button @click=${this.onSetDefault}>
                    ${t`Set as default`}
                </qrcg-button>
            </div>
        `
    }

    renderInstructions() {
        if (isEmpty(this.data.id)) {
            return html`
                <div class="instructions">
                    ${t`Enter host & protocol and then click on Save to see all available options.`}
                </div>
            `
        }

        return html`
            <div class="instructions">
                ${t`Public domains are available for all application users. User submitted domains (other than admins) cannot made public.`}
            </div>
        `
    }

    renderFormFields() {
        return html`
            <qrcg-domain-connectivity-status
                domain-id=${this.data?.id}
            ></qrcg-domain-connectivity-status>
            <qrcg-input name="host" placeholder="domain.com">
                ${t`Host`}
            </qrcg-input>
            <qrcg-balloon-selector
                name="protocol"
                .options=${[
                    {
                        name: 'http',
                        value: 'http',
                    },
                    {
                        name: 'https',
                        value: 'https',
                    },
                ]}
            >
                ${t`Protocol`}
            </qrcg-balloon-selector>

            <qrcg-input name="sort_order" type="number" placeholder="0">
                ${t`Sort order`}
                <span slot="instructions">
                    ${t`Controls the order of domains when customers has to choose one.`}
                </span>
            </qrcg-input>

            ${this.renderIsDefaultInput()}

            <!-- -->

            ${this.renderStatusInput()}

            <!-- -->

            ${this.renderDomainAvailabilityInput()}

            <!-- -->

            ${this.renderInstructions()}

            <qrcg-relation-select
                name="home_page_qrcode_id"
                api-endpoint="qrcodes?list_all=true"
            >
                ${t`Home Page QR Code`}
            </qrcg-relation-select>
        `
    }
}
window.defineCustomElement('qrcg-domain-form', QrcgDomainForm)
