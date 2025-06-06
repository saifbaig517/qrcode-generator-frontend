import { LitElement, html, css } from 'lit'
import { push } from '../core/qrcg-router'
import { url } from '../core/helpers'

export class QrcgPiecexDemo extends LitElement {
    static styles = [
        css`
            :host {
                position: fixed;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background-color: var(--gray-0);
            }

            div {
                color: var(--primary-0);
                margin-bottom: 1rem;
            }
        `,
    ]

    connectedCallback() {
        super.connectedCallback()

        localStorage['is_piecex_demo'] = 'true'

        setTimeout(() => {
            push(url('/account/login'))
        }, 1500)
    }

    render() {
        return html`
            <div>Redirecting you now</div>
            <qrcg-loader></qrcg-loader>
        `
    }
}

window.defineCustomElement('qrcg-piecex-demo', QrcgPiecexDemo)
