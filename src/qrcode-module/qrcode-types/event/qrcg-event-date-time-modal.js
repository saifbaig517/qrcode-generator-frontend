import { html, css } from 'lit'

import { ImageListModal } from '../webpage-design-inputs/image-list-input/modal'
import { t } from '../../../core/translate'

export class QrcgEventDateTimeModal extends ImageListModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    renderFileInput() {
        return null
    }

    renderInputs() {
        return html`
            <qrcg-input name="day_name" placeholder="${t`Day 1`}" required>
                ${t`Day name`}
            </qrcg-input>

            <qrcg-input
                required
                name="date"
                type="date"
                placeholder="${t`Date`}"
            >
                ${t`Date`}
            </qrcg-input>

            <qrcg-input
                name="time_from"
                type="time"
                placeholder="${t`Time`}"
                required
            >
                ${t`Time from`}
            </qrcg-input>

            <qrcg-input
                name="time_to"
                type="time"
                placeholder="${t`Time`}"
                required
            >
                ${t`Time to`}
            </qrcg-input>

            <qrcg-textarea
                name="description"
                placeholder="${t`Optional description`}"
            >
                ${t`Description`}
            </qrcg-textarea>
        `
    }
}

window.defineCustomElement('qrcg-event-date-time-modal', QrcgEventDateTimeModal)
