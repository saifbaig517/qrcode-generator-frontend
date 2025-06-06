import { html } from 'lit'
import { t } from '../core/translate'

import { QrcgDashboardForm } from '../dashboard/qrcg-dashboard-form'
import { BalloonSelector } from '../ui/qrcg-balloon-selector'

export class QrcgCurrencyForm extends QrcgDashboardForm {
    constructor() {
        super({
            apiBaseRoute: 'currencies',
            singularName: 'Currency',
        })
    }

    renderFormFields() {
        return html`
            <qrcg-input name="name" placeholder=${t`Currency name`}>
                ${t`Name`}
            </qrcg-input>

            <qrcg-input name="currency_code" placeholder=${t`Currency code`}>
                ${t`Currency Code`}
            </qrcg-input>

            <qrcg-input name="symbol" placeholder=${t`Symbol`}>
                ${t`Symbol`}
            </qrcg-input>

            <qrcg-input name="thousands_separator" placeholder=",">
                ${t`Thousands Sepeartor`}
            </qrcg-input>

            <qrcg-input name="decimal_separator" placeholder=".">
                ${t`Decimal Separator`}
            </qrcg-input>

            <qrcg-balloon-selector
                name="decimal_separator_enabled"
                .options=${BalloonSelector.OPTIONS_ENABLED_DISABLED}
            >
                ${t`Decimal Separator. Default (Enabled)`}
                <div slot="instructions">
                    ${t`Always add decimal separator even if the number after the decimal point is zero, e.g. 10.00`}
                </div>
            </qrcg-balloon-selector>

            <qrcg-balloon-selector
                name="symbol_position"
                .options=${[
                    {
                        name: t`Before Number`,
                        value: 'before',
                    },
                    {
                        name: t`After Number`,
                        value: 'after',
                    },
                ]}
            >
                ${t`Symbol Position`}
            </qrcg-balloon-selector>
        `
    }
}
window.defineCustomElement('qrcg-currency-form', QrcgCurrencyForm)
