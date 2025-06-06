import { css, html } from 'lit'

import { ImageListInput } from '../webpage-design-inputs/image-list-input/input'
import { QrcgEventDateTimeModal } from './qrcg-event-date-time-modal'

export class QrcgEventDateTimeInput extends ImageListInput {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }

            .day-date {
                color: var(--gray-2);
                display: inline-block;
                margin-left: 1rem;
            }
        `,
    ]

    static get properties() {
        return {
            ...super.properties,
        }
    }

    renderItemImage() {
        return null
    }

    getItemName(item) {
        return html`
            <span class="day-name"> ${item.day_name} </span>

            <span class="day-date"> ${item.date} </span>
        `
    }

    openItemModal(data) {
        return QrcgEventDateTimeModal.open({
            data,
            qrcodeId: this.qrcodeId,
        })
    }
}
window.defineCustomElement('qrcg-event-date-time-input', QrcgEventDateTimeInput)
