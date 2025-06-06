import { css, html } from 'lit'
import { t } from '../core/translate'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import '../common/qrcg-relation-select'
import { QrcgMobileInput } from '../common/qrcg-mobile-input'
import { confirm } from '../ui/qrcg-confirmation-modal'
import { post } from '../core/api'
import { showToast } from '../ui/qrcg-toast'

import './qrcg-account-balance-input'

import '../account/qrcg-subusers'

export class QrcgUserForm extends QrcgDashboardForm {
    static get styles() {
        return [
            super.styles,
            css`
                .verify-email-actions {
                    display: flex;
                }
            `,
        ]
    }
    constructor() {
        super({
            apiBaseRoute: 'users',
            bindEvents: true,
        })
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('api:success', this.onSuccess)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('api:success', this.onSuccess)
    }

    onSuccess(e) {
        const data = e.detail.response

        setTimeout(() => {
            this.data = {
                ...this.data,
                role_id: data.roles[0]?.id,
            }
        }, 0)
    }

    async onVerifyEmail() {
        await confirm({
            message: t`Are you sure you want to verify the email address?`,
        })

        const { response } = await post('users/verify-email/' + this.data.id)

        const json = await response.json()

        if (json.success) {
            showToast(t`Email verified successfully`)
            this.fetchRecord()
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString)

        return date.toLocaleDateString()
    }

    renderRoleSelect() {
        if (this.data.is_sub) {
            return html`<label>${t`Role`}: ${t`Sub User`}</label>`
        }

        return html`
            <qrcg-relation-select endpoint="roles" name="role_id">
                ${t`Role`}
            </qrcg-relation-select>
        `
    }

    renderVerifyEmailField() {
        if (!this.data.id) return

        let action = ''

        if (this.data.email_verified_at) {
            action = html`
                ${t`Email verified at: `}
                ${this.formatDate(this.data.email_verified_at)}
            `
        } else {
            action = html`
                <qrcg-button @click=${this.onVerifyEmail}>
                    ${t`Verify Email`}
                </qrcg-button>
            `
        }

        return html` <div class="verify-email-actions">${action}</div> `
    }

    renderFormFields() {
        return html`
            <qrcg-input name="name" placeholder="${t`Full name`}"
                >${t`Name`}</qrcg-input
            >

            <qrcg-input
                name="email"
                placeholder=${t`email@example.com`}
                type="email"
                >${t`Email`}</qrcg-input
            >

            ${QrcgMobileInput.renderBasedOnConfigs()}

            <qrcg-input
                name="password"
                type="password"
                placeholder=${t`new password, leave empty to keep it unchanged`}
                >${t`Password`}</qrcg-input
            >

            <qrcg-input
                name="password_confirmation"
                type="password"
                placeholder=${t`confirm password`}
                >${t`Confirm password`}</qrcg-input
            >

            ${this.renderRoleSelect()} ${this.renderVerifyEmailField()}

            <qrcg-account-balance-input
                user-id=${this.data.id}
            ></qrcg-account-balance-input>

            <qrcg-subusers user-id=${this.id}></qrcg-subusers>
        `
    }
}

window.defineCustomElement('qrcg-user-form', QrcgUserForm)
