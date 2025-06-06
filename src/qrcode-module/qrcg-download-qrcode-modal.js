import { html, css } from 'lit'

import { QrcgModal } from '../ui/qrcg-modal'
import { t } from '../core/translate'

export class QrcgDownloadQrcodeModal extends QrcgModal {
    static styles = [
        super.styles,
        css`
            :host {
                display: block;
            }
        `,
    ]

    static get properties() {
        return {
            size: {},
        }
    }

    constructor() {
        super()

        this.size = 512
    }

    connectedCallback() {
        super.connectedCallback()

        this.addEventListener('on-input', this.onInput)
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('on-input', this.onInput)
    }

    onInput(e) {
        if (e.detail.name === 'size') {
            this.size = e.detail.value
        }
    }

    resolvedData() {
        return this.size
    }

    renderSizeSelector() {
        return html`
            <qrcg-balloon-selector
                name="size"
                .value=${this.size}
                .options=${[
                    {
                        name: '512px',
                        value: 512,
                    },
                    {
                        name: '1024px',
                        value: 1024,
                    },
                    {
                        name: '2048px',
                        value: 2048,
                    },
                    {
                        name: '4k',
                        value: 4096,
                    },
                ]}
            >
                ${t`Select Size`}
            </qrcg-balloon-selector>
        `
    }

    renderTitle() {
        return t`File Size`
    }

    renderBody() {
        return html` ${this.renderSizeSelector()} `
    }
}

window.defineCustomElement(
    'qrcg-download-qrcode-modal',
    QrcgDownloadQrcodeModal
)
