import { html } from 'lit'
import { LeadFormBaseQuestion } from './base-question'
import { t } from '../../core/translate'

export class LeadFormTextQuestion extends LeadFormBaseQuestion {
    static get type() {
        return 'text'
    }

    render() {
        return html`
            ${super.render()}

            <qrcg-input
                name="placeholder_text"
                placeholder="${t`Type your answer here ...`}"
            >
                ${t`Placeholder Text`}
            </qrcg-input>
        `
    }
}
