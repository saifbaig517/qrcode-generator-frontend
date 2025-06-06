import { LitElement, html, css } from 'lit'
import { t } from '../core/translate'
import { confirm } from './qrcg-confirmation-modal'
import { isEmpty } from '../core/helpers'

export class QrcgInputErrors extends LitElement {
    static styles = [
        css`
            :host {
                display: block;
                position: absolute;
                font-size: 0.8rem;
                font-weight: bold;
                bottom: -0.25rem;
                transform: translateY(100%);
                color: var(--danger);
            }

            .error {
                display: flex;
                justify-content: space-between;
                left: 0;
                right: 0;
                animation: fade-in ease 1s both;
            }

            .error-expand {
                display: block;
                font-weight: normal;
                color: var(--primary-0);
                margin-left: 1rem;
                text-decoration: underline;
                cursor: pointer;
            }

            @keyframes fade-in {
                from {
                    opacity: 0;
                }

                to {
                    opacity: 1;
                }
            }
        `,
    ]

    static get properties() {
        return {
            errors: {
                type: Array,
            },
        }
    }

    async onErrorExpandClick() {
        try {
            await confirm({
                title: t`Error details`,
                message: this.renderErrorList(),
                negativeText: null,
                affirmativeText: t`OK`,
            })
        } catch {
            //
        }
    }

    renderErrorList() {
        return html`
            <ul style="padding: 0 0 0 1rem;">
                ${this.errors.map((e) => html`<li>${e}</li>`)}
            </ul>
        `
    }

    render() {
        if (isEmpty(this.errors)) return

        const hasManyErrors =
            this.errors.length > 1 || this.errors[0].length > 30

        if (hasManyErrors) {
            return html`
                <label class="error">
                    <span>${this.errors[0].substring(0, 30)} ...</span>
                    <span
                        class="error-expand"
                        @click=${this.onErrorExpandClick}
                    >
                        ${t`view details`}
                    </span>
                </label>
            `
        }
        return html` <label class="error"> ${this.errors[0]}</label> `
    }
}

window.defineCustomElement('qrcg-input-errors', QrcgInputErrors)
