import { mdiFileDocument } from '@mdi/js'
import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'

import './qrcg-icon'

export class QrcgCopyIcon extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                cursor: pointer;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
                color: var(--gray-2);
                position: relative;
                transition: all 0.3s ease;
                -webkit-tap-highlight-color: transparent;
                padding: 0 0.5rem 0.5rem 0.5rem;
            }

            :host(:hover) {
                color: black;
            }

            :host([success]) {
                color: var(--success-0);
            }

            .copy {
                pointer-events: none;
                font-size: 0.5rem;
                font-weight: bold;
                position: absolute;
                transition: all 0.3s ease;
                left: 50%;
                transform: translate(-50%, -50%);
                bottom: -0.3rem;
            }

            .copy.success {
                opacity: 0;
                bottom: 0.1rem;
            }

            :host([success]) .copy.normal {
                opacity: 0;
                bottom: -0.4rem;
            }

            :host([success]) .copy.success {
                display: block;
                opacity: 1;
                bottom: -0.3rem;
            }
        `,
    ]

    static get properties() {
        return {
            success: { type: Boolean, reflect: true },
        }
    }

    connectedCallback() {
        super.connectedCallback()

        if (!window.isSecureContext) {
            this.style.display = 'none'
        }

        this.addEventListener('click', this.onClick)

        this.title = t`Copy`
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        this.removeEventListener('click', this.onClick)
    }

    onClick() {
        this.success = true

        setTimeout(() => {
            this.success = false
        }, 2000)

        const text = this.textContent.trim()

        window.navigator.clipboard.writeText(text)
    }

    render() {
        if (!window.isSecureContext) {
            return null
        }

        return html`
            <qrcg-icon part="icon" mdi-icon=${mdiFileDocument}></qrcg-icon>
            <span class="copy normal">${t`Copy`}</span>
            <span class="copy success">${t`Copied`}</span>
        `
    }
}

window.defineCustomElement('qrcg-copy-icon', QrcgCopyIcon)
