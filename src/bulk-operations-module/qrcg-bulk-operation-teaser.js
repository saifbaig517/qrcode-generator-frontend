import { LitElement, html, css } from 'lit'
import { ConfigHelper } from '../core/config-helper'
import { BrandUrl } from '../core/brand-url-helper'

export class QrcgBulkOperationTeaser extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
            }

            * {
                box-sizing: border-box;
            }

            iframe {
                margin: 2rem auto;
                display: block;
            }

            .instructions {
                display: flex;
                align-items: center;
            }

            qrcg-button {
                margin-left: auto;
            }

            qrcg-button::part(button) {
                width: max-content;
            }

            p {
                margin: 0;
                margin-right: 1rem;
            }

            .iframe-container {
                position: relative;
                overflow: hidden;
                width: 100%;
                padding-top: 56.25%; /* 16:9 Aspect Ratio (divide 9 by 16 = 0.5625) */
            }

            /* Then style the iframe to fit in the container div with full height and width */
            iframe {
                position: absolute;
                top: 0;
                left: 0;
                bottom: 0;
                right: 0;
                width: 100%;
                height: 100%;
            }

            @media (max-width: 900px) {
                .instructions {
                    flex-direction: column;
                }

                .instructions qrcg-button {
                    margin-top: 1.5rem;
                    margin-left: auto;
                    margin-right: auto;
                }

                p {
                    margin: 0;
                }
            }
        `,
    ]

    getEnv() {
        if (ConfigHelper.isDemo()) {
            return 'Demo'
        }

        return 'Regular License'
    }

    getLabel() {
        if (ConfigHelper.isDemo()) {
            return 'Feature Disabled'
        }

        return `Upgrade Required`
    }

    renderUpgradeButton() {
        const text = ConfigHelper.isDemo() ? 'Buy Now' : 'Upgrade Now'

        return html`
            <qrcg-button href="${BrandUrl.pricingUrl()}" target="_blank">
                ${text}
            </qrcg-button>
        `
    }

    render() {
        return html`
            <qrcg-form-comment label=${this.getLabel()}>
                <div class="instructions">
                    <p>
                        This feature is disabled in <b> ${this.getEnv()} </b> it
                        is available in the <b> Extended License </b> only.
                        Watch the demo video below.
                    </p>

                    ${this.renderUpgradeButton()}
                </div>
            </qrcg-form-comment>

            <div class="iframe-container">
                <iframe
                    src="https://www.youtube.com/embed/1dHg1S6lIgE"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowfullscreen
                ></iframe>
            </div>
        `
    }
}

window.defineCustomElement(
    'qrcg-bulk-operation-teaser',
    QrcgBulkOperationTeaser
)
