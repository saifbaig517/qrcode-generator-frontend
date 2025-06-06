import { LitElement, css, html } from 'lit'
import { t } from '../core/translate'
import { defineCustomElement, isEmpty, titleCase } from '../core/helpers'
import { showToast } from '../ui/qrcg-toast'
import { post } from '../core/api'
import { ConfigHelper } from '../core/config-helper'

export class QrcgSystemSmtpSettingsTest extends LitElement {
    static get tag() {
        return 'qrcg-system-smtp-settings-test'
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                flex-direction: column;
                position: relative;
            }

            :host > * {
                margin-bottom: 1rem;
            }

            qrcg-button {
                width: fit-content;
            }

            .result {
                padding: 1rem;
                background-color: var(--gray-0);
                height: 300px;
                position: relative;
            }

            .result pre {
                position: absolute;
                top: 2.5rem;
                left: 1rem;
                right: 1rem;
                bottom: 0;
                overflow: auto;
                font-family: inherit;
                user-select: all;
            }

            .result h3 {
                margin: 0 0 1rem 0;
                color: var(--gray-2);
                font-size: 1.3rem;
            }

            @media (max-width: 900px) {
                .result {
                    max-width: 80vw;
                }
            }
        `
    }

    static get properties() {
        return {
            data: {},
        }
    }

    constructor() {
        super()

        this.data = {
            email: '',

            subject: 'This is Test Email',

            message:
                'If you received this email, it means that SMTP configuration are correct and working.',
        }

        if (ConfigHelper.isLocal()) {
            this.data.email = 'mohammad.a.alhomsi@gmail.com'
        }
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()

        this.removeEventListener('on-input', this.onInput)
    }

    firstUpdated() {
        this.syncInputs()
    }

    onInput(e) {
        e.preventDefault()
        e.stopImmediatePropagation()

        const { name, value } = e.detail

        this.handleFormInput(name, value)
    }

    handleFormInput(name, value) {
        this.data = {
            ...this.data,
            [name]: value,
        }
    }

    syncInputs() {
        for (const name of Object.keys(this.data)) {
            const input = this.input(name)

            if (!input) return

            input.value = this.data[name]
        }
    }

    input(name) {
        return this.shadowRoot.querySelector(`[name="${name}"]`)
    }

    validateInput() {
        for (const key of Object.keys(this.data)) {
            if (isEmpty(this.data[key])) {
                showToast(t`Please enter ` + titleCase(key))

                throw new Error()
            }
        }
    }

    async submit(e) {
        try {
            this.validateInput()
        } catch (e) {
            return
        }

        const button = e.target

        button.loading = true

        try {
            const { response } = await post('system/test-smtp', this.data)

            const data = await response.json()

            this.renderLog(data.debug)

            showToast(t`Test queued, check result box for debug details.`)
        } catch (th) {
            console.log(th)
            showToast(t`Cannot send test email`)
        }

        button.loading = false
    }

    renderLog(log) {
        const container = this.shadowRoot.querySelector('.result > pre')

        container.innerHTML = log
    }

    render() {
        return html`
            <qrcg-form-comment label="${t`Help`}">
                ${t`Test your credentials by sending an email through the system.`}
            </qrcg-form-comment>

            <qrcg-input
                name="email"
                type="email"
                placeholder="email@domain.com"
            >
                ${t`Recepient Email`}
                <div slot="instructions">
                    ${t`We will send the test email to this address.`}
                </div>
            </qrcg-input>

            <qrcg-input name="subject" placeholder="${t`Test SMTP`}">
                ${t`Subject`}
            </qrcg-input>

            <qrcg-textarea name="message"> ${t`Message`} </qrcg-textarea>

            <div class="result">
                <h3>${t`Result`}</h3>
                <pre>-- ${t`smtp log will be written here`} --</pre>
            </div>

            <qrcg-button transparent @click=${this.submit}>
                ${t`Send Test Email`}
            </qrcg-button>
        `
    }
}

defineCustomElement(QrcgSystemSmtpSettingsTest.tag, QrcgSystemSmtpSettingsTest)
