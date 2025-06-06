import { mdiCog } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'

import { QrcgBusinessHoursModal } from './qrcg-business-hours-modal'

import { FormInputController } from './form-input-controller'

export class QrcgBusinessHoursInput extends LitElement {
    inputController = new FormInputController(
        this,
        FormInputController.MODE_BASE64
    )

    static styles = [
        css`
            :host {
                display: block;
            }

            header {
                display: flex;
                margin-bottom: 0.5rem;
                align-items: center;
            }

            .open-modal qrcg-icon {
                height: 1rem;
                width: 1rem;
            }

            .open-modal::part(button) {
                padding: 0.5rem;
                min-width: 0;
            }

            .row {
                display: flex;
                margin-bottom: 0.5rem;
                padding: 0.5rem;
                background-color: var(--gray-0);
            }

            .row .day {
                flex: 1;
            }

            .row .from {
                margin-right: 1rem;
            }

            label {
                font-size: 0.8rem;
                font-weight: bold;
                letter-spacing: 1px;
                user-select: none;
                display: block;
                margin-right: 1rem;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: {
                converter: FormInputController.VALUE_CONVERTER,
            },
        }
    }

    constructor() {
        super()

        this.value = QrcgBusinessHoursModal.makeDefaultValue()
    }

    getValue() {
        if (isEmpty(this.value)) {
            return QrcgBusinessHoursModal.makeDefaultValue()
        }

        return this.value
    }

    fireOnInput(value) {
        this.dispatchEvent(
            new CustomEvent('on-input', {
                composed: true,
                bubbles: true,
                detail: {
                    name: this.name,
                    value,
                },
            })
        )
    }

    async openModal() {
        const value = await QrcgBusinessHoursModal.open(this.value)

        this.value = value

        this.fireOnInput(value)

        this.requestUpdate()
    }

    sortedDays(value) {
        return QrcgBusinessHoursModal.sortedDays(value)
    }

    renderDays() {
        const value = this.getValue()

        return this.sortedDays(value).map((day) => {
            return html`
                <div class="row">
                    <div class="day">
                        ${t(QrcgBusinessHoursModal.baseDayName(day))}
                    </div>
                    ${value[day].enabled
                        ? html`
                              <div class="from">${value[day].from}</div>
                              <div class="to">${value[day].to}</div>
                          `
                        : html` <div>${t`Closed`}</div> `}
                </div>
            `
        })
    }

    render() {
        return html`
            <input name=${this.name} type="hidden" />

            <header>
                <label>
                    <slot></slot>
                </label>

                <qrcg-button
                    @click=${this.openModal}
                    transparent
                    class="open-modal"
                >
                    <qrcg-icon mdi-icon=${mdiCog}></qrcg-icon>
                </qrcg-button>
            </header>

            ${this.renderDays()}
        `
    }
}
window.defineCustomElement('qrcg-business-hours-input', QrcgBusinessHoursInput)
