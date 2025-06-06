import { html, css } from 'lit'
import { t } from '../core/translate'
import { QrcgModal } from '../ui/qrcg-modal'

export class QrcgQrcodeStatsDateRangeModal extends QrcgModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static async open(from, to) {
        const modal = new QrcgQrcodeStatsDateRangeModal()

        document.body.appendChild(modal)

        const promise = modal.open()

        await new Promise((r) => setTimeout(r))

        modal.setFrom(from)

        modal.setTo(to)

        return promise
    }

    $(s) {
        return this.shadowRoot.querySelector(s)
    }

    setFrom(from) {
        console.log('setting from', from)
        if (from) this.$('[name="from"]').value = from
    }

    setTo(to) {
        if (to) this.$('[name="to"]').value = to
    }

    async onAffirmativeClick() {
        this.resolve({
            from: this.$('[name="from"]').value,
            to: this.$('[name="to"]').value,
        })

        this.close()
    }

    renderTitle() {
        return t`Select date`
    }

    renderBody() {
        return html`
            <qrcg-input type="date" name="from"> ${t`From`} </qrcg-input>

            <qrcg-input type="date" name="to"> ${t`To`} </qrcg-input>
        `
    }
}

window.defineCustomElement(
    'qrcg-qrcode-stats-date-range-modal',
    QrcgQrcodeStatsDateRangeModal
)
