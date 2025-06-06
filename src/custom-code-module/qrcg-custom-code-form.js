import { html } from 'lit'
import { get } from '../core/api'
import { t } from '../core/translate'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'

import '../ui/qrcg-code-input'

export class QrcgCustomCodeForm extends QrcgDashboardForm {
    constructor() {
        super({
            apiBaseRoute: 'custom-codes',
        })

        this.positions = []
    }

    static get properties() {
        return {
            ...super.properties,
            positions: { type: Array },
        }
    }

    connectedCallback() {
        super.connectedCallback()
        this.addEventListener('on-input', this.onCustomCodeFormInput)
        this.fetchPositions()
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onCustomCodeFormInput)
    }

    async fetchPositions() {
        const { response } = await get('custom-codes/positions')

        this.positions = await response.json()
    }

    renderFormFields() {
        return html`
            <qrcg-input name="name" placeholder="${t`e.g. Facebook Pixel`}">
                ${t`Name`}
            </qrcg-input>
            <qrcg-select name="language">
                <span slot="label"> ${t`Language`} </span>
                <option value="javascript">JavaScript</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
            </qrcg-select>
            <qrcg-searchable-select name="position">
                <span slot="label"> ${t`Position`} </span>
                ${this.positions.map(
                    (p) => html` <option value="${p}">${t(p)}</option> `
                )}
            </qrcg-searchable-select>

            <qrcg-input
                name="sort_order"
                type="number"
                step="1"
                placeholder="0"
            >
                <span>${t`Sort order`}</span>
                <span slot="instructions">
                    ${t`Control the sort order of the code block. `}
                </span>
            </qrcg-input>

            <qrcg-code-input name="code" language=${this.data.language}>
                <span> ${t`Code`} </span>
            </qrcg-code-input>
        `
    }
}
window.defineCustomElement('qrcg-custom-code-form', QrcgCustomCodeForm)
