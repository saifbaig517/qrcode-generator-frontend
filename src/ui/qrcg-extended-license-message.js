import { LitElement, html, css } from 'lit'
import { BrandUrl } from '../core/brand-url-helper'

export class QrcgExtendedLicenseMessage extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                background-color: var(--gray-0);
                padding: 0.5rem 1rem;
                display: flex;
                justify-content: space-between;

                align-items: center;
            }

            p {
                margin-right: 1rem;
            }

            qrcg-button {
            }
        `,
    ]

    render() {
        return html`
            <p>This feature is available to the extended license only.</p>

            <qrcg-button href="${BrandUrl.pricingUrl()}">
                Upgrade Now
            </qrcg-button>
        `
    }
}
window.defineCustomElement(
    'qrcg-extended-license-message',
    QrcgExtendedLicenseMessage
)
