import { LitElement, html, css } from 'lit'
import { get } from '../core/api'
import { isEmpty, remToPx } from '../core/helpers'
import { Config } from '../core/qrcg-config'
import { t } from '../core/translate'

export class QrcgMobileInput extends LitElement {
    static styles = [
        css`
            :host {
                display: flex;
                flex-direction: column;
                position: relative;
            }

            :host([disabled]) {
                pointer-events: none;
                opacity: 0.5;
            }

            .label {
                position: absolute;
                left: 0.5rem;
                z-index: 1;
                height: 1.25rem;
                display: flex;
                align-items: center;
                justify-content: center;
                bottom: 1rem;
                padding: 0.25rem;
                font-size: 0.8rem;
                border-radius: 0.25rem;
                background-color: var(--gray-0);
            }

            .label.focused {
                box-shadow: 0 0 0 0.1rem var(--gray-2);
            }

            select {
                appearance: none;
                -webkit-appearance: none;
                min-width: 0;
                border: 1px solid black;
                position: absolute;
                top: -0.5rem;
                left: -0.5rem;
                right: 0;
                bottom: -0.5rem;
                opacity: 0;
                cursor: pointer;
            }
        `,
    ]

    static get properties() {
        return {
            callingCodes: { type: Array },
            myIsoCode: {},
            myCallingCode: {},
            name: {},
            value: {},
            mobileNumber: {},
            errors: { type: Array },
            placeholder: {},
            disabled: { type: Boolean, reflect: true },
        }
    }

    constructor() {
        super()
        this.callingCodes = []
        this.disabled = false
    }

    connectedCallback() {
        super.connectedCallback()

        this.fetchData()
    }

    async fetchData() {
        await this.fetchCallingCodes()

        await this.fetchMyDetails()

        this.syncMyIsoCode()
    }

    $(selector) {
        return this.shadowRoot.querySelector(selector)
    }

    syncMyIsoCode() {
        this.$('select').value = this.myIsoCode
    }

    async fetchMyDetails() {
        const { response } = await get('utils/my-calling-code')

        const data = await response.json()

        this.myIsoCode = data.iso_code

        this.myCallingCode = data.calling_code
    }

    async fetchCallingCodes() {
        const { response } = await get('utils/list-calling-codes')

        const data = await response.json()

        this.callingCodes = data.filter((item) => {
            const name = item.country_name ?? ''

            return !isEmpty(name.trim())
        })
    }

    formatCallingCode(callingCode) {
        return `+${callingCode}`
    }

    onSelectChange(e) {
        this.myIsoCode = e.target.value

        this.myCallingCode = this.callingCodeByIsoCode(e.target.value)
    }

    callingCodeByIsoCode(isoCode) {
        return this.callingCodes.find((c) => c.iso_code == isoCode).calling_code
    }

    updated(changed) {
        if (changed.has('myCallingCode')) {
            this.computeMyCallingCodeLabelWidthAndSyncInputPadding()
        }

        if (changed.has('myCallingCode') || changed.has('mobileNumber')) {
            this.fireOnInput()
        }

        if (changed.has('value')) {
            if (!isEmpty(this.value)) {
                this.myIsoCode = this.value.iso_code
                this.mobileNumber = this.value.mobile_number
            } else {
                this.mobileNumber = ''
            }
        }
    }

    fireOnInput() {
        const value = {
            iso_code: this.myIsoCode,
            mobile_number: this.mobileNumber,
            calling_code: this.myCallingCode,
        }

        this.dispatchEvent(
            new CustomEvent('on-input', {
                bubbles: true,
                composed: true,
                detail: {
                    name: this.name,
                    value,
                },
            })
        )
    }

    computeMyCallingCodeLabelWidthAndSyncInputPadding() {
        const label = this.$('.label')

        const width = label.getBoundingClientRect().width

        this.$('qrcg-input').input.style = `padding-left: ${
            width + remToPx(1)
        }px`
    }

    onSelectFocus() {
        this.$('.label').classList.add('focused')
    }

    onSelectBlur() {
        this.$('.label').classList.remove('focused')
    }

    renderCountryCodesSelect() {
        return html`
            <select
                @change=${this.onSelectChange}
                @focus=${this.onSelectFocus}
                @blur=${this.onSelectBlur}
            >
                ${this.callingCodes.map((entry) => {
                    return html`
                        <option value=${entry.iso_code}>
                            ${entry.country_name}
                            (${this.formatCallingCode(entry.calling_code)})
                        </option>
                    `
                })}
            </select>
        `
    }

    async onMobileNumberInput(e) {
        e.stopImmediatePropagation()

        const value = e.detail.value.replace(/[^\d]/g, '')

        this.mobileNumber = value

        this.$('qrcg-input').setValue(this.mobileNumber)
    }

    renderCountryCodesLabel() {
        return html`
            <div class="label" @click=${this.onLabelClick}>
                ${isEmpty(this.myCallingCode)
                    ? '--'
                    : this.formatCallingCode(this.myCallingCode)}
                ${this.renderCountryCodesSelect()}
            </div>
        `
    }

    render() {
        return html`
            ${this.renderCountryCodesLabel()}

            <qrcg-input
                placeholder=${this.placeholder}
                type="tel"
                pattern="\\d*"
                @on-input=${this.onMobileNumberInput}
                .value=${this.mobileNumber}
                .errors=${this.errors}
            >
                <slot></slot>
            </qrcg-input>
        `
    }

    static renderBasedOnConfigs(name = 'mobile_number') {
        const config = Config.get('app.mobile_number_field')

        const shouldShow = config === 'optional' || config === 'mandatory'

        if (!shouldShow) return

        return html`
            <qrcg-mobile-input name="${name}">
                ${t`Mobile number`}
            </qrcg-mobile-input>
        `
    }
}

window.defineCustomElement('qrcg-mobile-input', QrcgMobileInput)
