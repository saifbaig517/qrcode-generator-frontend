import { LitElement, html, css } from 'lit'
import { get } from '../core/api'
import { isEmpty } from '../core/helpers'
import { t } from '../core/translate'

export class QrcgTimezoneSelect extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            qrcg-select {
                width: 100%;
            }
        `,
    ]

    static get properties() {
        return {
            name: {},
            value: {},
            timezones: { type: Array },
        }
    }

    connectedCallback() {
        super.connectedCallback()
        this.fetchTimezones()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
    }

    async fetchTimezones() {
        const { response } = await get('system/timezones')

        let timezones = await response.json()

        this.timezones = timezones
    }

    render() {
        if (isEmpty(this.timezones)) {
            return html`<qrcg-select disabled>${t`Loading ...`}</qrcg-select>`
        }

        return html`
            <qrcg-select name=${this.name} value=${this.value}>
                ${this.timezones.map((t) => html`<option>${t}</option>`)}

                <span slot="label">
                    <slot>${t`Timezone`}</slot>
                </span>
            </qrcg-select>
        `
    }
}
window.defineCustomElement('qrcg-timezone-select', QrcgTimezoneSelect)
