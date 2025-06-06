import { html } from 'lit'
import { LeadFormBaseQuestion } from './base-question'
import { t } from '../../core/translate'
import { PluginManager } from '../../../plugins/plugin-manager'
import { ACTION_LEAD_FORM_AFTER_STARS_QUESTION } from '../../../plugins/plugin-actions'

export class LeadFormStarsQuestion extends LeadFormBaseQuestion {
    static get type() {
        return 'stars'
    }

    renderAfterQuestion() {
        return PluginManager.doActions(
            ACTION_LEAD_FORM_AFTER_STARS_QUESTION,
            this
        )
    }

    render() {
        return html`
            ${super.render()}
            <!-- -->

            <qrcg-input
                name="number_of_stars"
                type="number"
                min="1"
                placeholder=${t`Default 5`}
            >
                ${t`Number of Stars`}
            </qrcg-input>

            ${this.renderAfterQuestion()}
        `
    }
}
