import { html } from 'lit'
import style from './selector.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { t } from '../../core/translate'

export class LeadFormSelector extends BaseComponent {
    static tag = 'qrcg-lead-form-selector'

    static styleSheets = [...super.styleSheets, style]

    render() {
        return html` ${t`Hello from lead form selector`} `
    }
}

LeadFormSelector.register()
