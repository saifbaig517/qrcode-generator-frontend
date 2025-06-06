import { LitElement, css, svg } from 'lit'
import { unsafeStatic, html } from 'lit/static-html.js'
import { isEmpty } from '../core/helpers'

/**
 * Use material design icons easily
 *
 * import { mdiAccount } from '@mdi/js'
 *  ...
 * <qrcg-icon mdi-icon=${mdiAccount}></qrcg-icon>
 */
class QRCGICon extends LitElement {
    static get styles() {
        return css`
            :host {
                display: inline-flex;
                font-size: 0;
                width: 1rem;
                height: 1rem;
                position: relative;
            }

            :host([disabled]) {
                pointer-events: none;
                opacity: 0.1;
            }

            svg {
                width: 100%;
                height: 100%;
                pointer-events: none;
            }

            svg * {
                pointer-events: none;
            }

            path {
                fill: currentColor;
            }
        `
    }

    static get properties() {
        return {
            /**
             * Raw string that represents path drawing instructions,
             * Works best with Google's Material Icons
             */
            mdiIcon: {
                type: String,
                attribute: 'mdi-icon',
            },

            icon: {
                type: String,
            },

            disabled: { type: Boolean, reflect: true },
        }
    }

    constructor() {
        super()
    }

    render() {
        if (!isEmpty(this.mdiIcon))
            return svg`
                <svg
                    viewBox="0 0 24 24"
                >
                    <path fill="currentColor" d=${this.mdiIcon} />
                </svg>
            `

        return html`${unsafeStatic(this.icon)}`
    }
}

window.defineCustomElement('qrcg-icon', QRCGICon)
