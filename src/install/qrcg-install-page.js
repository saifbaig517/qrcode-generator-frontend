import { LitElement, html, css } from 'lit'

import '../ui/qrcg-box'
import '../ui/qrcg-input'
import '../ui/qrcg-button'
import '../ui/qrcg-form'
import '../ui/qrcg-link'

import { QRCGApiConsumer } from '../core/qrcg-api-consumer'
import { QRCGFormController } from '../core/qrcg-form-controller'
import { isEmpty, styled } from '../core/helpers'
import { push } from '../core/qrcg-router'
import { showToast } from '../ui/qrcg-toast'

export class QRCGInstallPage extends LitElement {
    api = new QRCGApiConsumer(this, '', 'qrcg-button')

    formController = new QRCGFormController(this)

    static get styles() {
        return css`
            :host {
                display: block;
                max-width: 25rem;
                margin: auto;
                margin-top: 3rem;
                margin-bottom: 3rem;

                --qrcg-input-box-shadow: inset 0 0 0 2px var(--gray-1);
                --qrcg-input-box-shadow-focus: inset 0 0 0 2px var(--gray-2);
            }

            qrcg-form::part(form) {
                display: grid;
                grid-gap: 1rem;
            }

            .go-home {
                display: block;
                color: var(--primary-0);
                margin-top: 2rem;
                text-align: center;
            }

            h1 {
                padding-bottom: 1rem;
                margin-top: 0;
                margin-bottom: 0rem;
                font-size: 1.2rem;
                color: var(--gray-2);
            }

            h2 {
                font-size: 1.2rem;
            }

            p {
                line-height: 1.8;
            }

            .navigation {
                display: flex;
                justify-content: space-between;
                margin-top: 1rem;
            }

            qrcg-button {
                width: fit-content;
            }

            .help,
            .warning {
                line-height: 1.5;
                background-color: var(--gray-0);
                padding: 0.5rem;
                margin-bottom: 1rem;
                font-size: 0.8rem;
            }

            .warning {
                margin-top: 0;
                background-color: var(--warning-0);
            }

            qrcg-box {
                padding: 0;
                border: 2px solid var(--gray-1);
            }

            qrcg-box::part(container) {
                padding: 1.5rem;
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

        this.data = {}
    }

    connectedCallback() {
        super.connectedCallback()
        document.addEventListener('keypress', this.onKeyPress)

        this.setDefaultData()
        this.attachGlobalStyles()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        document.removeEventListener('keypress', this.onKeyPress)
        this.detachGlobalStyles()
    }

    attachGlobalStyles() {
        this.globalStyles = document.createElement('style')

        this.globalStyles.innerHTML = styled`
            html {
                font-size: calc(14px + 6 * ((100vw - 320px) / 1240));
            }

            @media (min-width: 800px) {
                html {
                    font-size: calc(12px + 6 * ((100vw - 320px) / 1240));
                }
            }
            

            @media (min-width: 2000px) {
                html {
                    font-size: calc(12px + 6 * ((200vw) / 1240));
                }
            }
        `

        document.head.appendChild(this.globalStyles)
    }

    detachGlobalStyles() {
        this.globalStyles.remove()
    }

    async setDefaultData() {
        const defaults = await this.api.post(
            'install/load',
            this.envVariables().reduce((result, env) => {
                result[env.key] = ''
                return result
            }, {})
        )

        Object.keys(defaults).forEach((key) => {
            this.data[key] = defaults[key]
        })

        this.requestUpdate()
    }

    renderForm() {
        return this.renderEnvVariables()
    }

    renderTitle() {}

    renderContent() {
        return html`
            <h1>${this.renderTitle()}</h1>

            ${this.renderHelp()
                ? html`<div class="help">${this.renderHelp()}</div>`
                : null}
            ${this.renderWarning()
                ? html`<div class="warning">${this.renderWarning()}</div>`
                : null}

            <qrcg-form> ${this.renderForm()} </qrcg-form>
        `
    }

    renderHelp() {}

    doNotRequireFields() {}

    verifyFields() {
        let hasInvalid = false

        this.inputs.forEach((input) => {
            const pattern = this.doNotRequireFields()

            if (
                !isEmpty(pattern) &&
                input.name.match(new RegExp(pattern, 'i'))
            ) {
                return
            }

            if (isEmpty(input.value)) {
                input.errors = ['This field is required']
                hasInvalid = true
            }
        })

        if (hasInvalid) {
            throw new Error('Some fields are invalid')
        }
    }

    get inputs() {
        return this.renderRoot.querySelectorAll('[name]')
    }

    resetValidationErrors() {}

    envVariables() {
        return []
    }

    renderEnvVariables() {
        return this.envVariables().map((env) => {
            if (env.type === 'qrcg-balloon-selector') {
                return html`
                    <qrcg-balloon-selector
                        .options=${env.options}
                        name=${env.key}
                    >
                        ${env.name}
                    </qrcg-balloon-selector>
                `
            }

            return html`
                <qrcg-input
                    name=${env.key}
                    placeholder=${env.placeholder}
                    type=${env.type}
                >
                    ${env.name}
                </qrcg-input>
            `
        })
    }

    renderNextButton() {
        if (this.isLast()) {
            return html`<qrcg-button @click=${this.goNext}
                >Complete Setup</qrcg-button
            >`
        }

        return this.getNextLink()
            ? html` <qrcg-button @click=${this.goNext}>Next</qrcg-button> `
            : html`<div class="noop next"></div>`
    }

    renderWarning() {}

    isLast() {
        return false
    }

    renderNavigation() {
        return html`
            <div class="navigation">
                ${this.getBackLink()
                    ? html`
                          <qrcg-button href=${this.getBackLink()}
                              >Back</qrcg-button
                          >
                      `
                    : html`<div class="noop back"></div>`}
                ${this.renderNextButton()}
            </div>
        `
    }

    getBackLink() {}

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.goNext()
        }
    }

    async goNext() {
        this.resetInputErrors()

        try {
            this.verifyFields()

            if (this.envVariables().length > 0) await this.saveEnvVariables()

            if (this.verifyLink()) await this.verify()

            if (this.isLast()) {
                return this.completeInstallation()
            }

            if (this.getNextLink()) push(this.getNextLink())
        } catch (ex) {
            console.error(ex)
        }
    }

    async completeInstallation() {
        const result = await this.api.post('install/complete')

        if (result.pass) {
            push('/account/login?installed=true')

            showToast(
                'Installation completed. Login with super user credetntials.'
            )
        } else {
            showToast('Cannot complete installation!')
        }
    }

    resetInputErrors() {
        this.inputs.forEach((elem) => {
            elem.errors = []
        })
    }

    getNextLink() {}

    verifyLink() {}

    verificationFailedMessage() {}

    verificationSuccessMessage() {}

    async verify() {
        const result = await this.api.post(this.verifyLink(), {})

        if (!result.pass) {
            //
            const message = result.message ?? this.verificationFailedMessage()

            showToast(message)

            throw new Error(message)
        }

        showToast(this.verificationSuccessMessage())
    }

    saveEnvVariables() {
        return this.api.post('install/save', this.data)
    }

    render() {
        return html`
            <qrcg-box>
                ${this.renderContent()} ${this.renderNavigation()}
            </qrcg-box>
        `
    }
}
