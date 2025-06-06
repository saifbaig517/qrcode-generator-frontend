import { html } from 'lit'
import { LeadFormBaseQuestion } from './base-question'
import { t } from '../../core/translate'

export class LeadFormTextAreaQuestion extends LeadFormBaseQuestion {
    static get type() {
        return 'textarea'
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
