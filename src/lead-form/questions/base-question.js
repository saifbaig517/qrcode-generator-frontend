import { html } from 'lit'
import { t } from '../../core/translate'

export class LeadFormBaseQuestion {
    static get type() {
        throw new Error('Must be implemented in child type')

        // eslint-disable-next-line
        return ''
    }

    render() {
        return html`
            <qrcg-input name="text" placeholder=${t`Add your question here`}>
                ${t`Question`}
            </qrcg-input>

            <!-- -->

            <qrcg-textarea
                name="description"
                placeholder=${t`Optional description`}
            >
                ${t`Description`}
            </qrcg-textarea>

            <qrcg-balloon-selector
                name="required"
                .options=${[
                    {
                        name: t`Required`,
                        value: 'required',
                    },
                    {
                        name: t`Optional`,
                        value: 'optional',
                    },
                ]}
            >
                ${t`Required. Default (Optional)`}
            </qrcg-balloon-selector>
        `
    }
}
