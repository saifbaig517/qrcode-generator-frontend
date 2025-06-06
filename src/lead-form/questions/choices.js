import { html } from 'lit'
import { LeadFormBaseQuestion } from './base-question'
import { t } from '../../core/translate'

export class LeadFormChoicesQuestion extends LeadFormBaseQuestion {
    static get type() {
        return 'choices'
    }

    render() {
        return html`
            ${super.render()}
            <!-- -->

            <qrcg-textarea
                name="choices"
                placeholder=${t`Add choices here ...`}
            >
                <div slot="instructions">${t`Each choice in a line.`}</div>
                ${t`Choices`}
            </qrcg-textarea>

            <qrcg-balloon-selector
                name="is_multiple"
                .options=${[
                    {
                        name: t`Multiple Choices`,
                        value: 'multiple',
                    },
                    {
                        name: t`Single Choice`,
                        value: 'single',
                    },
                ]}
            >
                ${t`Type. Default (Single).`}
            </qrcg-balloon-selector>
        `
    }
}
