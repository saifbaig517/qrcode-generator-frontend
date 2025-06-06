import { html } from 'lit'
import { LeadFormBaseQuestion } from './base-question'
import { t } from '../../core/translate'

export class LeadFormRatingQuestion extends LeadFormBaseQuestion {
    static get type() {
        return 'rating'
    }

    render() {
        return html`
            ${super.render()}
            <!-- -->

            <qrcg-input
                name="rating_from"
                type="number"
                min="0"
                placeholder=${t`Default` + ' 0'}
            >
                ${t`Start From`}
            </qrcg-input>

            <qrcg-input
                name="rating_to"
                type="number"
                min="0"
                placeholder=${t`Default` + ' 5'}
            >
                ${t`To`}
            </qrcg-input>
        `
    }
}
