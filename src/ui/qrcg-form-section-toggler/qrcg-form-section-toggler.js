import { html } from 'lit'
import style from './qrcg-form-section-toggler.scss?inline'
import { BaseComponent } from '../../core/base-component/base-component'
import { mdiUnfoldMoreHorizontal } from '@mdi/js'
import { QrcgFormSection } from '../qrcg-form-section'

export class QrcgFormSectionToggler extends BaseComponent {
    static tag = 'qrcg-form-section-toggler'

    static styleSheets = [...super.styleSheets, style]

    expanded = true

    onExpandToggleClick() {
        this.expanded = !this.expanded

        document.dispatchEvent(
            new CustomEvent(QrcgFormSection.EVENT_REQUEST_SET_EXPANDED, {
                detail: {
                    expanded: this.expanded,
                },
            })
        )
    }

    render() {
        return html`
            <qrcg-icon
                mdi-icon=${mdiUnfoldMoreHorizontal}
                @click=${this.onExpandToggleClick}
            ></qrcg-icon>
        `
    }
}

QrcgFormSectionToggler.register()
